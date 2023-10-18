
import { contractDetails } from './abi.js';

let web3;
let userAddress;
let chatWallAbi;
let chatWallFactoryAbi;
let chatWallFactoryAddress;
let network;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            $("#walletAddress").text(userAddress);

            // Fetching the network name
            const netId = await web3.eth.net.getId();
            let networkName;
            switch(netId) {
                /*case 1: 
                    networkName = 'Ethereum'; 
                    network = 'ethereum';
                    break;*/
                case 42161: 
                    networkName = 'Arbitrum'; 
                    network = 'arbitrum';
                    break;
                case 10: 
                    networkName = 'Optimism'; 
                    network = 'optimism';
                    break;
                case 534352:
                    networkName = 'Scroll';
                    network = 'scroll';
                    break;
                default: 
                    networkName = 'Unknown'; 
                    break;
            }
            chatWallFactoryAddress = contractDetails[network].address;
            chatWallFactoryAbi = contractDetails['abi'].factory;
            chatWallAbi = contractDetails['abi'].wall;
            $('#title').text(`${networkName} Chat Wall`);
            $('#networkConnected').text(networkName);
            $('#chatWallAddress').attr('placeholder', 'Enter ' + networkName + ' Chat Wall Address or Program ID');

    
            let ensName = await ethEns(userAddress);
            let displayAddress = ensName ? ensName : userAddress;
            $("#walletAddress").text(displayAddress);

           
            $("#chatWallAddress").val("");

        } catch (error) {
            console.error("User denied account access ", error);
        }
    } else {
        console.error("Ethereum browser not detected!");
    }

    
}

async function ethEns(address) { //api key needed or its slowed to a snail
    //too lazy to redo all web3.js to ethers, and ethers has an ens reverse lookup, web3 does not...
    const api = "W2N54FH5UFHKUTPM49SPN2BIJEIZPK5FZS";
    let provider = new ethers.providers.EtherscanProvider( "homestead" , api )
    let ensName = await provider.lookupAddress(address);
    return ensName;
}


async function switchNetwork() { //these need hex values
    const network = document.getElementById('networkSelect').value;
    
    let chainId;
    switch (network) {
        
        /*case "ethereum":
            console.log(network);
            chainId = '0x1';  // Ethereum Mainnet
            break;*/
        case "arbitrum":
            console.log(network);
            chainId = '0xA4B1';  // Arbitrum One Mainnet
            break;
        case "optimism":
            console.log(network);
            chainId = '0xA';  // Optimism Mainnet
            break;
        case "scroll":
            console.log(network);
            chainId = '0x82750';
            break;
        default:
            console.log(network);
            break;
    }
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
        });
        
        // After switching the network, connect the wallet and update the UI.
        connectWallet();

    } catch (error) {
        if(error.code === 4902) {
            console.error("The requested network is not added to MetaMask.");
        } else {
            console.error("User rejected request to switch network or the network switch failed.");
        }
    }
}




async function postNewMessage() {
    if(!web3) return alert('Please connect your MetaMask first.');

    const message = $("#message").val();
    const chatWallAddress = $("#chatWallAddress").val();

    const chatWall = new web3.eth.Contract(chatWallAbi, chatWallAddress);
    $('#postMessageButton').addClass('is-loading');
    try {
        await chatWall.methods.postMessage(message).send({ from: userAddress });
        console.log("posted message");
        $('#postMessageButton').removeClass('is-loading');
    } catch (error) {
        $('#postMessageButton').removeClass('is-loading');
        console.error("Error posting message:", error);
    }
}

 

//function getMessagesFromIndex(uint startIndex) public view returns (Message[] memory) {
let counter = 0;
let oldAddress;    
let ensCount = 0;
async function fetchMessages() {
        if(!web3) return;
        const chatWallAddress = $("#chatWallAddress").val();
        
        //do need a way to reset counter, and enscount
        if(chatWallAddress != oldAddress) {
            ensCount =0;
            counter = 0;
            oldAddress = chatWallAddress;
        }

        if (!chatWallAddress) return;  // If no chat wall address is set, don't try to fetch
        const chatWall = new web3.eth.Contract(chatWallAbi, chatWallAddress);
        let postCount =  await chatWall.methods.postCount().call();
        console.log("postCount: ", postCount, "counter: ", counter); //scroll l2 bugs if postCouht is not called here? weird.
        if(counter == 0) {
            try {
                const messages = await chatWall.methods.getAllMessages().call();
                $("#messages").empty(); //this rewrite all messages...will make more efficent later
                messages.forEach(msg => {
                    let className = "sender" + counter;
                    $("#messages").append(`<p><strong class=${className}>${msg.sender}</strong>: ${msg.content}</p>`);
                    counter++;
                });
                getAllNames(postCount);
            } catch (error) {
                console.error("Error retrieving messages:", error);
            }
        } else if(counter < postCount) { //adding new messages
            try {
            const newMessages = await chatWall.methods.getMessagesFromIndex(counter).call();
            newMessages.forEach(msg => {
                let className = "sender" + counter;
                $("#messages").append(`<p><strong class=${className}>${msg.sender}</strong>: ${msg.content}</p>`);
                counter++;
            });
            getAllNames(postCount);

            } catch (error) {
                console.error("Error retrieving messages:", error);
            }
        }
        
        
}

