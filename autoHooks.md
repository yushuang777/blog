# 【黄佳鑫】自定义Hooks及ahooks中实用的Hooks

**1.Hooks：**

Hooks 是 React 16.8 版本引入的一项重要功能，它允许在函数式组件中使用状态和其他 React 特性。Hooks 旨在解决在类组件中使用复杂逻辑、共享状态和处理副作用时的一些问题，使得函数式组件具有更多的能力和灵活性。

Hooks  提供了几个特定的API函数，最常用的包括 useState、useEffect、useContext 等。这些函数可以在函数式组件内部调用，用于处理状态管理、副作用和其他与组件逻辑相关的操作。

**主要的 Hooks 函数包括：**

1.  useState：用于在函数式组件中添加和管理状态。useState 函数返回一个状态值和一个更新该状态的函 数，使得我可以在组件之间共享和更新状态。
    
2.  useEffect：用于处理副作用操作，如订阅数据源、网络请求、事件监听等。useEffect 函数接收一个副作用函数，并在组件渲染时执行该函数。它还可以在组件更新或卸载时清理副作用。
    

1.  useContext：用于在函数式组件中访问React上下文。useContext 函数会创建一个上下文对象，并且对外暴露提供者和消费者，在上下文之内的所有子组件，都可以访问这个上下文环境之内的数据。
    

React Hooks 提供了一种新的编写 React 组件的方式，通过函数式组件和特定的 API 函数，使得组件的开发更加简单、高效和灵活。Hooks 使得我们能够管理状态、处理副作用和共享逻辑，同时也提高了代码的可读性和可维护性。它是 React 生态系统中的一个重要组成部分，为我们构建现代化的用户界面提供了强大的工具和简化的开发流程。

**2.自定义Hooks：**

除了使用内置的Hooks之外，还可以创建自己的Hooks(自定义Hooks)，自定义Hooks能实现状态的逻辑复用。自定义Hooks的使用场景是将组件状态逻辑提取到可重用的函数（自定义Hooks）中，实现状态逻辑复用。内置Hooks是为函数组件赋予了class组件的功能；在此之上，自定义Hooks针对不同组件实现不同状态逻辑复用。

    **2.1 自定义Hooks的命名规范和约定：**

     以use开头（为了与普通函数区分）、使用驼峰命名法（例如 useFetchData）、准确描述功能、返回值符合约定（一个数组或对象，其中包含相关的状态和处理函数），以及在使用时以const关键字声明变量。

    **2.2 如何定义和使用自定义Hooks?**

     自定义 Hooks 是一个函数，命名以 use 开头并返回一个数组。它能让你在函数组件中复用代码逻辑，且可以像使用 React 自带的 Hooks 一样使用。 下面是定义和使用自定义 Hooks 的步骤：

1.  定义自定义 Hooks：
    

```plaintext
import { useState, useEffect } from 'react';
// 第一步：定义一个use开头的函数
const useCustomHook = () => {
    // 第二步：用Hooks添加逻辑
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);
    // 第三步：处理改变
    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };
    // 第四步：返回需要的
    return [count, increment];
}
```

上面的自定义 Hook 名为 useCustomHook，它定义了一个 count 状态变量，以及一个 increment 函数用于增加 count 值。在 useEffect 中监听 count 的变化，并将 count 的值显示在页面标题上。

2.  使用自定义 Hooks：
    

```plaintext
import React from 'react';

function App() {
    const [count, increment] = useCustomHook();
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
        </div>
    );
}
export default App;
```

上面的示例中，通过调用 useCustomHook 自定义 Hook，将其返回的 count 和 increment 分别赋值给 App 组件中的变量在 JSX 中使用这些变量，展示计数器的数值和点击按钮来增加计数器。

通过这种方式，我们可以在不同的函数组件中重复使用 useCustomHook 的逻辑，使代码更加模块化和可重用。

    **2.3 使用实例演示React自定义Hooks的应用**

当需要在多个组件之间进行通信时，使用自定义Hooks来封装通信逻辑，以实现组件间的状态共享和消息传递。

```plaintext
import { useState, useEffect } from 'react';

// 自定义通信Hooks
const useCommunication = () => {
  const [message, setMessage] = useState('');
  // 发送消息的函数
  const sendMessage = (msg) => {
    setMessage(msg);
  };
  return { message, sendMessage };
};

// 接收消息的组件
function MessageReceiver() {
  const { message } = useCommunication();
  return <div>{message}</div>;
}

// 发送消息的组件
function MessageSender() {
  const { sendMessage } = useCommunication();

  useEffect(() => {
    // 模拟发送消息的动作
    sendMessage('Hello, MessageReceiver!');
  }, [sendMessage]);

  return <button>发送消息</button>;
}
```

