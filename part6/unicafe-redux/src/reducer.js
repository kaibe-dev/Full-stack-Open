const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const addedGood = {
        ...state,
        good: state.good + 1
      }
      return addedGood

    case 'OK':
      const addedOk = {
        ...state,
        ok: state.ok + 1
      }
      return addedOk

    case 'BAD':
      const addedBad = {
        ...state,
        bad: state.bad + 1
      }
      return addedBad
      
    case 'ZERO':
      return initialState
    
    default: return state
  }
  
}

export default counterReducer
