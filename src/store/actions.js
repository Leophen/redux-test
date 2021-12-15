export const handleAddCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)) // 深拷贝
  newState.count += 1
  return newState
}

export const handleSubCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)) // 深拷贝
  newState.count -= 1
  return newState
}

export const handleMultiCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)) // 深拷贝
  newState.count *= action.payload
  return newState
}
