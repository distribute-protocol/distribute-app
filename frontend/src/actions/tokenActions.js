import { MINT_TOKENS, TOKENS_MINTED, SELL_TOKENS, TOKENS_SOLD } from '../constants/TokenActionTypes'

export function mintTokens (amount, txObj) {
  return {
    type: MINT_TOKENS,
    amount,
    txObj
  }
}

export function tokensMinted (receipt) {
  return {
    type: TOKENS_MINTED,
    receipt
  }
}

export function sellTokens (amount, txObj) {
  return {
    type: SELL_TOKENS,
    amount,
    txObj
  }
}

export function tokensSold (receipt) {
  return {
    type: TOKENS_SOLD,
    receipt
  }
}
