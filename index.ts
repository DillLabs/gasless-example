// @ts-nocheck

import "dotenv/config"
import { writeFileSync } from "fs"
import { toSafeSmartAccount } from "permissionless/accounts"
import {Hex, createPublicClient, getContract, http, Address, parseAbi} from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { createSmartAccountClient } from "permissionless"

import {Chain, ChainFormatters} from "viem/types/chain";
import {Assign, Prettify} from "viem/types/utils";
import {hardhat, sepolia} from "viem/chains";
import {
	buildCreateRoomData,
	buildExecTransactionFromModuleReturnDataData,
	buildSubmitCardsHashData,
	createRoom,
	getRoomManager
} from "./elementalsUtil";

console.log("Hello world!")
export function defineChain<formatters extends ChainFormatters, chain extends Chain<formatters>,>(chain: chain): Prettify<Assign<Chain<undefined>, chain>> {
	return {
		formatters: undefined,
		fees: undefined,
		serializers: undefined,
		...chain,
	} as Assign<Chain<undefined>, chain>
}

let elementalsOPRpc=`http://165.154.125.213:8545`
export const elementalsDevnet = /*#__PURE__*/ defineChain({
	id: '814',
	name: 'Elementals-OP',
	network: 'elementals',
	nativeCurrency: {
		name: 'Elem',
		symbol: 'ELEM',
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: [elementalsOPRpc],
			webSocket: ['wss://165.154.125.213:8545'],
		},
	},
})

const privateKey =
	(process.env.PRIVATE_KEY as Hex) ??
	(() => {
		const pk = generatePrivateKey()
		writeFileSync(".env", `PRIVATE_KEY=${pk}`)
		return pk
	})()
console.log('privateKey', privateKey)
let acc = privateKeyToAccount(privateKey)
console.log('acc', acc.address)

const publicClient = createPublicClient({
	chain: elementalsDevnet,
	transport: http(elementalsOPRpc),
})

const pimlicoUrl = `https://bundler-dev.elementra.xyz`

const pimlicoClient = createPimlicoClient({
	chain: elementalsDevnet,
	transport: http(pimlicoUrl),
	entryPoint: {
		address: "0xF0cFA4305ea6278Db5aB39C2E03889D608F71776",
		version: "0.7",
	},
})


const roomManager = await toSafeSmartAccount({
	client: publicClient,
	owners: [privateKeyToAccount(privateKey)],
	entryPoint: {
		address: "0xb9Afc0Bf971bE3300c2c629A94f2C015871dBfA9",
		version: "0.7",
	},
	safeModuleSetupAddress:"0x191EFDC03615B575922289DC339F4c70aC5C30Af",
	safe4337ModuleAddress: "0x34264A18a4aF521f133b057FBdc7BA78126de9F6",
	multiSendAddress: "0xbF5b2ebb512cED3E03b8F0A578B17ee14cEC7017",
	multiSendCallOnlyAddress: "0x610676abcc4Cfd3B18b65A6F2120fEFcB99cDdf6",
	// erc7569LaunchpadAddress: "",
	// erc7579LaunchpadAddress: "",
	safeProxyFactoryAddress: "0x906fB9aDAb13Fa0EAa45308dc030A3C770bD9a89",
	safeSingletonAddress: "0xf48Bd91211b13e7752c5f8E08Ef75609C37480B7",
	saltNonce: "1",

	// validUntil: "",
	// validAfter: "",
	// nonceKey: "",
	// paymentToken: "",
	// payment: "",
	// paymentReceiver: "",
	version: "1.4.1",
})
console.log(`Room manager account address: ${await roomManager.getAddress()}`)

const roomManagerClient = createSmartAccountClient({
	account: roomManager,
	chain: elementalsDevnet,
	bundlerTransport: http(pimlicoUrl),
	userOperation: {
		estimateFeesPerGas: async () => {
			return (await pimlicoClient.getUserOperationGasPrice()).fast
		},
	},
})
let helloWorldTxHash = await roomManagerClient.sendTransaction({
	to: "0xa8E399291Ab35232BCC68327Ab505f989fa71F4f",
	data: "0xf8a8fd6d",
	value: 0,
	paymaster: undefined,  // 👈 disable paymaster calls
})
console.log(`HelloWorld User operation included: ${helloWorldTxHash}`)

