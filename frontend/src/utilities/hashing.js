import { soliditySha3 } from 'web3-utils'

const hashing = {
  keccakHashes: (types, bytesarray) => {
    // {t: 'string', v: 'Hello!%'}, {t: 'int8', v:-23}, {t: 'address', v: '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'}
    let objArray = []
    for (let i = 0; i < types.length; i++) {
      types[i] === 'uint'
        ? objArray.push({t: types[i], v: bytesarray[i].toString()})
        : objArray.push({t: types[i], v: bytesarray[i]})
    }

    let hash = soliditySha3(...objArray)
    console.log('keccakHash', hash)
    return hash
  }
}

export default hashing
