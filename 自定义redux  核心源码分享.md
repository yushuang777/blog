# 【姬煜】自定义redux  核心源码分享

## 1、什么是 Redux ?

Redux 是 JavaScript 应用的状态容器，提供可预测的状态管理!

Redux 除了和 React 一起用外，还支持其它框架;它体小精悍(只有2KB，包括依赖)，却有很强大的插件扩展生态!

官网 [https://cn.redux.js.org/](https://cn.redux.js.org/)

## 2、使用 Redux大致流程

1、创建一个对象，作为我们要保持的状态；

2、创建store来存储这个state，创建store时，必须传入reducer

3、通过store.dispatch 派发action来修改state，action为一个扁平化对象，包含type属性，也可以携带其他数据

4、在reducer函数中修改state,reducer必须是个纯函数。

![微信截图_20240714150631.jpeg](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/4maOgkQ8o2DmOWNX/img/2d9e95b7-f920-4466-8588-055ad7cd3903.jpeg)

## 3、自定义 Redux  （实现 redux 核心源码） 

demo 地址 [https://gitee.com/ji-yu66/assault.git](https://gitee.com/ji-yu66/assault.git)

2.1、createStore

     createStore 用于创建唯一的 store，全局只会调用一次。参数为**reducer**、**preloadedState** 、 **enhancer** ；返回值是 一个包含 **getState、 subscribe、dispatch** 三个核心方法 等等的对象。

**reducer** : 开发者提供的用于修改store的函数

**preloadedState** ：store的默认值，如果第二个直接传递enhancer函数，内部会把enhancer 赋值给第三个参数，第二个参数为空。

**enhancer**: 增强函数，用于重写dispatch方法，可进行对store增强，该如果调用了enhancer函数，createStore方法就会结束，所以enhancer方法返回值就是 store，所以外层函数参数为createStore方法。

**getState**: 用于获取全局唯一的store。

**subscribe**: 用于收集所有订阅store的组件提供的方法（react中一般为用于刷新组件的方法)。

**dispatch**: 派发action，用于调用reducer方法，用来修改store;源码中会默认调一次dispatch方法，只是派发的 action.type 是串“火星文”，不会和reducer方法中已有的case命中，只用来获取公共状态的初始值。

核心代码如下：

```javascript
import { isPlainObject, __DO_NOT_USE__ActionTypes } from "redux";


// const randomString = () =>
//   Math.random().toString(36).substring(7).split("").join(".");

// const ActionTypes = {
//   INIT: `@@redux/INIT${/* #__PURE__ */ randomString()}`,
//   REPLACE: `@@redux/REPLACE${/* #__PURE__ */ randomString()}`,
//   PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`,
// };


export const createStore = function createStore(reducer, enhancer) {
  if (typeof reducer !== "function") {
    throw new Error(`Expected the root reducer to be a function`);
  }

  //判断 enhancer参数有没有传递
  if (typeof enhancer !== "undefined") {
    // 判断 enhancer 是不是一个函数
    if (typeof enhancer !== "function") {
      throw new Error("enhancer must be function");
    }

    return enhancer(createStore)(reducer);
  }

  let state, //存放公共状态
    listeners = []; // 事件池

  //公共状态获取
  const getState = function getState() {
    //返回公共状态
    return state;
  };

  //向事件池中加入让组件更新的方法
  const subscribe = function subscribe(listener) {
    // 规则校验
    if (typeof listener !== "function")
      throw new TypeError("listener is not a function");

    // 把传入的方法(让组件更新的办法)加入到事件池中「需要做去重处理」
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
    // 返回一个从事件池中，移除方法的函数
    return function unSubscibe() {
      let index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  //派发任务通知REDUCER执行
  const dispatch = function dispatch(action) {
    // 规则校验
    if (!isPlainObject(action)) {
      throw new Error(`Actions must be plain objects.`);
    }
    if (typeof action.type === "undefined") {
      throw new Error('Actions may not have an undefined "type" property.');
    }

    if (typeof action.type !== "string") {
      throw new Error(`Action "type" property must be a string.`);
    }

    // 调用reducer 传递：公共状态、行为对象；接受返回的值，替换公共状态
    state = reducer(state, action);

    // 当状态更改，我们还需要把事件池中的方法执行
    listeners.forEach((listener) => {
      listener();
    });

    return action;
  };

  /*redux内部会默认进行一次dispatch派发，目的:给公共容器中的状态赋值初始值 */

  dispatch({
    //type: Symbol(), // es6 语法 可以直接 给一个不可能重复的唯一值

    type: __DO_NOT_USE__ActionTypes.INIT,
  });

  // 返回创建的STORE对象
  return {
    getState,
    subscribe,
    dispatch,
  };
};
```

 2.2、combineReducers

在 Redux 工程化配置时，若公共状态很多，会导致单一的reducer越来越大，Redux提供了该方法将所有reducer合并。参数是一个对象，返回值是以键值对存储了:模块名 & 每个模块的reducer，返回出的state 是 模块名 & 每个模块的 state。方法调用的时候，会将每个模块的reducer调用，返回值会在该方法中进行汇总。

组件调用时 为 store.getState().模块名 即可获得公共状态。这样做哪怕有单一reducer中store存在一样的key，也不会影响整体公共状态的取值。

派发的操作不需要改动，每一次派发后，都会去所有rducer进行逐一匹配，用派发的行为标识，和每个模块roducer中判断的行为标识进行比较，和谁匹配成功，就执行谁的逻辑。

核心代码如下：

```javascript
export const combineReducers = (reducers) => {
  // reducers是一个对象，以键值对存储了:模块名 & 每个模块的reducer
  let reducerKeys = Reflect.ownKeys(reducers);
  // reducerKeys : ['vote','person']
  return function combination(state = {}, action) {
    //把reducers中的每小的reducerreducer)执行;
    //把对应模块的状态/action行为对象传递进来;
    //返回的值替换当前模块下的状态!!

    const nextState = {};
    reducerKeys.forEach((key) => {
      const reducer = reducers[key];
      // 这里的state 是从 createStore() 中得到的唯一 存储STORE容器中的公共状态
      nextState[key] = reducer(state[key], action);
    });

    return nextState;
  };
};
```

2.3、bindActionCreators

该方法是 redux 提供的一个辅助方法，能够让我们以方法的形式来调用action。同时，自动派发对应的 action 。这个模块的代码十分简单，只要大家明白了apply 的使用，就能够很清晰的理解这个模块中的每一行代码。

第一个参数为对象，第二个是store对象的dispatch方法；该方法简单来讲就是将 下方 voteAction 转换成 obj  对象格式， 可以用作react-redux的 **connect** 函数返回的函数的第二个参数的返回值，将对应格式的对象转换成指定格式的对象。用作redux 的工程化

```javascript
const voteAction = {
  support() {
    return {
      type: TYPE.VOTE_SUP,
    };
  },
  oppose() {
    return {
      type: TYPE.VOTE_OPP,
    };
  },
};

const obj = {
    support: () => dispatch(voteAction.support()),  
    oppose: () => dispatch(voteAction.oppose())
};


connect(null, (dispatch) =>
  bindActionCreators(action.vote, dispatch)
)(VoteFooter);

// 转成了

connect(null, (dispatch) => {
  return {
    support: () => dispatch(action.vote.support()),
    oppose: () => dispatch(action.vote.oppose()),
  };
})(VoteFooter);


```

核心代码如下

```javascript
function bindActionCreator(actionCreator, dispatch) {
  return function (that, ...args) {
    return dispatch(actionCreator.apply(that, args));
  };
}

export const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(`bindActionCreators expected an object or a function`);
  }

  const boundActionCreators = {};

  // 创建相同key 的对象

  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
};
```

2.4、enhancer函数

enhancer是一个柯里化函数，是给开发者提供的用于增强store的函数，在源码中被调用，参数为createStore 方法，返回值是一个函数，参数为传入reducer函数和 preloadState(选填参数)。在项目调用createStore时，如果传入enhancer函数，会调用并终止。所以 enhancer 函数必须要创建一个store对象，store被return之前可以进行方法的重写，可对store进行直接操作。下面提供的是一个简单的enhancer函数。

```javascript
const myEnhancer = (createStore) => {
  return function (reducer) {
    const store = createStore(reducer);

    const { getState, dispatch, subscribe } = store;

    function _dispatch(action) {
      if (typeof action === "function") {
        action(dispatch);
      } else {
        dispatch(action);
      }
    }

    return {
      ...store,
      dispatch: _dispatch,
    
    };
  };
};

```

此ehancer函数是 redux-thunk 的模仿，可以让redux进行异步操作。

2.5、applyMiddleware 

applyMiddleware 是一个Redux 提供的用于使用redux中间件的函数；参数是多个中间件、返回值为一个enhancer函数。会将传入的所有中间件按照传入的顺序执行，中间件是用来提供专属的dispatch方法；加入中间件后、每次派发aciton时（dipatch(action)），会先依次将所有中间件提供的专属dispatch方法调用后，才会进入reducer函数，从而修改store 的值。也就是说中间件就是让我们能在派发action之后，reducer接受action之前，能让我们做一些事情，本质上就是对dispatch方法做一些增强（重写）。组件中调用的dispatch就是增强（重写）后的dispatch。

       每个中间件都是三层函数的格式，派发aciton的时候，中间件执行的时候实际执行的是最里层的函数，外面两层主要目的是为了接收参数，每次一层接受的参数没别为 store、next、action ;多个中间件一起用时，会按照顺序执行，最后执行reducer方法。

store : 为阉割版的store ，只有 getState 和 dispatch 方法。

next:  为下一次中间的最里层的函数，最后一个中间件的next方法为store最原本的dispatch方法。

action: 普通的action （dipatch调用最里层的函数）

```javascript
export const A = (store) => {
  return function (next) {
    return function (action) {
      console.log("A 中间件");
      next(action);
    };
  };
};

export const B = (store) => {
  return function (next) {
    return function (action) {
      console.log("B 中间件");
      next(action);
    };
  };
};

```

applyMiddleware 核心代码如下

```javascript

export const applyMiddleware = (...middlewares) => {
  return function enhancer(createStore) {
    return (reducer) => {
      // 创建 store
      const store = createStore(reducer);

      let dispatch = () => {
        throw new Error(
          "不允许在构建中间件时调用dispatch。" +
            "其他中间件不会应用于此dispatch。"
        );
      };

      // 阉割版的store 传给每个中间件
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args),
      };

      // 调用中间件的第一层函数 传递阉割版的 store
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));

      // 增强 dispatch

      dispatch = compose(...chain)(store.dispatch); // 传递store.dipatch 用于调用reducer

      return {
        ...store,
        dispatch: dispatch, // 重写 dispatch方法。
      };

      // 调用中间件的第一层函数 传值 阉割版的s
    };
  };
};

