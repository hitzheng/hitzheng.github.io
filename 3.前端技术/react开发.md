[TOC]

# react基础

## 快速开始
直接在页面中导入react/react-dom/babel三个库即可快速体验react，注意这种方式严重影响性能不可以在生产环境中使用。参见`环境搭建.md`使用`npm`、`webpack`、`babel`搭建开发环境。
```html
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Add React in One Minute</title>
        <!-- 加载react react-dom babel，不可用于生产环境 -->
        <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script type="text/babel">
        ReactDOM.render(
            <h1>Hello, world!</h1>,
            document.getElementById('root')
        );
        </script>
    </body>
</html>
```

## 基本概念
使用`{}`在jsx中嵌入js
```
// 建议使用括号包含以防止js自动添加分号
let e1 = (<h1>Hello, name:{user.name}, age:{user.age+1}, nick:{trim(user.nick)}</h1>);
```

定义属性
```
// 字面量必须使用引号包围
let e2 = <div tabIndex="0"></div>

// js表达式不能使用引号包围
let e3 = <img src={user.avatar}></img>

// 属性使用camelCase，class使用className，tabindex使用tabIndex
```

jsx防止XSS
```
// jsx会对所有嵌入的value进行转义，下面这种写法是安全的
let e4 = <h1>{title}</h1>
```

渲染组件
```
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

更新UI
```
// react的element是不可变的，一旦创建将不能改变它的子组件或属性
// 更新UI的唯一方式是新建一个组件并重新调用渲染函数
// react通过virtual node的方式比较新旧element，并只会更新变更的部分
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```

组件
```
// 组件只能包在一个标签中
// 组件可以相互组合
// 组件的props是只读的
// 用户组件必须大写开头

//函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 类组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

状态和生命周期
```
// 不能直接更改状态，必须通过this.setState()
// state的状态更改可能是异步的，不能依赖state的当前值去计算后面的状态
// 通过this.setState((prevState, props) => ({counter: prevState.counter + props.increment}))
// 通过setState更新的状态是通过merge对象实现的
// 组件的属性是从上往下单向传递的，只能由父节点传向子节点

class Clock extends React.Component {
  // 构造函数
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  // 组件挂载后回调
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  // 组件卸载前回调
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    // 状态更新只能通过setState，否则不生效
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

处理事件
```
// 事件名称必须是camelCase
// jsx是传递一个函数而不是字符串做为handler
// 如果要终止事件传播，必须显示调用e.preventDefault()
// 需要特别注意handler函数的this绑定

class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  // 1.调用bind将this绑定到handler上
  // 2.使用箭头函数自动绑定this
  render() {
    return (
      <div>
        <button onClick={this.handleClick.bind(this)}>写法1</button>
        <button onClick={(e) => this.handleClick(e)}>写法2</button>
      </div>
    );
  }
}
```

## JSX原理
组件的jsx表示：
```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

babel会转换成React.createElement调用：
```javascript
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

最终生成生成对象像这样：
```javascript
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

组件通过`function`或`class`定义，本质上就是一个**函数**，接收组件属性(props)，返回组件实例(plain object)，通过jsx或React.createElement实例化组件实际就是在调用组件函数。

组件实例不可变，实例更改需要新建实例。组件实例是一个纯对象(plain object)，实例化的成本很小，由虚拟DOM树管理并计算节点变更。

# react-router(v3)
## 基本用法
```
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';

ReactDOM.render((
<Router history={hashHistory}>
  <Route path="/" component={App}>
    <Route path="/repos" component={Repos}/>
    <Route path="/about" component={About}/>
  </Route>
</Router>
), document.body);
```

上面的代码中当用户访问`/repos`时，会先加载`App`再加载`Repos`
```
<App>
  <Repos/>
</App>
```

其中`App`组件要写成这样
```
import React from 'react';

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
```

获取url参数
```
// 动态参数, /inbox/messages/:id
let id = this.props.params.id;

// query参数，/foo?bar=baz
let bar = this.props.location.query.bar;
```

## 路由配置
```
// Route支持嵌套
React.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={About} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>
), document.body)
```

