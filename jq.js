import { connectWallet, switchNetwork, postNewMessage, deployNewChatWall, copyToClipboard } from './wall.js';


$(document).ready(function() {

    $('#networkSelect').on('change', function() {
        switchNetwork();
    });
    
    $('#connectWalletButton').on('click', function() {
        connectWallet();
    });

    $('#postMessageButton').on('click', function() {
        postNewMessage();
    });

    $('#deployButton').on('click', function() {
        deployNewChatWall();
    });

    $('#copyButton').on('click', function() {
        copyToClipboard();
    });

    

});
