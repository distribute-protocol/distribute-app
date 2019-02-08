import { TRANSACTION_PENDING, TRANSACTION_SUCCESS, TRANSACTION_FAILURE, CLEAR_TRANSACTION } from '../constants/TransactionActionTypes'

const initialState = {
  txStatus: null,
  txReceipts: []
}

export default function transactionReducer (state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  // console.log('navigationReducer')
  let txReceipts
  switch (action.type) {
    case TRANSACTION_PENDING:
      return Object.assign({}, state, { txStatus: 'pending' })
    case TRANSACTION_SUCCESS:
      txReceipts = state.txReceipts
      txReceipts.push(action.txReceipt)
      return Object.assign({}, state, { txStatus: 'success', txReceipts })
    case TRANSACTION_FAILURE:
      txReceipts = state.txReceipts
      txReceipts.push(action.txReceipt)
      return Object.assign({}, state, { txStatus: 'failure', txReceipts })
    case CLEAR_TRANSACTION:
      return { txStatus: null }
  }
  return state
}
