# Redux 起步项目

## 一、安装

```bash
# npm
npm install redux

# yarn
yarn add redux
```

## 二、基本用法

下面用 Redux 实现一个简单的计数器：

**src/store/index.js：**

```tsx
import { createStore } from 'redux'

const defaultState = {
  count: 0
}
const reducer = (state = defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(state))  // 深拷贝
  switch (action.type) {
    case 'ADD_COUNT':
      newState.count += 1
      return newState
    case 'SUB_COUNT':
      newState.count -= 1
      return newState
    case 'MULTI_COUNT':
      newState.count *= action.payload
      return newState
    default:
      return newState
  }
}

const store = createStore(reducer)
export default store
```

**src/App.js：**

```tsx
import React, { useState } from 'react'
import store from './store/index'

const App = () => {
  const curCount = store.getState().count
  const [count, setCount] = useState(curCount)

  const handleAddCount = () => {
    store.dispatch({
      type: 'ADD_COUNT'
    })
    setCount(store.getState().count)
  }

  const handleSubCount = () => {
    store.dispatch({
      type: 'SUB_COUNT'
    })
    setCount(store.getState().count)
  }

  const handleMultiCount = () => {
    store.dispatch({
      type: 'MULTI_COUNT',
      payload: store.getState().count
    })
    setCount(store.getState().count)
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
```

运行效果：

<img src="http://tva1.sinaimg.cn/large/0068vjfvgy1gxdmioeiy7g30ie040jv8.gif" width="220" referrerPolicy="no-referrer" />

## 三、store 结构优化

### 1、分离出 Reducer

将 reducer 单独分离出来，方便管理：

**src/store/index.js：**

```js
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)
export default store
```

**src/store/reducer.js：**

```js
const defaultState = {
  count: 0
}

export default function reducer(state = defaultState, action) {
  const newState = JSON.parse(JSON.stringify(state))  // 深拷贝
  switch (action.type) {
    case 'ADD_COUNT':
      newState.count += 1
      return newState
    case 'SUB_COUNT':
      newState.count -= 1
      return newState
    case 'MULTI_COUNT':
      newState.count *= action.payload
      return newState
    default:
      return newState
  }
}
```

### 2、分离出 action 处理逻辑

将 Reducer 中的判断及逻辑处理分离，方便管理：

**src/store/reducer.js：**

```js
const defaultState = {
  count: 0
}

const handleAddCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)) // 深拷贝
  newState.count += 1
  return newState
}

const handleSubCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)) // 深拷贝
  newState.count -= 1
  return newState
}

const handleMultiCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)) // 深拷贝
  newState.count *= action.payload
  return newState
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_COUNT':
      return handleAddCount(state, action)
    case 'SUB_COUNT':
      return handleSubCount(state, action)
    case 'MULTI_COUNT':
      return handleMultiCount(state, action)
    default:
      return state
  }
}
```

可以将上面 reducer 提取出来的处理逻辑单独放在一个 actions 文件中，方便管理：

**src/store/actions.js：**

```js
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
```

**src/store/reducer.js：**

```js
import * as actions from './actions'

const defaultState = {
  count: 0
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_COUNT':
      return actions.handleAddCount(state, action)
    case 'SUB_COUNT':
      return actions.handleSubCount(state, action)
    case 'MULTI_COUNT':
      return actions.handleMultiCount(state, action)
    default:
      return state
  }
}
```

### 3、分离出 actionTypes

action 拥有一个不变的 type 以便 reducer 能够识别它们，这个 *action type* 建议定义为 string 常量。例如：

```js
const ADD_TODO = 'ADD_TODO'
```

这么做有以下好处：

- 所有的 *action type* 汇总在同一位置，可以避免命名冲突，也便于寻找；
- 当 import 的 *action type* 常量拼写错误，dispatch 这个 action 时会报错，可以快速定位问题。

可以将前面优化步骤的 *action type* 分离出来，写在一个文件中：

**src/store/actionTypes.js：**

```js
export const ADD_COUNT = 'ADD_COUNT'
export const SUB_COUNT = 'SUB_COUNT'
export const MULTI_COUNT = 'MULTI_COUNT'
```

**src/store/reducer.js：**

```js
import * as actions from './actions'
import * as actionTypes from './actionTypes'

const defaultState = {
  count: 0
}

export default function reducer(state = defaultState, action) {
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
```

### 4、使用 combineReducers 拆分 reducers

随着项目变得越来越复杂，可以将 reducer 函数拆分成多个函数来独立管理 *state* 的一部分。

