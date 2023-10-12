
import { contractDetails } from './abi.js';



let web3;
let userAddress;
let chatWallAbi;
let chatWallFactoryAbi;
let chatWallFactoryAddress;


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
            let network;
            switch(netId) {
                case 1: 
                    networkName = 'Ethereum'; 
                    network = 'ethereum';
                    chatWallFactoryAddress = contractDetails[network].address;
                    chatWallFactoryAbi = contractDetails[network].factoryAbi;
                    chatWallAbi = contractDetails[network].wallAbi;
                    break;
                case 42161: 
                    networkName = 'Arbitrum'; 
                    network = 'arbitrum';
                    chatWallFactoryAddress = contractDetails[network].address;
                    chatWallFactoryAbi = contractDetails[network].factoryAbi;
                    chatWallAbi = contractDetails[network].wallAbi;
                    break;
                case 10: 
                    networkName = 'Optimism'; 
                    network = 'optimism';
                    chatWallFactoryAddress = contractDetails[network].address;
                    chatWallFactoryAbi = contractDetails[network].factoryAbi;
                    chatWallAbi = contractDetails[network].wallAbi;
                    break;
                default: 
                    networkName = 'Unknown'; 
                    break;
            }
            $('#title').text(`${networkName} Chat Wall`);
            $('#networkConnected').text(networkName);
            $('#chatWallAddress').attr('placeholder', 'Enter ' + networkName + ' Chat Wall Address or Program ID');

            //setNetworkIcon(networkName);

        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.error("Ethereum browser not detected!");
    }
}

async function switchNetwork() {
    const network = document.getElementById('networkSelect').value;
    
    let chainId;
    switch (network) {
        
        case "ethereum":
            console.log(network);
            chainId = '0x1';  // Ethereum Mainnet
            break;
        case "arbitrum":
            console.log(network);
            chainId = '0xA4B1';  // Arbitrum One Mainnet
            break;
        case "optimism":
            console.log(network);
            chainId = '0xA';  // Optimism Mainnet
            break;
        default:
            console.log(network);
            return;
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



async function continuouslyFetchMessages() {
    // A setInterval function that fetches messages every 10 seconds
    setInterval(async function() {
        if(!web3) return;
        const chatWallAddress = $("#chatWallAddress").val();
        if (!chatWallAddress) return;  // If no chat wall address is set, don't try to fetch
        const chatWall = new web3.eth.Contract(chatWallAbi, chatWallAddress);
        try {
            const messages = await chatWall.methods.getAllMessages().call();
            $("#messages").empty();
            messages.forEach(msg => {
                $("#messages").append(`<p><strong>${msg.sender}</strong>: ${msg.content}</p>`);
            });
        } catch (error) {
            console.error("Error retrieving messages:", error);
        }
    }, 3000);
}

// Call the function to initiate continuous fetch
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

export { connectWallet, switchNetwork, postNewMessage, deployNewChatWall, copyToClipboard };