通过上面的配置，应用知道该如何渲染这四个url
URL |	组件
---|---
/ |	App -> About
/about | App -> About
/inbox | App -> Inbox
/inbox/messages/:id | App -> Inbox -> Message

路由回调
```
// onEnter 进入路由触发，由上到下
// onLeave 退出路由触发，由下到上
<Route path="/" onEnter={/**/} onLeave={/**/} />
```

匹配模式
```
// 匹配顺序为定义顺序
<Route path="/hello/:name">
// 匹配到'/?#'，通过this.props.param.name访问
// 匹配 /hello/michael
// 匹配 /hello/ryan

<Route path="/hello(/:name)">
// 该部分可选
// 匹配 /hello
// 匹配 /hello/michael
// 匹配 /hello/ryan

<Route path="/files/*.*">
// *匹配任意字符，非贪婪模式
// 匹配 /files/hello.jpg
// 匹配 /files/hello.html

<Route path="/files/*">
// 匹配 /files/ 
// 匹配 /files/a
// 匹配 /files/a/b

<Route path="/**/*.jpg">
// **匹配任意字符，贪婪模式
// 匹配 /files/hello.jpg
// 匹配 /files/path/to/file.jpg
```

IndexRoute组件
```
// IndexRoute用于定义默认路由，这样App中就不用写这样的代码了
// {this.props.children || <Home/>}
// IndexRoute没有path属性
<Router>
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="accounts" component={Accounts}/>
    <Route path="statements" component={Statements}/>
  </Route>
</Router>
```

Redirect组件
```
// Redirect用于路由跳转，下面的配置会导致访问
// `/inbox/messages/5`会自动跳转到`/messages/5`
<Route path="inbox" component={Inbox}>
  ＜Redirect from="messages/:id" to="/messages/:id" />
</Route>
```

IndexRedirect组件
```
// IndexRedirect组件用于根路径`/`下的跳转
<Route path="/" component={App}>
  ＜IndexRedirect to="/welcome" />
  <Route path="welcome" component={Welcome} />
  <Route path="about" component={About} />
</Route>
```

Link/IndexLink组件
```
<Link to="/about" activeStyle={{color: 'red'}}>About</Link>
<Link to="/repos" activeStyle={{color: 'red'}}>Repos</Link>

// 连接到根路径需要使用IndexLink，因为'/'会匹配所有子路由，而IndexLink使用精确匹配
// 或使用onlyActiveOnIndex属性，以下两种方式等同
<IndexLink to="/" activeClassName="active">Home</IndexLink>
<Link to="/" activeClassName="active" onlyActiveOnIndex={true}>Home</Link>
```

history属性
```
browserHistory
浏览器使用正常路径，但需要服务端做相应的改造

hashHistory
使用url hash进行路由，即'#'后面部分，<url>#/a/b/c

createMemoryHistory
主要用于服务器渲染
```
# react-router(v4)
v4与之前版本变动较大，在新版中不需要配置路由，一切皆组件。包含`react-router`、`react-router-dom`、`react-router-redux`等几个独立的包。web开发里只需要`react-router-dom`即可。

安装：`npm install react-router-dom`

文档：https://reacttraining.com/react-router/web/guides/quick-start

## 快速开始
```html
import React from "react";
import {HashRouter, Route, Link} from "react-router-dom";

// 定义两个组件
const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;

// 使用HashRouter
const AppRouter = () => (
  <HashRouter>
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about/">About</Link></li>
        </ul>
      </nav>
      <Route path="/" exact component={Index} />
      <Route path="/about/" component={About} />
    </div>
  </HashRouter>
);

export default AppRouter;
```

## 组件说明

BrowserRouter
```
// URL美观，但直接访问子页面时需要server处理。
// 属性：
// basename: 基准URL
// getUserConfirmation: 导航到此页面前执行的函数
// forceRefresh: 浏览器不支持h5时强制刷新页面
<BrowserRouter>
    <Route exact path="/" component={Home}/>
</BrowserRouter>
```

HashRouter
```
// 利用URL hash来定位，不需要服务端支持
// 属性：
// basename: 基准URL
// getUserConfirmation: 导航到此页面前执行的函数
<HashRouter>
    <Route exact path="/" component={Home}/>
</HashRoute>
```

