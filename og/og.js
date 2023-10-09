


const ethers = window.ethers;
let provider, signer;

$(document).ready(function () {
    $('#connectWalletBtn').click(connectWallet);
    $('#deployNewChatWall').click(deployChatWall);
    $('#postNewMessage').click(postMessage);
    $('#displayAllMessages').click(fetchAllMessages);
});

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        $('#walletAddressDisplay').text(accounts[0]);
    } else {
        alert('Please install MetaMask.');
    }
}

async function deployChatWall() {
    const factory = new ethers.Contract(chatWallFactoryAddress, chatWallFactoryAbi, signer);
    const tx = await factory.deployNewChatWall();
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === "ChatWallDeployed");
    const chatWallAddress = event.args.chatWallAddress;
    $('#chatWallAddressInput').val(chatWallAddress);
}

async function postMessage() {
    const message = $('#messageInput').val();
    const chatWallAddress = $('#chatWallAddressInput').val();
    const chatWall = new ethers.Contract(chatWallAddress, chatWallAbi, signer);
    await chatWall.postMessage(message);
}

async function fetchAllMessages() {
    const chatWallAddress = $('#chatWallAddressInput').val();
    const chatWall = new ethers.Contract(chatWallAddress, chatWallAbi, provider);
    const messages = await chatWall.getAllMessages();
    let content = '';
    messages.forEach(msg => {
        content += `<p><strong>${msg.sender}</strong>: ${msg.content}</p>`;
    });
    $('#messagesDisplay').html(content);
}
