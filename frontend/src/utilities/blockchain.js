import { TokenRegistryABI, TokenRegistryAddress } from '../abi/TokenRegistry'
import { ReputationRegistryABI, ReputationRegistryAddress } from '../abi/ReputationRegistry'
import { ProjectRegistryABI, ProjectRegistryAddress } from '../abi/ProjectRegistry'
import { DistributeTokenABI, DistributeTokenAddress } from '../abi/DistributeToken'
import { ProjectABI } from '../abi/Project'
import Web3 from 'web3'
import contract from 'truffle-contract'

let web3init
if (typeof web3init !== 'undefined') {
  web3init = new Web3(window.web3.currentProvider)
} else {
  // set the provider you want from Web3.providers
  web3init = new Web3(window.web3.currentProvider)
  // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
}

export const web3 = web3init
export const eth = web3init.eth

// export const P = web3.eth.contract(JSON.parse(ProjectABI))
// const TR = web3.eth.contract(JSON.parse(TokenRegistryABI))
// export const tr = TR.at(TokenRegistryAddress)
// const RR = web3.eth.contract(JSON.parse(ReputationRegistryABI))
// export const rr = RR.at(ReputationRegistryAddress)
// const PR = web3.eth.contract(JSON.parse(ProjectRegistryABI))
// export const pr = PR.at(ProjectRegistryAddress)
// const DT = web3.eth.contract(JSON.parse(DistributeTokenABI))
// export const dt = DT.at(DistributeTokenAddress)

const TR = contract({abi: JSON.parse(TokenRegistryABI)})
TR.setProvider(window.web3.currentProvider)
export const tr = TR.at(TokenRegistryAddress)

const RR = contract({abi: JSON.parse(ReputationRegistryABI)})
RR.setProvider(window.web3.currentProvider)
export const rr = RR.at(ReputationRegistryAddress)

const PR = contract({abi: JSON.parse(ProjectRegistryABI)})
PR.setProvider(window.web3.currentProvider)
export const pr = PR.at(ProjectRegistryAddress)

const DT = contract({abi: JSON.parse(DistributeTokenABI)})
DT.setProvider(window.web3.currentProvider)
export const dt = DT.at(DistributeTokenAddress)

export const P = contract({abi: JSON.parse(ProjectABI)})
P.setProvider(window.web3.currentProvider)

export default {tr, rr, pr, dt, P}
