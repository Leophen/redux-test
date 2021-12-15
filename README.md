# Redux 起步项目

## 一、Redux 的定义

[Redux](http://cn.redux.js.org/) 是 JavaScript 应用的状态容器，提供可预测的状态管理。

### 1、设计思想

<img className="bottom16" src="http://tva1.sinaimg.cn/large/0068vjfvgy1gxdm4gwgpkg31400u0qv7.gif" width="600" referrerPolicy="no-referrer" />

- Web 应用是一个状态机，视图与状态是一一对应的；
- 所有的状态保存在一个对象中。

### 2、应用场景

当组件有以下场景时，可以考虑使用 Redux：

- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

### 3、核心概念

#### 3-1、Store

Store 就是保存数据的地方，可以把它看成一个容器，整个应用只能有一个 Store。Redux 提供 `createStore` 函数来创建 Store。

```js
createStore(reducer, [preloadedState], [enhancer])
```

- `reducer` (*Function*): 接收两个参数，分别是当前的 state 树和要处理的 action，返回新的 state 树。
- `preloadedState` (*any*): 初始时的 state。
- `enhancer` (*Function*): 用于组合 store creator 的高阶函数，返回一个新的强化过的 store creator。可以用中间价、时间旅行、持久化等来增强 store。Redux 中唯一内置的 store enhander 是 `applyMiddleware()`。

举个例子：

```js
import { createStore } from 'redux'
const store = createStore(fn)
```

上面 `createStore` 接受另一个函数 fn 作为参数，返回新生成的 Store 对象。

#### 3-2、State

Store 对象包含所有数据，可以通过 `store.getState()` 拿到某个时点的数据，这种时点的数据集合，就叫做 *State*。

```js
import { createStore } from 'redux'
const store = createStore(fn)

const state = store.getState()
```

Redux 规定 一个 *State* 对应一个 View。只要 *State* 相同，View 就相同。

#### 3-3、Action

*State* 的变化，会导致 View 的变化。但用户接触不到 *State*，只能接触到 View。所以，*State* 的变化必须是 View 导致的。`Action` 就是 View 发出的通知，表示 State 应该要发生变化了。

`Action` 是一个对象。其中的 `type` 属性是必须的，表示 `Action` 的名称。其他属性可以自由设置，社区有一个[规范](https://github.com/acdlite/flux-standard-action)可以参考。

```js
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
}
```

上面 `Action` 的名称是 *ADD_TODO*，它携带的信息是字符串 *Learn Redux*。

可以这么理解，`Action` 描述当前发生的事情。改变 State 的唯一办法，就是使用 `Action`，它会运送数据到 Store。

#### 3-4、Action Creator

View 要发送多少种消息，就会有多少种 `Action`。如果都手写会很麻烦，可以定义一个函数来生成 `Action`，这个函数就叫 *Action Creator*。

```js
bindActionCreators(actionCreators, dispatch)
```

- `actionCreators` (*Function | Object*): 一个 *Action Creator*，或 value 是 *Action Creator* 的对象；
- `dispatch` (*Function*): 一个由 Store 实例提供的 dispatch 函数。

举个例子：

TodoActionCreators.js：

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}
```

SomeComponent.js：

```tsx
import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TodoActionCreators from './TodoActionCreators'

class TodoListContainer extends Component {
  constructor(props) {
    super(props)

    const { dispatch } = props

    this.boundActionCreators = bindActionCreators(TodoActionCreators, dispatch)
    console.log(this.boundActionCreators)
  }

  componentDidMount() {
    // 由 react-redux 注入的 dispatch：
    let { dispatch } = this.props

    // 注意：这样是行不通的：
    // TodoActionCreators.addTodo('Use Redux')

    // 你只是调用了创建 action 的方法。
    // 你必须要同时 dispatch action。

    // 这样做是可行的：
    let action = TodoActionCreators.addTodo('Use Redux')
    dispatch(action)
  }

  render() {
    // 由 react-redux 注入的 todos：
    let { todos } = this.props

    return <TodoList todos={todos} {...this.boundActionCreators} />
  }
}

export default connect((state) => ({ todos: state.todos }))(TodoListContainer)
```

上面 `addTodo` 函数就是一个 *Action Creator*。

#### 3-5、dispatch

`dispatch` 是 View 发出 Action 的唯一方法。

```js
import { createStore } from 'redux'
const store = createStore(fn)

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
})
```

上面代码中，`store.dispatch` 接受一个 *Action* 对象作为参数，将它发送出去。

结合 *Action Creator*，这段代码可以改写如下。

```js
store.dispatch(addTodo('Learn Redux'))
```

#### 3-6、Reducer

Store 收到 *Action* 后，必须返回一个新的 *State*，这样 View 才会发生变化。这种 *State* 的计算过程就叫做 Reducer。

Reducer 是一个函数，它接受 *Action* 和当前 *State* 作为参数，返回一个新的 *State*。

```js
const reducer = function (state, action) {
  // ...
  return new_state
}
```

整个应用的初始状态，可以作为 *State* 的默认值。举个例子：

```js
const defaultState = 0
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return state + action.payload
    default:
      return state
  }
}

const state = reducer(1, {
  type: 'ADD',
  payload: 2
})
```

上面 `reducer` 函数收到名为 `ADD` 的 *Action* 后，就返回一个新的 *State*，作为加法的计算结果。

实际应用中，Reducer 函数不用像上面这样手动调用，`store.dispatch` 方法会触发 Reducer 的自动执行。为此 Store 需要知道 Reducer 函数，做法就是在生成 Store 时将 Reducer 传入 `createStore` 方法：

```js
import { createStore } from 'redux'
const store = createStore(reducer)
```

上面 `createStore` 接受 Reducer 作为参数，生成一个新的 Store。以后每当 `store.dispatch` 发来一个新的 *Action* 就会自动调用 Reducer，得到新的 *State*。

**注意：**由于 Reducer 是[纯函数](./6633767148660)，可以保证相同的 State 必定得到相同的 View。但也因为这一点，Reducer 函数中不能改变 *State*，必须返回一个全新的对象：

```js
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange })
  // 或
  return { ...state, ...newState }
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem]
}
```

最好把 *State* 对象设为只读，要得到新的 *State*，唯一办法就是生成一个新对象。这样的好处是，任何时候与某个 View 对应的 *State* 总是一个不变的对象。

#### 3-7、subscribe

Store 允许使用 `subscribe` 方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

```js
import { createStore } from 'redux'
const store = createStore(reducer)

store.subscribe(listener)
```

只要把 View 的更新函数放入 listener，就可以实现 View 的自动渲染。

`store.subscribe(listener)` 方法返回一个函数，调用这个函数就可以解除监听。

```js
let unsubscribe = store.subscribe(
  () => console.log(store.getState())
)

unsubscribe()
```

## 二、Redux 的使用

### 1、安装

```bash
# npm
npm install redux

# yarn
yarn add redux
```

### 2、基本用法

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

### 3、写法优化

#### 3-1、分离出 Reducer

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

#### 3-2、分离出 action 处理逻辑

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

#### 3-3、分离出 actionTypes

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

#### 3-4、使用 combineReducers 拆分 reducers

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




#### 3-4、使用 @reduxjs/toolkit 优化写法

#### 3-6、全局注入 store