Route
```
// 路由组件，可放至在包裹组件中的任意位置，当location和
// Route的path匹配时，会渲染其内容，否则渲染null。
// 属性：
// path: 匹配路径(前缀匹配)，为空表示匹配全部
// exact: 是否完全匹配(默认false)
// strict: 是否完全匹配末尾斜杠(默认false)
// component: 需要渲染的组件(与render只能存在一个)
// render: 需要渲染的函数(与component只能存在一个)
// render和component的参数说明见：
// https://reacttraining.com/react-router/web/api/Route/render-func
<HashRouter>
    {/*通过组件渲染*/}
    <Route exact path="/" component={Home} />
    {/*通过函数渲染*/}
    <Route path="/about" render={
        (props) => <About {...props} extra={someVariable} />}
    />
</HashRoute>
```

Switch
```
// 用于对Route分组，只有第一个匹配上path的route会渲染
<Switch>
    <Route path="/user/:id" component={User}/>
    <Route path="/user" component={UserList}/>
</Switch>
```

Link
```
// 用于替代<a>，以避免网页跳转
<Link to="/home">Home</Link>
```

NavLink
```
// 专门用于导航的Link
// 属性:
// activeClassName: 链接激活时的样式名
// activeStyle: 直接设置激活样式
// exact: 是否精确匹配
// strict: 是否严格匹配末尾斜杠
<NavLink to="/home">Home</NavLink>
```

# react-redux
文档：https://redux.js.org/api/api-reference

安装：npm install redux react-redux

## 三大原则
1. 单数据源，由store统一管理页面中的state树
2. 状态只读，只能通过触发action的方式由reducer修改state
3. reducer为纯函数，reducer描述action如何修改state树，接收前一个state和当前action，返回新==state==

## action
action是store数据的唯一来源，view通过`store.dispatch(action)`的方式修改store的state。

action是普通的js对象，必须字段`type`表明发生了事件，其余字段由用户自由定义
```
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

action通常由`action creator`函数来定义，这样更容易复用和测试
```
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```

action需要手动调用`store.dispatcher(action)`来触发，也可以实现绑定函数
```
const boundAddTodo = (text) => store.dispatch(addTodo(text))
boundAddTodo(text)
```

多数情况可以使用`react-redux`的`connect()`辅助函数来调用`dispatch`

## reducer
reducer根据前一个state和当前的action计算出变更后的state，store计算state是否有变化，若有变化调用订阅监听通知视图

永远`不要`在reducer中做以下操作
1. 修改传入参数，一般使用Object.assign()返回新的state对象
2. 执行有副作用的操作，如api请求和路由跳转
3. 调用非纯函数，如Date.now()和Math.random()等

基本reducer
```
// 可以通过默认参数指定初始state，第一次调用时state为**undefined**
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    default:
      // 默认情况一定要返回旧的state
      return state
  }
}
```

拆分reducer
```
// 当action较多时，单个reducer函数会很冗长，可以拆分成多个独立的reducer

// 处理todos的子reducer
function todos(state = [], action) {
    switch (action.type) {
        // ...
        default:
            return state;
    }
}

// 处理visiable的子reducer
function visiable(state = 'SHOW_ALL', action) {
    switch (action.type) {
        // ...
        default:
            rurn state;
    }
}

// 合并reducer
function todoApp(state = {}, action) {
    return {
        todos: todos(state.todos, action),
        visiable: visiable(state.visiable, action)
    }
}

// redux提供combineReducers工具函数(解构语法)
const todoApp = combineReducers({
    todos,
    visiable
})

// 也可以设置不同的key
const todoApp1 = combineReducers({
    f1: todos,
    f2: visiable
})
```

## store
redux的核心，维护页面的state树
1. store.getState()，获取state树
2. store.dispatcher(action)，触发action更新state树
3. store.subscribe(listener)，订阅state变更

创建store
```
import { createStore } from 'redux'

// 第一个参数为reducer函数，必填
// 第二个参数为初始状态，选填
let store = createStore(reducer, initState);
```

发起action
```
import {
  addTodo,
  toggleTodo,
  setVisibilityFilter,
  VisibilityFilters
} from './actions'