const player1 = await toSafeSmartAccount({
	client: publicClient,
	owners: [privateKeyToAccount(process.env.PLAYER1_PRIV_KEY)],
	entryPoint: {
		address: "0xb9Afc0Bf971bE3300c2c629A94f2C015871dBfA9",
		version: "0.7",
	},
	safeModuleSetupAddress:"0x191EFDC03615B575922289DC339F4c70aC5C30Af",
	safe4337ModuleAddress: "0x34264A18a4aF521f133b057FBdc7BA78126de9F6",
	multiSendAddress: "0xbF5b2ebb512cED3E03b8F0A578B17ee14cEC7017",
	multiSendCallOnlyAddress: "0x610676abcc4Cfd3B18b65A6F2120fEFcB99cDdf6",
	safeProxyFactoryAddress: "0x906fB9aDAb13Fa0EAa45308dc030A3C770bD9a89",
	safeSingletonAddress: "0xf48Bd91211b13e7752c5f8E08Ef75609C37480B7",
	saltNonce: "1",
	version: "1.4.1",
})
console.log(`Player1 account address: ${await player1.getAddress()}`)
const player1Client = createSmartAccountClient({
	account: player1,
	chain: elementalsDevnet,
	bundlerTransport: http(pimlicoUrl),
	userOperation: {
		estimateFeesPerGas: async () => {
			return (await pimlicoClient.getUserOperationGasPrice()).fast
		},
	},
})

const player2 = await toSafeSmartAccount({
	client: publicClient,
	owners: [privateKeyToAccount(process.env.PLAYER2_PRIV_KEY)],
	entryPoint: {
		address: "0xb9Afc0Bf971bE3300c2c629A94f2C015871dBfA9",
		version: "0.7",
	},
	safeModuleSetupAddress:"0x191EFDC03615B575922289DC339F4c70aC5C30Af",
	safe4337ModuleAddress: "0x34264A18a4aF521f133b057FBdc7BA78126de9F6",
	multiSendAddress: "0xbF5b2ebb512cED3E03b8F0A578B17ee14cEC7017",
	multiSendCallOnlyAddress: "0x610676abcc4Cfd3B18b65A6F2120fEFcB99cDdf6",
	safeProxyFactoryAddress: "0x906fB9aDAb13Fa0EAa45308dc030A3C770bD9a89",
	safeSingletonAddress: "0xf48Bd91211b13e7752c5f8E08Ef75609C37480B7",
	saltNonce: "1",
	version: "1.4.1",
})
console.log(`Player2 account address: ${await player2.getAddress()}`)
const player2Client = createSmartAccountClient({
	account: player2,
	chain: elementalsDevnet,
	bundlerTransport: http(pimlicoUrl),
	userOperation: {
		estimateFeesPerGas: async () => {
			return (await pimlicoClient.getUserOperationGasPrice()).fast
		},
	},
})

let createRoomData = buildCreateRoomData(player1.address, player2.address);
console.log("createRoomData: ", createRoomData)
let txHashCreateRoom = await roomManagerClient.sendTransaction({
	calls: [{
		to: "0x59554b201cFc12E6930a3631060C3d9CDF704F67",
		data: createRoomData,
	}],
	to: "0x59554b201cFc12E6930a3631060C3d9CDF704F67",
	data: createRoomData,
	paymaster: undefined,  // 👈 disable paymaster calls
})
//
console.log(`CreateRoom User operation included: ${txHashCreateRoom}`)

let roomAddr = "0xAD76dBC469B8d34DeBdF2d316121B40C91c34Cce";
let submitCardsHashData = buildSubmitCardsHashData(roomAddr)
console.log("submitCardsHashData: ", submitCardsHashData)
const txHashSubmitCardsHash = await player1Client.sendTransaction({
	to: roomAddr,
	data: submitCardsHashData,
	value: 0,
	paymaster: undefined,  // 👈 disable paymaster calls
})

console.log(`player1 submitCardsHash User operation included: ${txHashSubmitCardsHash}`)


let submitCardsHashData2 = buildSubmitCardsHashData(roomAddr)
const txHashSubmitCardsHash2 = await player2Client.sendTransaction({
	to: roomAddr,
	data: submitCardsHashData2,
	value: 0,
	paymaster: undefined,  // 👈 disable paymaster calls
})

console.log(`player2 submitCardsHash User operation included: ${txHashSubmitCardsHash2}`)
