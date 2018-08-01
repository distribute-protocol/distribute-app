import { MINT_TOKENS, SELL_TOKENS } from '../constants/TokenActionTypes'
import { tokensMinted, tokensSold } from '../actions/tokenActions'
import { map, mergeMap } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { Observable } from 'rxjs'
import { dt } from '../utilities/blockchain'

const mintTokensEpic = action$ =>
  action$.ofType(MINT_TOKENS).pipe(
    mergeMap(action =>
      Observable.from(dt.mint(action.amount, action.txObj))
    ),
    map(receipt => tokensMinted(receipt.logs[0].args))
  )

const sellTokensEpic = action$ =>
  action$.ofType(SELL_TOKENS).pipe(
    mergeMap(action =>
      Observable.from(dt.sell(action.amount, action.txObj))
    ),
    map(receipt => tokensSold(receipt.logs[0].args))
  )

export default (action$, store) => merge(
  mintTokensEpic(action$, store),
  sellTokensEpic(action$, store)
)
