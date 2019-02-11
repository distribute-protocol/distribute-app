import { TRANSACTION_PENDING, TRANSACTION_SUCCESS, TRANSACTION_FAILURE, CLEAR_TRANSACTION } from '../constants/TransactionActionTypes'

export function transactionPending () {
  return {
    type: TRANSACTION_PENDING
  }
}

export function transactionSuccess (receipt) {
  return {
    type: TRANSACTION_SUCCESS,
    receipt
  }
}

export function transactionFailure (receipt) {
  return {
    type: TRANSACTION_FAILURE,
    receipt
  }
}

export function clearTransaction () {
  return {
    type: CLEAR_TRANSACTION
  }
}
