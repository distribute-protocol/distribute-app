import { MINT_TOKENS, SELL_TOKENS } from '../constants/TokenActionTypes'
import { tokensMinted, tokensSold } from '../actions/tokenActions'
import { transactionPending, transactionSuccess, transactionFailure } from '../actions/transactionActions'
import { map, mergeMap, catchError, flatMap } from 'rxjs/operators'
import { from, merge, concat, of } from 'rxjs'
import { dt } from '../utilities/blockchain'

// const mintTokensEpic = action$ =>
//   action$.ofType(MINT_TOKENS).pipe(
//     mergeMap(action => {
//       transactionPending()
//       return Promise.resolve(action)
//     }),
//     mergeMap(action =>
//       from(dt.mint(action.amount, action.txObj))
//     ),
//     map(receipt => {
//       if (receipt.receipt.status === '0x1') {
//         tokensMinted(receipt.logs[0].args)
//         return transactionSuccess()
//       } else {
//         return transactionFailure()
//       }
//     })
//   )

const mintTokensEpic = action$ =>
  action$.ofType(MINT_TOKENS).pipe(
    mergeMap(action => concat(
      of(transactionPending()),
      from(dt.mint(action.amount, action.txObj)).pipe(
        mergeMap(receipt => {
          if (receipt.receipt.status === '0x1') {
            return concat(
              of(tokensMinted(receipt.logs[0].args)),
              of(transactionSuccess())
            )
          } else {
            return transactionFailure()
          }
        }),
        catchError(err => {
          if (err) { console.log(err); return of(transactionFailure()) }
        })
      )
    ))
  )

const sellTokensEpic = action$ =>
  action$.ofType(SELL_TOKENS).pipe(
    mergeMap(action =>
      from(dt.sell(action.amount, action.txObj))
    ),
    map(receipt => tokensSold(receipt.logs[0].args))
  )

export default (action$, store) => merge(
  mintTokensEpic(action$, store),
  sellTokensEpic(action$, store)
)