// function compose(...funcs) {
//   return funcs.reduce((pre, next) => {
//     return (dispatch) => pre(next(dispatch));
//   });
// }

function compose(...funcs) { 
  return (dispatch) => {
    // 倒序循环
    for (let i = funcs.length - 1; i >= 0; i--) {
      
      dispatch = funcs[i](dispatch);
    }
    return dispatch;
  };
}
```

代码中 funcs\[i\]  为 传入中间件中最后一个，返回值为最里层的函数，store原生的dipatch作为参数，返回值就是上一个中间件的next方法（第二层函数的参数）。循环结束后，组件调用store.dispatch() 后，会依次调用最里层的方法，最后是原生的dispatch，执行reducer。

## 4、自定义react-redux

react-redux 的最大特点就是让redux好用些，主要是在组件中应用的时候更加的方便。

官网参考：[https://react-redux.js.org/](https://react-redux.js.org/)

```javascript
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

import { bindActionCreators } from "redux";

const ThemeContext = createContext();

/*Provider:把传递进来的store放在根组件的上下文中 */

export const Provider = (props) => {
  const { store, children } = props;

  return (
    <ThemeContext.Provider value={{ store }}>{children}</ThemeContext.Provider>
  );
};

/*
connect:获取上下文中的store，然后把公共状态、要派发的方法等，
都基于属性传递给需要渲染的组件;
把让组件更新的方法放在redux事件池中!
*/

