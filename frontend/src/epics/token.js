import { MINT_TOKENS, SELL_TOKENS } from '../constants/TokenActionTypes'
import { tokensMinted, tokensSold } from '../actions/tokenActions'
import { transactionPending, transactionSuccess, transactionFailure } from '../actions/transactionActions'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { from, merge, concat, of } from 'rxjs'
import { dt } from '../utilities/blockchain'

const mintTokensEpic = action$ =>
  action$.ofType(MINT_TOKENS).pipe(
    mergeMap(action => concat(
      of(transactionPending()),
      from(dt.mint(action.amount, action.txObj)).pipe(
        mergeMap(receipt => {
          if (receipt.receipt.status === '0x1') {
            return concat(
              of(tokensMinted(receipt)),
              of(transactionSuccess(receipt))
            )
          } else {
            return transactionFailure(receipt)
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
    map(receipt => tokensSold(receipt))
  )

export default (action$, store) => merge(
  mintTokensEpic(action$, store),
  sellTokensEpic(action$, store)
)
