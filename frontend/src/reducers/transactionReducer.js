import { TRANSACTION_PENDING, TRANSACTION_SUCCESS, TRANSACTION_FAILURE, CLEAR_TRANSACTION } from '../constants/TransactionActionTypes'

const initialState = {
  txStatus: null
}

export default function transactionReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  // console.log('navigationReducer')
  switch (action.type) {
    case TRANSACTION_PENDING:
      return { txStatus: 'pending' }
    case TRANSACTION_SUCCESS:
      return { txStatus: 'success' }
    case TRANSACTION_FAILURE:
      return { txStatus: 'failure' }
    case CLEAR_TRANSACTION:
      return { txStatus: null }
  }
  return state
}
