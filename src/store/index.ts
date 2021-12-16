import { createStore } from 'redux'
import reducers from './reducers/index'

const store = createStore(reducers)
export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch