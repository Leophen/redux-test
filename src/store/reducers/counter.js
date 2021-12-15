import * as actions from '../actions'
import * as actionTypes from '../actionTypes'

const defaultState = {
  count: 0
}

export default function counter(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.ADD_COUNT:
      return actions.handleAddCount(state, action)
    case actionTypes.SUB_COUNT:
      return actions.handleSubCount(state, action)
    case actionTypes.MULTI_COUNT:
      return actions.handleMultiCount(state, action)
    default:
      return state
  }
}
