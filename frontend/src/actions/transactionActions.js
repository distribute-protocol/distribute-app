import { TRANSACTION_PENDING, TRANSACTION_SUCCESS, TRANSACTION_FAILURE, CLEAR_TRANSACTION } from '../constants/TransactionActionTypes'

export function transactionPending () {
  return {
    type: TRANSACTION_PENDING
  }
}

export function transactionSuccess () {
  return {
    type: TRANSACTION_SUCCESS
  }
}

export function transactionFailure () {
  return {
    type: TRANSACTION_FAILURE
  }
}

export function clearTransaction () {
  return {
    type: CLEAR_TRANSACTION
  }
}
