# 【余双】js高阶函数: 利用惰性函数进行性能优化

#### 引言：

在 js中，惰性函数是一种编程技巧，旨在提高代码的性能和可维护性，尤其是在涉及到重复执行某些计算、操作或状态更新时。本文将介绍惰性函数的基本概念、实现方式及其在 JavaScript 中的应用场景，帮助开发者更好地理解和使用这种技术。 

#### 1.定义

惰性函数是基于惰性求值机制的一种编程概念。具体来说，惰性函数是指那些不会立即执行其定义的计算过程，而是推迟到实际需要该函数的结果时才进行计算的一种函数设计方式。这种策略可以有效提高效率，特别是在处理复杂或耗时的操作、大数据集或潜在无限的数据流时。

#### 2.常用场景

惰性函数在实际开发中有很多应用场景，尤其是在处理性能问题和优化代码时。

##### 1. 减少重复计算

对于一些函数，它们的计算结果只与输入参数有关，如果输入参数没有发生变化，可以通过缓存计算结果来减少重复计算，提高性能。例如，在一个图像处理应用中，我们可以缓存已经处理过的图像，以免每次都进行相同的处理。

##### 2. 减少渲染次数

在前端开发中，UI 渲染是一个比较耗时的操作。惰性函数可以用来延迟渲染，避免不必要的渲染操作。例如，在一个复杂的表单或页面中，只有在用户完成输入或者其他操作后才进行渲染，可以有效避免每次输入都引起的重绘。

##### 3. 动态加载资源

以react.lazy为例：`React.lazy` 函数让你能够定义一个动态导入作为组件。这个组件不会在初始加载时被加载，而是在首次渲染时才会被加载。具体来说：`import('./SomeComponent')` 返回一个 Promise，该 Promise 在模块加载完成后解析为包含默认导出的模块对象。`React.lazy` 接受这个返回 Promise 的函数，并在第一次渲染该组件时才去加载它。

简单看一下React 针对普通 Component 和 Lazy Component 上实现的区别：就是如何 resolve Component。

```plaintext
case ClassComponent: {
  const Component = failedUnitOfWork.type;
  if (isLegacyContextProvider(Component)) {
    popLegacyContext(failedUnitOfWork);
  }
  break;
}
case ClassComponentLazy: {
  const Component = getResultFromResolvedThenable(failedUnitOfWork.type);
  if (isLegacyContextProvider(Component)) {
    popLegacyContext(failedUnitOfWork);
   }
  break;
}
```

让我们看看 getResultFromResolvedThenable方法

```plaintext
function getResultFromResolvedThenable(thenable) {
  return thenable._reactResult;
}
```

让我们看看 thenable.\_reactResult是怎么得来的

```plaintext
export function readLazyComponentType<T>(thenable: Thenable<T>): T {
  const status = thenable._reactStatus;
  switch (status) {
    case Resolved:
      const Component: T = thenable._reactResult;
      return Component;
    case Rejected:
      throw thenable._reactResult;
    case Pending:
      throw thenable;
    default: {
      thenable._reactStatus = Pending;
      thenable.then(
        resolvedValue => {
          if (thenable._reactStatus === Pending) {
            thenable._reactStatus = Resolved;
            if (typeof resolvedValue === 'object' && resolvedValue !== null) {
              // If the `default` property is not empty, assume it's the result
              // of an async import() and use that. Otherwise, use the
              // resolved value itself.
              const defaultExport = (resolvedValue: any).default;
              resolvedValue = defaultExport ?? resolvedValue;
            } else {
              resolvedValue = resolvedValue;
            }
            thenable._reactResult = resolvedValue;
          }
        },
        error => {
          if (thenable._reactStatus === Pending) {
            thenable._reactStatus = Rejected;
            thenable._reactResult = error;
          }
        }
      );
      throw thenable;
    }
  }
}
```

我们先关注 default 的逻辑，里面会判断 resolve 的值是否含有 default，如果是的话，说明可能是 async import 的返回值，那么就直接将 default 给 resolve 出来，否则返回用户传进来的函数。接着就会把它写入到 `_reactResult` 中。

#### 3.案例

我们常用的写法分为两种

##### 一. 重定义函数

```plaintext
function createXHR() {
    if (typeof XMLHttpRequest !== 'undefined') {
        // 如果支持XMLHttpRequest，则重新定义createXHR为返回XMLHttpRequest实例
        createXHR = function() {
            return new XMLHttpRequest();
        };
    } else {
        // 否则，重新定义createXHR为返回ActiveXObject实例
        createXHR = function() {
            return new ActiveXObject('Microsoft.XMLHTTP');
        };
    }
    // 首次调用时立即返回正确的实例
    return createXHR();
}
// 使用createXHR函数
var xhr = createXHR();
```

##### 二. 闭包与参数化

###### 1. 性能密集计算

惰性计算的一个常见模式是延迟执行，即只有在某些条件满足时才执行某个函数。例如，我们可以通过函数组合来延迟计算，直到调用者真正需要结果时才执行。