在上述示例中，创建了一个名为useCommunication的自定义Hooks，用于封装组件间通信的逻辑。在MessageReceiver组件中，使用该自定义Hooks来接收消息，并将消息内容显示在页面上。而在MessageSender组件中，通过该自定义Hooks发送消息，在组件挂载后自动发送一条消息。

通过使用useCommunication自定义Hooks，可以在MessageReceiver和MessageSender两个组件中实现简单的消息传递。这样，可以在应用的其他组件中使用同一个自定义Hooks，来实现组件间的状态共享和通信。这种方式使得组件间的通信逻辑更清晰、可维护性更高，并且能够提供更好的组件复用性。

当需要在多个组件之间进行通信时，可以使用类似的方式创建自定义Hooks，并在各个组件中使用它来实现所需的通信逻辑。这种封装方式可以减少代码冗余，提高代码的可读性和可维护性，并更好地组织和管理组件间的通信逻辑。

    **2.4 React自定义Hooks的主要特点**

    1.提高组件的可复用性和逻辑抽象能力

    2.让功能组件更纯粹，更易于维护，提高了代码的可读性

    3.自定义Hooks可以调用其他Hooks

**3.ahooks（**[https://ahooks.js.org/zh-CN/](https://ahooks.js.org/zh-CN/)**）**

    **3.1 ahooks简介**

    ahooks是一款由阿里巴巴开发团队设计的React Hooks库，提供了一系列实用的React Hooks，以便开发者更好地使用React的功能。ahooks的设计原则是“最小API，最大自由”，旨在提供最小的、最易于理解和使用的API，同时保留最大的使用自由度。

    **3.2 ahooks.js安装**

```plaintext
npm install ahooks 
# 或者
yarn add ahooks
```

    **3.3 实用的hooks**

**(1) useDebounce**

```plaintext
export default App;import { useDebounce } from 'ahooks';
import { useState } from 'react';

const App = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, { wait: 500 });

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Typed value"
        style={{ width: 280, marginRight: 16 }}
      />
      <p>Debounced Value: {debouncedValue}</p>
    </div>
  );
}

export default App;
```

useDebounce 接收两个参数。第一个参数是需要防抖的值，第二个参数是一个配置对象，其中的 wait 属性用于设置防抖延迟的时间。useDebounce 返回一个新的值，这个值会在指定的延迟时间后更新。

**(2) useThrottle**

useThrottle 是一个用于实现节流操作的 Hook。

```plaintext
import { useThrottle } from 'ahooks';
import { useState } from 'react';

const App = () => {
  const [value, setValue] = useState('');
  const throttledValue = useThrottle(value, { wait: 500 });

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Typed value"
        style={{ width: 280, marginRight: 16 }}
      />
      <p>Throttled Value: {throttledValue}</p>
    </div>
  );
}

export default App;
```

useThrottle 接收两个参数。第一个参数是需要节流的值，第二个参数是一个配置对象，其中的 wait 属性用于设置节流的时间。useThrottle 返回一个新的值，这个值会在指定的时间间隔内最多改变一次。

**(3) useHover**

useHover 是一个用于追踪元素 hover 状态的 Hook。它返回一个数组，包含当前的 hover 状态和一个 ref。

```plaintext
import React, { useRef } from 'react';
import { useHover } from 'ahooks';

const App = () => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  return <div ref={ref}>{isHovering ? '正在悬停' : '未悬停'}</div>;
};
export default App
```

useHover 返回一个数组。数组的第一个元素是一个布尔值，表示当前元素是否正在被悬停，第二个元素是一个 ref，需要被赋给需要追踪 hover 状态的元素。

**(4) useKeyPress**

useKeyPress 是一个用于监听键盘按键的 Hook。

```plaintext
import { useKeyPress } from 'ahooks';
import React, { useState } from 'react';
const App = () => {
  const [num, setNum] = useState('');
  const [key, setKey] = useState('');
  const filterKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  useKeyPress(filterKey, (event) => {
    setNum(event.key);
  });
  // a s d f, Backspace, 8
  useKeyPress([65, 83, 68, 70, 8, '8'], (event) => {
    setKey(event.key);
  });
  return (
    <div>
      <p>Try pressing the following: </p>
      <div>
        1. Number key [0-9]: <span style={{ color: '#f00' }}>{num}</span>
      </div>
      <div>
        2. Press key [a, s, d, f, Backspace, 8]: <span style={{ color: '#f00' }}>{key}</span>
      </div>
    </div>
  );
};
export default App;
```

useKeyPress 接收两个参数，第一个参数是需要监听的按键，第二个参数是监听成功之后的需要触发的事件。

**(5) useUpdate**

useUpdate 是一个用于强制更新组件的 Hook。

```plaintext
import { useUpdate } from 'ahooks';
const App = () => {
  const update = useUpdate();
  return (
    <div>
      Current Time: {Date.now()}
      <button onClick={update}>Update</button>
    </div>
  );
}
export default App;
```

useUpdate 不需要接收任何参数，它返回一个函数。调用这个函数可以强制更新组件。

使用场景： 有时候某些依赖外部变量的效果需要强制重新计算并更新UI。例如，当某个全局状态变化时，即使组件没有自己的状态变化，也需要触发重新渲染。

**(6) usePrevious**

usePrevious 是一个 用来获取组件中某个 state 或 props 的前一个值。

```plaintext
import { usePrevious } from 'ahooks';
import { useState } from 'react';
const App = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);
  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}
export default App;
```

usePrevious 接收一个参数，即当前的状态值。它返回前一个状态的值。

使用场景：

1.  **比较前后状态或属性的变化**：当需要比较某个状态或属性在更新前后的变化时，可以使用 usePrevious。例如，想知道用户从一个状态变化到另一个状态时，之前的状态是什么。
    
2.  **优化渲染**：希望在某个状态或属性变化时执行某些操作，但这些操作只有在变化后才需要执行。使用 usePrevious 可以帮助你轻松地比较前后的状态或属性，从而决定是否执行这些操作。
    
3.  **避免不必要的网络请求：**如果某个属性变化时会触发网络请求，但你只希望在该属性的值真正变化时才发送请求，可以使用 usePrevious 来检查前后值是否相同，避免不必要的请求。
    

**(7) useInterval**

useInterval 是一个用于设置定时器的 Hook。

```plaintext
import { useInterval } from 'ahooks';
import { useState } from 'react';
const App = () => {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, 1000);
  return <div>Count: {count}</div>;
}
export default App;
```

useInterval 接收两个参数。第一个参数是一个函数，这个函数将在指定的间隔时间被调用。第二个参数是间隔时间，单位是毫秒。

这个 Hook 会在组件挂载时开始定时器，并在组件卸载时自动清除定时器。所以你不需要手动管理定时器的生命周期。

**(8) useSize**

useSize是一个用于获取元素尺寸的Hook。

```plaintext
import React, { useRef } from 'react';
import { useSize } from 'ahooks';
const App = () => {
  const ref = useRef(null);
  const size = useSize(ref);
  return (
    <div ref={ref}>
      <p>Try to resize the preview window </p>
      <p>
        width: {size?.width}px, height: {size?.height}px
      </p>
    </div>
  );
};
export default App
```

useSize接收一个参数，这个参数是需要获取size的 DOM 节点或者 ref，返回一个含有width和height的object。

**(9) useDynamicList** [https://ahooks.js.org/zh-CN/hooks/use-dynamic-list](https://ahooks.js.org/zh-CN/hooks/use-dynamic-list)

**(10) useInViewPort** [https://ahooks.js.org/zh-CN/hooks/use-in-viewport](https://ahooks.js.org/zh-CN/hooks/use-in-viewport)

**4.总结**

自定义 Hooks 是封装复杂逻辑和实现组件间通信的有效方式。通过使用自定义 Hooks，可以将复杂逻辑或通信逻辑抽象为可重用的模块，提高代码的可维护性和可重用性。这样可以避免代码的冗余和重复编写，同时提供一种简洁、可组合和可扩展的方式来处理复杂逻辑和实现组件间的通信。

封装复杂逻辑的自定义 Hooks 能够将逻辑从组件中抽离出来，使组件更专注于 UI 的渲染和交互。通过自定义 Hooks，可以将一些通用的逻辑代码进行封装，提高代码的可读性、可维护性和可测试性。自定义 Hooks 还可以提供更好的代码复用性，可以在多个组件中共享和使用相同的逻辑。

另外，自定义 Hooks 也可以用于实现组件间的通信。通过自定义 Hooks，可以封装组件间的状态共享逻辑，实现组件间的消息传递、事件触发等通信机制。自定义 Hooks 为组件间通信提供了一种可重用和统一的方式，使组件之间的通信逻辑更加清晰和可维护。

封装复杂逻辑和实现组件间通信的自定义 Hooks 能够提高代码的可维护性、可重用性和可组合性。使用自定义 Hooks 能够简化代码，减少冗余，提高开发效率，是开发高质量和可扩展性组件的重要工具之一。