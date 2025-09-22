export const ROOM_MANAGER_CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_player1",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_player2",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_player1_tmp",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_player2_tmp",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_totalRound",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_roomAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_initialHP",
                "type": "uint256"
            }
        ],
        "name": "RoomCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_player1",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_player2",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_player1_tmp",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_player2_tmp",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_roundTimeout",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalRound",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialHP",
                "type": "uint256"
            }
        ],
        "name": "CreateRoom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "Rooms",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newManager",
                "type": "address"
            }
        ],
        "name": "addManager",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_creator",
                "type": "address"
            }
        ],
        "name": "listRooms",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "managerIndex",
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
