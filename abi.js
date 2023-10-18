export const contractDetails = {
    ethereum: {
        address: '',
    },
    arbitrum: {
        address: '',
    },
    optimism: {
        address: '0xd9E7149C7659fc8454D35E79cc8Dff4B82ee6224',
    },
	scroll: {
        address: '',
    },
	abi: { 
		factory: [{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "chatWallAddress",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "ChatWallDeployed",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "deployNewChatWall",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		}] 
	,  
	wall: [
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_content",
					"type": "string"
				}
			],
			"name": "postMessage",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllMessages",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "sender",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "content",
							"type": "string"
						}
					],
					"internalType": "struct ChatWall.Message[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "startIndex",
					"type": "uint256"
				}
			],
			"name": "getMessagesFromIndex",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "sender",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "content",
							"type": "string"
						}
					],
					"internalType": "struct ChatWall.Message[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "messages",
			"outputs": [
				{
					"internalType": "address",
					"name": "sender",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "content",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "postCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]
	}
};
