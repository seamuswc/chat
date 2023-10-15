export const contractDetails = {
    ethereum: {
        address: '0x667D15Dd78021F27b8a49478524Fe6a264f273A7',
    },
    arbitrum: {
        address: '0xf64247338331D3e83c52B37704F3DB214b4319Cb',
    },
    optimism: {
        address: '0x34AF2562A607AF45b94bCC967aC8c9E7DC0204c1',
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
	wall: [{
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
		}]
	}
};
