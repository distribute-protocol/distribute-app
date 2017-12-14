import { TokenRegistryABI, TokenRegistryAddress, TokenRegistryBytecode } from '../abi/TokenRegistry'
import { ReputationRegistryABI, ReputationRegistryAddress, ReputationRegistryBytecode } from '../abi/ReputationRegistry'
import { ProjectRegistryABI, ProjectRegistryAddress, ProjectRegistryBytecode } from '../abi/ProjectRegistry'
import { DistributeTokenABI, DistributeTokenAddress, DistributeTokenBytecode } from '../abi/DistributeToken'

import Eth from 'ethjs'
export const eth = new Eth(window.web3.currentProvider)
// async checkTransactionMined (txhash) {
//   try {
//     let txreceipt = (await eth.getTransactionReceipt(txhash))
//     let mined
//     txreceipt.status === 1
//     ? mined = true
//     : mined = false
//     //console.log(txreceipt.status)
//     //console.log(mined)
//     return mined
//   } catch (error) {
//     throw new Error(error)
//   }
// }

const TR = eth.contract(JSON.parse(TokenRegistryABI), TokenRegistryBytecode)
export const tr = TR.at(TokenRegistryAddress)
const RR = eth.contract(JSON.parse(ReputationRegistryABI), ReputationRegistryBytecode)
export const rr = RR.at(ReputationRegistryAddress)
const PR = eth.contract(JSON.parse(ProjectRegistryABI), ProjectRegistryBytecode)
export const pr = PR.at(ProjectRegistryAddress)
const DT = eth.contract(JSON.parse(DistributeTokenABI), DistributeTokenBytecode)
export const dt = DT.at(DistributeTokenAddress)

export default {TR, tr, RR, rr, PR, pr, DT, dt}