export const connect = (mapStateToProps, mapDispatchToProps) => {
  // 处理默认值

  if (!mapStateToProps) {
    // 不写 则什么都不给组件
    mapStateToProps = () => ({});
  }

  if (!mapDispatchToProps) {
    // 不写 则默认给组件传递个dispatch
    mapDispatchToProps = (dispatch) => {
      return {
        dispatch,
      };
    };
  }

  return function (Component) {
    //  Component:最重要渲染的组件

    return function HOC(props) {
      //我们需要获取上下文中的store
      let { store } = useContext(ThemeContext);

      let { getState, dispatch, subscribe } = store;
      //向事件池中加入让组件更新的办法
      let [_, forceUpdate] = useState(0);

      useEffect(() => {
        let unsubscribe = subscribe(() => {
          forceUpdate(+new Date());
        });
        return () => {
          //组件释放的时候执行:把放在事件池中的函数移除掉
          unsubscribe();
        };
      }, []);

      //把mapstateToProps/mapDispatchToProps，把执行的返回值，作为属性传递给组件!!
      const state = getState();
      const nextState = useMemo(() => {
        return mapStateToProps(state);
      }, [state]);

      let dispatchProps = {};
      if (typeof mapDispatchToProps === "function") {
        //是函数直接执行即可
        dispatchProps = mapDispatchToProps(dispatch);
      } else {
        //是actionCreator对象,需要经过bindActionCreators处理
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
      }
      return <Component {...props} {...nextState} {...dispatchProps} />;
    };
  };
};

```

**5、****Redux设计不足**

      redux在设计上，是存在一些不好的地方的

我们基于getState获取的公共状态，是直接和redux中的公共状态，共用相同的地址，这样导致，是可以直接修改公共状态信息的。

我们会把让组件更新的办法，放在事件池中，当公共状态改变，会通知事件池中的所有方法执行。此操作放置方法的时候，没有办法设置状态的依赖，这样，后期不论哪个状态被修改，事件池中所有的方法都要执行(相关的组件都要进行更新)。