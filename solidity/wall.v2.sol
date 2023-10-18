// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatWall {

    struct Message {
        address sender;
        string content;
    }
    
    Message[] public messages;
    uint public postCount = 0;
    
    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Content is empty");
        require(bytes(_content).length <= 280, "Content is too long");
        
        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content
        });
        
        messages.push(newMessage);

        postCount++;
    }
     
    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessagesFromIndex(uint startIndex) public view returns (Message[] memory) {
        require(startIndex < messages.length, "Invalid start index");

        Message[] memory result = new Message[](postCount - startIndex);
        for (uint i = 0; i < (postCount - startIndex); i++) {
            result[i] = messages[startIndex + i];
        }
        return result;
    }


} //end

contract ChatWallFactory {
    
    event ChatWallDeployed(address indexed chatWallAddress, address indexed owner);

    // Function to deploy a new ChatWall
    function deployNewChatWall() public returns (address) {
        ChatWall chatWall = new ChatWall();
        emit ChatWallDeployed(address(chatWall), msg.sender);
        return address(chatWall);
    }
}
