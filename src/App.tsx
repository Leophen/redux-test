import React, { useState } from 'react'
import store from './store/index'
import './index.scss'

const App = () => {
  const curCount = store.getState().counter.count
  const [count, setCount] = useState(curCount)

  const handleAddCount = () => {
    store.dispatch({
      type: 'ADD_COUNT'
    })
    setCount(store.getState().counter.count)
  }

  const handleSubCount = () => {
    store.dispatch({
      type: 'SUB_COUNT'
    })
    setCount(store.getState().counter.count)
  }

  const handleMultiCount = () => {
    store.dispatch({
      type: 'MULTI_COUNT',
      payload: store.getState().counter.count
    })
    setCount(store.getState().counter.count)
  }

  return (
    <div>
      <button onClick={handleAddCount}>+1</button>
      <button onClick={handleSubCount}>-1</button>
      <button onClick={handleMultiCount}>× last</button>
      <span>{count}</span>
    </div>
  )
}

export default App