async function getAllNames(postCount) {
    for(ensCount; ensCount < postCount; ensCount++) {
        let className = ".sender" + ensCount;
        let e = $(className);
        let address = e.text();
        console.log("allnames ", address);
        let ensName = await ethEns(address);
        e.text(ensName);
    }
    console.log("enscount: ", ensCount);
}


// Call the function to initiate continuous fetch
function continuouslyFetchMessages() {
    fetchMessages()
        .then(() => {
            setTimeout(continuouslyFetchMessages, 3000); // Call the function again after 5 seconds
        })
        .catch(error => {
            console.error("Error in myAsyncFunction:", error);
            setTimeout(continuouslyFetchMessages, 3000); // Still retry even if there's an error
        });
}

continuouslyFetchMessages();

async function deployNewChatWall() {
    
    const factoryContract = new web3.eth.Contract(chatWallFactoryAbi, chatWallFactoryAddress);
    document.getElementById('deployButton').classList.add('is-loading');

    try {
        const estimatedGas = await factoryContract.methods.deployNewChatWall().estimateGas({ from: userAddress });

        factoryContract.methods.deployNewChatWall().send({ from: userAddress, gas: estimatedGas })
            .on('transactionHash', function(hash) {
                console.log("chatwall tx sent, not confirmed");
            })
            .on('receipt', function(receipt) {
                // This callback will be triggered once the transaction is mined
                console.log("chatwall tx confirmed");
                const deployedAddress = receipt.events.ChatWallDeployed.returnValues[0];
                $('#deployedAddress').text(deployedAddress);
                $('#deployedField').show();  // Show the deployed address field

                if ($('#chatWallAddress').val().trim() === '') {
                    $('#chatWallAddress').val(deployedAddress); // Replace 'Default Value' with your desired default value
                }

                document.getElementById('deployButton').classList.remove('is-loading');
            })
            .on('error', function(error) {
                // This callback will be triggered in case of a transaction failure
                console.error('Deployment failed', error);
                document.getElementById('deployButton').classList.remove('is-loading');
            });

    } catch (error) {
        document.getElementById('deployButton').classList.remove('is-loading');
        console.error('Error estimating gas or deploying chat wall:', error);
    }
}

function copyToClipboard() {
    const deployedAddress = document.getElementById('deployedAddress').textContent;
    navigator.clipboard.writeText(deployedAddress).then(function() {
        console.log('Address copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text to clipboard: ', err);
    });
}

/*
function setNetworkIcon(networkName) {
    const iconElement = document.querySelector(".network_icon");

    switch(networkName) {
        case 'Arbitrum':
            iconElement.src = "/arb.svg";
            iconElement.alt = "Arbitrum Network Icon";
            break;
        case 'Optimism':
            iconElement.src = "/op.png";
            iconElement.alt = "optimism Network Icon";
            break;
        default:
            break;
    }
}


function arbEns(address) { //need cors so its blocked
    let api = "https://api.prd.space.id/v1/getName?tld=arb1&address=" + address;
    console.log(apiUrl);
    
    return fetch(apiUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("arbens ", data.name);
            return data.name;
        })
        .catch(error => {
            console.error("Error fetching or parsing data:", error);
            throw error; // You can re-throw the error if you want to propagate it further
        });
}



async function ens(address, network) { //we dont use this anymore, various name services inconsitent and buggy
    try{
        let ensName;
        switch(network) {
            case 'ethereum': 
                break;
            case 'arbitrum':
                break;
            default: 
                break;
        }
    } catch(error) {
        console.error('There was a problem with the ens api:', error.message);
        return null;
    }
    
    return NULL;
}

async function getPostCount() {
    const chatWallAddress = $("#chatWallAddress").val();

    const chatWall = new web3.eth.Contract(chatWallAbi, chatWallAddress);
    let count =  await chatWall.methods.postCount().call();
        $("#output2").text(count);
}
*/
export { connectWallet, switchNetwork, postNewMessage, fetchMessages, deployNewChatWall, copyToClipboard };
