import { getEthPriceNow } from 'get-eth-price'
import { web3 } from './blockchain'

export const weiToDollar = (weiAmount) => {
  getEthPriceNow().then(ethPrice => {
    return ethPrice[Object.keys(ethPrice)].ETH.USD
  }).then(ethPrice => {
    if (typeof ethPrice === 'undefined') {
      return 9
    } else {
      let ethAmount = web3.fromWei(weiAmount, 'ether')
      return parseFloat(ethPrice * ethAmount).toFixed(2)
    }
  })
}
