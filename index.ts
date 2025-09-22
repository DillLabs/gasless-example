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

const pimlicoUrl = `http://165.154.152.224:3000`

const pimlicoClient = createPimlicoClient({
	chain: elementalsDevnet,
	transport: http(pimlicoUrl),
	entryPoint: {
		address: "0xF0cFA4305ea6278Db5aB39C2E03889D608F71776",
		version: "0.7",
	},
})


const account = await toSafeSmartAccount({
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
console.log(`Smart account address: ${await account.getAddress()}`)

const smartAccountClient = createSmartAccountClient({
	account,
	chain: elementalsDevnet,
	bundlerTransport: http(pimlicoUrl),
	userOperation: {
		estimateFeesPerGas: async () => {
			return (await pimlicoClient.getUserOperationGasPrice()).fast
		},
	},
})
//
let txHash = await smartAccountClient.sendTransaction({
	to: "0xa8E399291Ab35232BCC68327Ab505f989fa71F4f",
	data: "0xf8a8fd6d",
	value: 0,
	paymaster: undefined,  // 👈 disable paymaster calls
})

console.log(`HelloWorld User operation included: ${txHash}`)



let createRoomData = buildCreateRoomData();
console.log("createRoomData: ", createRoomData)
let txHashCreateRoom = await smartAccountClient.sendTransaction({
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

let roomAddr = "";
let submitCardsHashData = buildSubmitCardsHashData(roomAddr)
console.log("submitCardsHashData: ", submitCardsHashData)
const txHashSubmitCardsHash = await smartAccountClient.sendTransaction({
	to: roomAddr,
	data: submitCardsHashData,
	value: 0,
	paymaster: undefined,  // 👈 disable paymaster calls
})

console.log(`submitCardsHash User operation included: ${txHashSubmitCardsHash}`)