[combineReducers](http://cn.redux.js.org/api/combinereducers) 可以把多个 reducer 函数合并成一个最终的 reducer 函数。合并后的 reducer 可以调用各个子 reducer，并把它们返回的结果合并成一个 *state* 对象。

由 `combineReducers()` 返回的 *state* 对象，会将传入的 reducer 返回的 *state* 按其传递给 `combineReducers()` 时对应的 key 进行命名。举个例子：

```js
rootReducer = combineReducers({
  potato: potatoReducer,
  tomato: tomatoReducer
})
// rootReducer 将返回如下的 state 对象
{
  potato: {
    // ... potatoes, 和由 potatoReducer 管理的 state 对象 ...
  },
  tomato: {
    // ... tomatoes, 和由 tomatoReducer 管理的 state 对象，比如说 sauce 属性 ...
  }
}
```

上面通过为传入对象的 reducer 命名不同的 key 来控制返回 state key 的命名。例如：

```js
// 可以调用
combineReducers({ todos: myTodosReducer, counter: myCounterReducer })
// 将 state 结构变为
{ todos, counter }

// 通常的做法是命名 reducer，然后 state 再去分割那些信息，这样就可以使用 ES6 的简写方法：
combineReducers({ counter, todos })
// 这与
combineReducers({ counter: counter, todos: todos })
// 是等价的
```

接下来对上面的 *src/store/reducer.js* 进行拆分：

**src/store/reducers/counter.js：**

```js
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
```

**src/store/reducers/index.js：**

```js
import { combineReducers } from 'redux'
import counter from './counter'

export default combineReducers({
  counter,
  // ... 其它拆分的 reducers 函数
})
```

拆分完，记得更新原 reducer 的引入以及引用的 reducer state 的值。

**src/store/index.js：**

```js
import { createStore } from 'redux'
import reducers from './reducers/index'

const store = createStore(reducer)
export default store
```

**src/App.js：**

```tsx
import React, { useState } from 'react'
import store from './store/index'

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
```

### 5、全局注入 store

上面是直接在组件中 `import` store，也可以直接在最外层容器组件中初始化 store，然后将 state 上的属性作为 props 层层传递下去。但更好的方法是使用 [react-redux](https://react-redux.js.org/) 提供的 Provider 全局注入。

首先安装 react-redux 库：

```bash
# npm
npm install react-redux

# yarn
yarn add react-redux
```

在入口文件引入 store *▼*

**src/index.js：**

```diff
  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App'
+ import store from './store'
+ import { Provider } from 'react-redux'

  ReactDOM.render(
+   <Provider store={store}>
      <App />
+   </Provider>,
    document.getElementById('root')
  )
```

在组件中使用 store *▼*

**src/App.js：**

```tsx
import React from 'react'
// import store from './store/index'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  // const curCount = store.getState().counter.count
  // const [count, setCount] = useState(curCount)
  const count = useSelector((state) => state.counter.count)
  const dispatch = useDispatch()

  const handleAddCount = () => {
    // store.dispatch({
    // type: 'ADD_COUNT'
    // })
    // setCount(store.getState().counter.count)
    dispatch({ type: 'ADD_COUNT' })
  }

  const handleSubCount = () => {
    // store.dispatch({
    // type: 'SUB_COUNT'
    // })
    // setCount(store.getState().counter.count)
    dispatch({ type: 'SUB_COUNT' })
  }

  const handleMultiCount = () => {
    // store.dispatch({
    // type: 'MULTI_COUNT',
    // payload: store.getState().counter.count
    // })
    // setCount(store.getState().counter.count)
    dispatch({ type: 'MULTI_COUNT', payload: count })
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
```

**注意：**如果使用 TS 的话，可能会出现以下错误：

<img src="http://tva1.sinaimg.cn/large/0068vjfvgy1gxfnlonvz2j31dy060wkz.jpg" width="777" referrerPolicy="no-referrer" />

需要做以下处理 *▼*

**src/store/index.ts：**

```diff
  import { createStore } from 'redux'
  import reducers from './reducers/index'

  const store = createStore(reducers)
  export default store

+ export type RootState = ReturnType<typeof store.getState>
+ export type AppDispatch = typeof store.dispatch
```

然后新建 hooks 文件 *▼*

**src/store/hooks.ts：**

```ts
import type { TypedUseSelectorHook} from 'react-redux';
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

在组件引入新声明的 hooks *▼*

**src/App.tsx：**

```tsx
import React from 'react'
import './index.scss'
// import { useSelector, useDispatch } from 'react-redux'
import { useAppSelector, useAppDispatch } from './store/hooks'

const App = () => {
  // const count = useSelector((state) => state.counter.count)
  const count = useAppSelector((state) => state.counter.count)
  // const dispatch = useDispatch()
  const dispatch = useAppDispatch()

  const handleAddCount = () => {
    dispatch({ type: 'ADD_COUNT' })
  }

  const handleSubCount = () => {
    dispatch({ type: 'SUB_COUNT' })
  }

  const handleMultiCount = () => {
    dispatch({ type: 'MULTI_COUNT', payload: count })
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
```

react-redux 还可以使用 [useStore](https://react-redux.js.org/api/hooks#usestore) 的 Hook 来引入 store，然后进行原始的 store 操作。
