import { soliditySHA3 } from 'ethereumjs-abi'

const hashing = {
  keccakHashes: (types, bytesarray) => {
    let hash = soliditySHA3(types, bytesarray).toString('hex')
    // console.log('keccakHash', hash)
    return hash
  }
}

export default hashing
