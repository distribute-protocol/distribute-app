const fetcProjectFulfilled = payload => ({ type: PROJECT_STATE_RECEIVED, payload })

export const projectStateEpic = action$ =>
  action$.ofType('GET_PROJECT_STATE')
  .mergeMap(action =>
    ajax.getJSON(`https://api.github.com/users/${action.payload}`)
      .map(response => fetchUserFulfilled(response))
  );
    // .delay(1000) // Asynchronously wait 1000ms then continue
    // .mapTo({ type: 'PROJECT_STATE_RECEIVED' });
