// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatWall {

    struct Message {
        address sender;
        string content;
    }
    
    Message[] public messages;
    
    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Content is empty");
        require(bytes(_content).length <= 280, "Content is too long");
        
        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content
        });
        
        messages.push(newMessage);
    }
     
    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }
}

contract ChatWallFactory {
    
    event ChatWallDeployed(address indexed chatWallAddress, address indexed owner);

    // Function to deploy a new ChatWall
    function deployNewChatWall() public returns (address) {
        ChatWall chatWall = new ChatWall();
        emit ChatWallDeployed(address(chatWall), msg.sender);
        return address(chatWall);
    }
}