```plaintext
import { Button, Form, Input, Select } from 'antd';
import React from 'react';
function LazyFunciton(props) {
  function lazyEvaluate(fn) {
    let result;
    let isEvaluated = false;
    return function (...args) {
      if (!isEvaluated) {
        result = fn(...args);
        isEvaluated = true;
      }
      return result;
    };
  }
  function dynamicsEvaluate(fn, maxCacheSize = 100) {
    const cache = {};
    return function (...args) {
      const key = args.join(',');
      if (cache[key]) {
        console.log('Returning from cache:', key);
        return cache[key];
      }
      const result = fn(...args);
      cache[key] = result;
      // 如果缓存超过最大容量，则删除最旧的缓存项
      const keys = Object.keys(cache);
      if (keys.length > maxCacheSize) {
        delete cache[keys[0]]; // 删除最早的缓存项
      }
      return result;
    };
  }
  // 模拟需要大量计算的任务
  function slowMultiplyAndSum(a, b) {
    let total = 0;
    const iterations = 100000000;
    for (let i = 0; i < iterations; i++) {
      total += a * b * Math.random();
    }
    return total;
  }
  const count = () => {
    const lazyAdd = lazyEvaluate(slowMultiplyAndSum);
    console.log('开始计算...');
    console.log(lazyAdd(99999, 99999)); // 第一次计算，应该会有明显的延迟
    console.log('再次调用...');
    console.log(lazyAdd(99999, 99999)); // 第二次调用，应该直接返回缓存结果
    console.log('再次调用...');
    console.log(lazyAdd(6666, 6666));
  };
  const count2 = () => {
    const lazyAdd = dynamicsEvaluate(slowMultiplyAndSum);
    console.log('开始计算...');
    console.log(lazyAdd(99999, 99999)); // 第一次计算，应该会有明显的延迟
    console.log('再次调用...');
    console.log(lazyAdd(99999, 99999)); // 第二次调用，应该直接返回缓存结果
    console.log('再次调用...');
    console.log(lazyAdd(6666, 6666));
    console.log('再次调用...');
    console.log(lazyAdd(6666, 6666));
  };
  return (
    <>
      <Button onClick={() => count()}>延迟计算</Button>
      {/* <Button onClick={() => count2()}>动态计算</Button> */}
    </>
  );
}
export default LazyFunciton;
```

###### 2. 动态依赖注入

可以在首次访问某个模块时才进行加载和初始化操作，从而减少初始加载时间。

```plaintext
function lazyLoadModule(moduleName) {
    let module;
    return function() {
        if (!module) {
            module = import(`./modules/${moduleName}.js`);
        }
        return module;
    };
}
const loadUserModule = lazyLoadModule('user');
loadUserModule().then(userModule => {
    console.log(userModule);
});
```

###### 3. 缓存接口数据

场景：

1.  同一接口重复触发的并发现象
    
2.  一些公共数据接口，如用户信息，配置信息等接口需要多次获取
    
3.  首页有大量重复请求影响启动时间
    

缓存接口调用

```plaintext
function fetchData(url) {
    let data;
    return async function() {
        if (!data) {
            const response = await fetch(url);
            data = await response.json();
        }
        return data;
    };
}
const getData = fetchData('https://api.example.com/data');
getData().then(data => {
    console.log(data);
});
```

**注**：也可以初次请求时将接口promise缓存到map对象中，下一次请求到同一key名的接口直接返回缓存中的promise；如果没有此key的promise使用正常的接口请求，根据场景选择合理方法。

###### 4. 检测浏览器支持问题

我们以粘贴功能为例，先检查浏览器是否支持现代的 `Clipboard API`，如果支持，则使用它来直接写入剪贴板；如果不支持，则通过创建一个临时的输入框来实现复制

```plaintext
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inputValue);
    } else {
      const input = document.createElement('input');
      input.setAttribute('value', inputValue);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  };
```

缺陷：每次复制前都要判断一次。图为项目中运用的copy-to-clipboard插件源码 [https://github.com/sudodoki/copy-to-clipboard/blob/main/index.js](https://github.com/sudodoki/copy-to-clipboard/blob/main/index.js)

使用惰性函数：

在第一次判断后不用，不再重复判断

```plaintext
  const copy = () => {
    let clipboardCopy; // 用来存储复制函数
    return (value) => {
      if (!clipboardCopy) {
        // 第一次调用时进行初始化
        if (navigator.clipboard) {
          clipboardCopy = function (value) {
            navigator.clipboard.writeText(value);
          };
        } else {
          clipboardCopy = function (value) {
            const input = document.createElement('input');
            input.setAttribute('value', value);
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
          };
        }
      }
      clipboardCopy(value); // 执行复制操作
    };
  };
```

总结：虽然在通常情况下减少判断次数对执行时间的优化几乎可以忽略不计，但是这种思路是需要学习的，假如加上权限和一些其它判断，消耗还是可观的。

###### 6. 添加事件监听器

首次触发事件时添加事件监听器。这可以通过惰性函数来实现，以避免不必要的资源占用。

举例第一次监听到窗口改变

```plaintext
function addResizeHandler() {
    let handlerAdded = false;
    return function(eventHandler) {
        if (!handlerAdded) {
            window.addEventListener('resize', eventHandler);
            handlerAdded = true;
        }
    };
}
const handleResize = addResizeHandler();
handleResize(() => {
    console.log('Window resized');
});
```

###### 7. useMemo和useCallback是惰性函数吗

尽管 `useMemo` 和 `useCallback` 体现了惰性计算的思想，但它们的应用场景和实现方式与传统的惰性函数有所不同：

*   **惰性函数**：通常用于优化单个函数的行为，特别是在有复杂初始化逻辑或条件判断的场景中。例如，处理浏览器兼容性问题或优化复杂的数学运算。
    
*   `**useMemo**` **和** `**useCallback**`：专门用于React组件的优化，帮助开发者管理组件内部的状态和生命周期。它们通过依赖项数组来控制何时重新计算或重新创建函数，从而避免不必要的重新渲染或重新创建函数。
    

#### 5.总结

通过合理地应用惰性函数，可以在多个方面提升项目的性能和可维护性。然而，需要注意的是，过度使用惰性函数可能会导致额外的内存开销，因此应根据实际需求谨慎使用。