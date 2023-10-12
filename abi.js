export const contractDetails = {
    ethereum: {
        address: '0xYourEthereumContractAddress',
        factoryAbi: [],  
		wallAbi: [],  

    },
    arbitrum: {
        address: '0xf64247338331D3e83c52B37704F3DB214b4319Cb',
        factoryAbi: [{
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
		}],  
		wallAbi: [{
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
		}],  
  
    },
    optimism: {
        address: '0xYourOptimismContractAddress',
        abi: []  
    }
};