// 打印初始状态
console.log(store.getState())

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// 停止监听 state 更新
unsubscribe();
```

## 数据流
```
sequenceDiagram
view->>store: store.subscribe(listener)，监听state变化
view->>store: store.dispatch(action)，触发action
store->>store: 调用reducer，计算下一个state
store->>view: 当state有变化时，通知所有订阅的view
view->>view: 通过store.getState()获取新状态，并更新UI
```

## 搭配react
参考文档：http://www.redux.org.cn/docs/basics/UsageWithReact.html

redux可以单独使用，也可以使用react的绑定库`react-redux`，你可以直接使用store.subscribe来编写容器组件，不过不建议这么做的原因是不能使用redux-redux带来的性能优化，请使用ReactRedux的connect方法自动生成容器组件。

react-redux把组件分为`展示组件`和`容器组件`，展示组件由用户提供，容器组件由connect自动生成，对比如下
|   | 展示组件 | 容器组件 |
|---|---|---|
| 作用 | 描述如何展现（骨架、样式）| 描述如何运行（数据获取、状态更新）|
| 使用 Redux	| 否 | 是 |
| 数据来源 | props | 监听 Redux state |
| 数据修改 | 从 props 调用回调函数 | 向 Redux 派发 actions |
| 调用方式 | 手动 | 通常由 React Redux 生成 |

展示组件
```
// 展示组件不需要用到redux，无状态，数据来源为props，数据修改通过props的回调进行
// 展示组件实现请参见react
```

容器组件

react-redux实现了性能优化来避免很多重复渲染，因此建议使用connect()来自动生成容器组件

```
// 函数原型，其中mapStateToProps为输入逻辑，当store管理的state有变化时更新组件的props,
// mapDispatchToProps为输出逻辑，用于组件事件发生时派发action，触发state更新。
// 调用此函数将为展示组件生成对应的容器组件，使用时将展示组件替换成容器组件即可，
// 这样容器组件会监听store的state变化，并将相应的state合并到props中传递给展示组件。
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])(UIComponent)


// 当mapStateToProps函数提供时，生成的容器组件会订阅store的state更新，
// 当store的state有更新时，会调用该函数生成属性对象，并合并到包裹展示组件的props中，
// 如果不需要订阅state更新，该参数传空即可
function mapStateToProps(state, props) {
    // state: store当前的状态
    // props: 展示组件当前属性
    return {
        prop1: <计算prop1>,
        prop2: <计算prop2>,
        ...
    }
}

// mapDispatchToProps可以是对象或函数，当为对象时里面的每个函数都被当成action creator，
// 当为函数时会返回一个属性对象，并合并到包裹展示组件的props中，该属性对象的元素为回调函数，
// 用于展示组件通知容器组件并触发store的action，这样通过this.props.onClick()来触发action。
// 如果该参数未提供，则会将dispatch合并到展示组件的props中，这样通过this.props.disptch(action)触发action。
function mapDispatchToProps(dispatch, props) {
    return {
        onClick: () => dispatch(action1Creator()),
        onTodoClick: () => dispatch(action2Creator())
    }
}

// 若提供mergeProps，则用于合并mapStateToProps()和mapDispatchToProps
// 以及组件当前props，返回结果会传给展示组件做为props,
// 若未提供，默认实现为Object.assign({}, props, stateProps, dispatchProps)
function mergeProps(stateProps, dispatchProps, props) {
    return {
        prop1: xxx,
        prop2: xxx
    }
}

// 示例，CTComp1为容器组件，UIComp1为展示组件，通常两者**同名**
let CTComp1 = connect(mapStateToProps, mapDispatToProps)(UIComp1);
```

组件生成好后需要将store传入容器中，可以使用`Provider`组件来让所有组件都可以访问store，而不用显示的用props一层一层的往下传store
```
import React from 'react'
import ReactDOM from 'react-dom'
import ReactRedux from 'react-redux'
import Redux from 'redux'
import todoApp from './reducers'
import App from './components/App'

// 创建store
let store = Redux.createStore(todoApp)

// 只需要把Providor放到最外层，并设置好store属性即可
// 若不用Providor，则需要在每个组件显示地设置store属性
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>,
  document.getElementById('root')
```
