import {ethers, JsonRpcProvider, Wallet} from "ethers";
// 0x59554b201cFc12E6930a3631060C3d9CDF704F67
import { ROOM_CONTRACT_ABI } from './roomAbi';
import { ROOM_MANAGER_CONTRACT_ABI } from './roomManagerAbi';
import {IACCOUNT_ABI} from './IAccountAbi';

const roomManagerContract = new ethers.Contract("0x59554b201cFc12E6930a3631060C3d9CDF704F67", ROOM_MANAGER_CONTRACT_ABI, null);
const player1 = new Wallet(`${process.env.PLAYER1_PRIV_KEY}`)
const player2 = new Wallet(`${process.env.PLAYER2_PRIV_KEY}`)

export function buildCreateRoomData():string {
    console.log("player1.address: ", player1.address);
    console.log("player2.address: ", player2.address);
    return  roomManagerContract.interface.encodeFunctionData("CreateRoom", ["0xF0bb910F0bb5bc67338a87B8e7617E432E5C1cB3", "0x2Bb9e4Fe5dE4CD2607663260D76Cd96071eE070c", player2.address,   player1.address, 3600, 3, 1231231])
}

export function buildExecTransactionFromModuleReturnDataData(roomAddr:string):string {
    let to = "0x59554b201cfc12e6930a3631060c3d9cdf704f67"
    let value = "0x1"
    let data = "0x576eb81f000000000000000000000000f0bb910f0bb5bc67338a87b8e7617e432e5c1cb30000000000000000000000002bb9e4fe5de4cd2607663260d76cd96071ee070c0000000000000000000000006061c1f47b3cb437f92acfd845cfaa2d2bfdd6d50000000000000000000000005a46403aae66b9efe6a10e446cecd0dd40e065c10000000000000000000000000000000000000000000000000000000000000e100000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000012c97f"
    let operation = 0
    return  new ethers.Contract(roomAddr, IACCOUNT_ABI, null).interface.encodeFunctionData("execTransactionFromModuleReturnData", [to, value, data, operation])
}

export function buildSubmitCardsHashData(roomAddr:string):string {
    let cards = "firewatersoil"
    let salt = "asdasd123asdsfgfg"
    let cardsHash = ethers.solidityPackedKeccak256(
        ["string", "string"],
        [cards, salt]
    )
    let contract = new ethers.Contract(roomAddr, ROOM_CONTRACT_ABI, null);
    return  contract.interface.encodeFunctionData("SubmitCardsHash", [cardsHash, 1])
}
