$(document).ready(function() {

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
