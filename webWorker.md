# 【余双】基于WebWorker的技术分享

**分享原因**： JS是单线程的，单线程就意味着不能像多线程语言那样把工作委托给独立的线程或进程去做，无法充分发挥现代计算机多核CPU的优势。

**Web Worker 的作用**：为 JS 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

**Worker 线程一旦新建成功**，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，**而且一旦使用完毕，就应该关闭**。

**并发处理**：使用多个 `Web Worker` 实例可以实现更高级的并发处理，从而更有效地利用多核 `CPU`

**缺点：**

**无法访问 DOM**：`Web Worker` 运行在独立的线程中，无法直接访问 `DOM` 和一些浏览器 API，因此主要用于处理纯粹的计算任务和网络请求。

**通信开销**：由于 `Web Worker` 与主线程是隔离的，它们之间的通信需要通过消息传递，因此可能会存在一定的开销。

**内存消耗**：每个 `Web Worker` 都会占用一定的内存，过多地创建 `Web Worker`，会导致内存消耗过大。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/oJGq765NR0ZrnAKe/img/b83ff7f3-e58c-48e3-be33-4da5fc391d64.png)

Web Workers 宏观语义上包含了三种不同的 Worker： 

`DedicatedWorker(专有worker)`、`SharedWorker(共享Worker)` 、`ServiceWorker`，

本文仅讨论第一种。

**兼容性**：

Web Workers 是 2009 年的提案，是h5标准的一部分，2012 年各大浏览器已经基本支持。现代浏览器兼容性是没有问题的。

**tips**：Worker 线程内部还能再新建 Worker 线程（目前只有 Firefox 浏览器、谷歌浏览器支持）

#### 一、基本使用

##### 应用场景：

*   大规模图像处理
    
*   数据分析和统计
    
*   AI模型推理
    
*   渲染复杂的3D图形
    

##### 引入方式：

不同工具打包项目，引用方式存在区别

都支持：

```plaintext
var worker = new Worker(new URL("./worker.js", import.meta.url));
```

Vite:

```plaintext
import MyWorker form './worker?worker'
const worker= new MyWorker()
```

##### 基本api：

**主线程：**

1.  Worker.onerror：指定 error 事件的监听函数。
    
2.  **Worker.onmessage**：指定 message 事件的监听函数，发送过来的数据在event.data属性中。
    
3.  Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
    
4.  **Worker.postMessage()**：向 Worker 主线程发送消息。
    
5.  **Worker.terminate()**：立即终止 Worker 线程
    

**worker线程（**_**可以省略self**_**,因为**_**self**_**和**_**location**_**都指向当前的WorkerGlobalScope）：**

1.  self.name： Worker 的名字。该属性只读，由构造函数指定。
    
2.  **self.onmessage**：指定message事件的监听函数。
    
3.  self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
    
4.  **self.close()**：关闭 Worker 线程。
    
5.  **self.postMessage()**：向产生这个 Worker 主线程发送消息。
    
6.  **self.importScripts()**：加载 JS 脚本
    

++**需要注意：Worker.terminate()会立即切断和worker进程的联系，此时Worker.onmessage将接收不到worker返回的信息。**++

++**而self.close()则会关闭worker进程而不会切断和主线程的联系，在接收到主线程的信息后会继续执行，直到执行到close为止。**++

++**最后主线程要在组件销毁前执行Worker.terminate()，销毁worker进程，释放性能。**++

##### 代码范例（通用方式）:

main.js

```plaintext
import { Button, Input } from "antd";
import React, { useState } from "react";
function WebWorker() {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [result1, setResult1] = useState<number | null>(null);
  const [result2, setResult2] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [threadTime, setThreadTime] = useState<number | null>(null);
  const [workerTime, setWorkerTime] = useState<number | null>(null);

  const calculateSumInMainThread1 = () => {
    const start = performance.now();
    let result = 0;
    for (let i = 0; i <= num1; i++) {
      result += i;
    }
    const end = performance.now();
    setResult1(result);
    setThreadTime(end - start);
  };

  const calculateSumWithWorker1 = () => {
    setLoading(true);
    const worker = new Worker(new URL("./worker.js", import.meta.url));
    const start = performance.now();
    worker.postMessage({ num1 });
    worker.onmessage = (e) => {
      const end = performance.now();
      setResult1(e.data);
      setWorkerTime(end - start);
      setLoading(false);
      worker.terminate();
    };
  };

  const calculateSumInMainThread2 = () => {
    let result = 0;
    for (let i = 0; i <= num2; i++) {
      result += i;
    }
    setResult2(result);
  };

  const calculateSumWithWorker2 = () => {
    setLoading(true);
    const worker = new Worker(new URL("./worker.js", import.meta.url));
    worker.postMessage({ num2 });
    worker.onmessage = (e) => {
      setResult2(e.data);
      setLoading(false);
      worker.terminate();
    };
  };

  return (
    <div>
      <Input
        style={{ width: "300px" }}
        type="number"
        value={num1}
        onChange={(e) => setNum1(Number(e.target.value))}
      />
      <Button onClick={calculateSumInMainThread1} disabled={loading}>
        使用主线程计算
      </Button>
      <Button onClick={calculateSumWithWorker1} disabled={loading}>
        使用webWorker线程
      </Button>
      {result1 !== null && <h2>结果: {result1}</h2>}
      {/* {threadTime !== null && <p>主线程耗时: {threadTime.toFixed(2)} ms</p>}
      {workerTime !== null && (
        <p>webWorker线程耗时: {workerTime.toFixed(2)} ms</p>
      )} */}

      <Input
        style={{ width: "300px" }}
        type="number"
        value={num2}
        onChange={(e) => setNum2(Number(e.target.value))}
      />
      <Button onClick={calculateSumInMainThread2}>使用主线程计算</Button>
      <Button onClick={calculateSumWithWorker2}>使用webWorker线程</Button>
      {result2 !== null && <h2>结果: {result2}</h2>}
    </div>
  );
}

export default WebWorker;

```

worker.js

```plaintext
// worker.js
onmessage = function (e) {
  console.log(e);
  const { num1, num2 } = e.data;
  let result = 0;

  if (num1) {
    for (let i = 0; i <= num1; i++) {
      result += i; // 简单的加法计算
    }
  } else {
    for (let i = 0; i <= num2; i++) {
      result += i; // 简单的加法计算
    }
  }

  postMessage(result);
};

```

##### 使用Blob(推荐）:

|  **优势**  |  **描述**  |
| --- | --- |
|  动态生成  |  可以动态地生成`Worker`脚本，无需保存为单独文件，根据需要生成不同的`Worker`实例。  |
|  内联脚本  |  将`Worker`脚本嵌入到`Blob`对象中，直接在`JavaScript`代码中定义`Worker`的逻辑，无需外部脚本文件。  |
|  便捷性  |  更方便地创建和管理`Worker`实例，无需依赖外部文件。  |
|  安全性  |  `Blob`对象在内存中生成，不需要保存为实际文件，提高安全性，避免了对实际文件的依赖和管理。  |

**相关代码：**

main.js

```plaintext
import React, { useEffect, useState } from "react";
import { createWorker } from "./workerHelper.tsx";
function WebWorkerBlob(props) {
  const [computeResult, setComputeResult] = useState(null);
  const [processResult, setProcessResult] = useState(null);
  useEffect(() => {
    const computeWorker = createWorker();
    const processWorker = createWorker();
    computeWorker.onmessage = (e) => {
      setComputeResult(e.data);
    };
    processWorker.onmessage = (e) => {
      setProcessResult(e.data);
    };
    computeWorker.postMessage({ task: "test1", data: 10 });
    processWorker.postMessage({ task: "test2", data: "测试" });
    return () => {
      computeWorker.terminate();
      processWorker.terminate();
    };
  }, []);
  return (
    <div>
      <h1>Compute Result: {computeResult}</h1>
      <h1>Process Result: {processResult}</h1>
    </div>
  );
}
export default WebWorkerBlob;
```
```plaintext
const workerScript = `
self.onmessage = function(e) {
  const { task, data } = e.data;
  let result;
  switch (task) {
    case 'test1':
      result = data * 2;
      break;
    case 'test2':
      result = data.split('').reverse().join('');
      break;
    default:
      result = 'Unknown task';
  }
  self.postMessage(result);
};
`;
export function createWorker() {
  const blob = new Blob([workerScript], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(blob));
  return worker;
}
```

##### 引入第三方库使用

搭配 **importScripts** 方法使用即可

```plaintext
importScripts(
  "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.core.min.js"
);
self.onmessage = function (e) {
  const data = e.data;
  const res = self._.max(data)
  self.postMessage(res)
};
```

##### 页面共享worker：sharedworker

`SharedWorker`是`Worker`的一种，它允许你在多个页面之间共享一个`Worker`。

`SharedWorker`和其他`Worker`的相同，都是需要同源的，它是通过`url`来区分是否是同一个`SharedWorker`。

##### 优点：

1.  **高效资源利用**：共享一个 Worker 实例，减少内存和 CPU 占用。
    
2.  **灵活的消息处理**：可以在 Worker 中集中处理和分发消息，适用于复杂的通讯需求。
    
3.  **持久连接**：连接建立后可以长时间保持，不需要频繁建立和销毁连接。
    

##### 缺点：

1.  **同源限制**：只能在同源上下文之间通讯，不同来源无法相互通讯，且仅在相同浏览器下支持，每个浏览器的sharedworker是相互独立的。
    
2.  **浏览器支持**：部分旧版浏览器可能不支持 `SharedWorker`。
    

**使用：**

不同工具打包项目，引用方式存在区别

都支持：

```plaintext
const sharedWorker = new SharedWorker(new URL("./sharedWorker.js", import.meta.url));
```

Vite:

```plaintext
const sharedWorker = new SharedWorker('worker.js', 'mySharedWorker');
```

`SharedWorker`传入两个参数，一个`woker脚本文件`，一个`name`，这个`name`参数就是`SharedWorker`的标识，相同的`name`会共享同一个`SharedWorker`。

**案例：**

page1

```plaintext
import React, { useEffect, useState } from "react";
import SharedWorker from "./sharedworker.js?sharedworker";
// function Index() {
//   const click = () => {
//     const sharedWorker = new SharedWorker(
//       new URL("./sharedWorker.js", import.meta.url)
//     );
//     sharedWorker.port.postMessage("getData");
//     // //线程监听消息
//     sharedWorker.port.onmessage = (e) => {
//       console.log("接收信息", e.data);
//     };
//   };
//   return (
//     <div>
//       <button onClick={click}>触发</button>
//     </div>
//   );
// }
// export default Index;
const Index: React.FC = () => {
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);
  useEffect(() => {
    const worker = new SharedWorker({ name: "test" });
    setSharedWorker(worker);
  }, []);
  const click = () => {
    if (sharedWorker) {
      sharedWorker.port.postMessage("count++");
      // 线程监听消息
      sharedWorker.port.onmessage = (e: MessageEvent) => {
        console.log("接收信息", e.data);
      };
    } else {
      console.error("Shared Worker 尚未初始化");
    }
  };
  return (
    <div>
      <button onClick={click}>触发</button>
    </div>
  );
};
export default Index;
```

page2

```plaintext
import React, { useEffect, useState } from "react";
import SharedWorker from "../sharedworker/sharedworker.js?sharedworker";
// function Index() {
//   const click = () => {
//     const sharedWorker = new SharedWorker(
//       new URL("./sharedWorker.js", import.meta.url)
//     );
//     sharedWorker.port.postMessage("getData");
//     // //线程监听消息
//     sharedWorker.port.onmessage = (e) => {
//       console.log("接收信息", e.data);
//     };
//   };
//   return (
//     <div>
//       <button onClick={click}>触发</button>
//     </div>
//   );
// }
// export default Index;
const Index: React.FC = () => {
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);
  useEffect(() => {
    const worker = new SharedWorker({ name: "test" });
    setSharedWorker(worker);
  }, []);
  const click = () => {
    if (sharedWorker) {
      sharedWorker.port.postMessage("count++");
      // 线程监听消息
      sharedWorker.port.onmessage = (e: MessageEvent) => {
        console.log("接收信息", e.data);
      };
    } else {
      console.error("Shared Worker 尚未初始化");
    }
  };
  return (
    <div>
      <button onClick={click}>触发</button>
    </div>
  );
};
export default Index;
```

worker.js

```plaintext
// 计时器
let counter = 0;
// 监听连接
self.onconnect = (e) => {
  const port = e.ports[0];
  port.onmessage = (res) => {
    console.log("共享线程接收到信息：", res.data);
    switch (res.data) {
      case "count++":
        counter++;
        break;
    }
    console.log("counter:", counter);
    port.postMessage(counter);
  };
};
```

**API：**

基于原来worker的api上加了port（如sharedWorker.**port**.onmessage）

另外shareWorker用onconnect包裹onmessage，其它较之前没什么特别的，这里不做过多介绍

**调试：**

```plaintext
chrome://inspect/#workers
```

**备注：**当我们关闭页面的时候，`SharedWorker`并没有关闭，这是因为`SharedWorker`是一个长连接，当我们关闭页面的时候，`SharedWorker`并没有关闭，所以我们需要在页面关闭的时候，手动关闭`SharedWorker`。

#### 二、拓展

无论是使用文件导入的方式还是`Blob`的方式。都需要写一些模板代码。

虽然能解决我们的问题，但是使用方式还是不够优雅。

useWorker是一个库，它使用`React Hooks`在简单的配置中使用WebWorker API。支持使用`Promise`而不是事件监听器。

\[**url**\]    ++https://github.com/alewin/useWorker++ github地址

##### 1.安装：

**由于**`**useworker**`**指定了**`**React**`**版本为**`**^16.8.0**`**。如果大家在**`**17/18**`**版本的**`**React**`**环境下，会发生错误。**

**我们可以使用**`**--force**`**忽略版本限制**。

```plaintext
npm install @koale/useworker --force
```

##### 2.基本使用:

```plaintext
const [workerFn, controller] = useWorker(fn, options);
```

**api：**

包含四个 `ref`：

*   `worker：` 创建的 `worker` 实例
    
*   `isRunning`：`worker` 执行状态
    
*   `promise`： 保存 `worker` 执行的 `promise` 的 `resolve` 和 `reject`，方便调用
    
*   `timeoutId`：记录 `timeout` 定时器的 `id`，设置 `timeout` 时使用
    

还包含了几个方法：

*   `setWorkerStatus`：用于设置 `worker` 状态和 `isRunning`
    
*   `killWorker`：用于终止和清理 `worker`
    
*   `onWorkerEnd`： 在 `worker` 执行完成时调用，会按照 `option` 判定是否需要清理 `worker`，并更新状态
    
*   `generateWorker`：创建 `worker` 实例，并与其建立通信。
    
*   `callWorker`：调用 `worker` 执行
    
*   `workerHook`：`useWorker` 返回值之一，用于调用 `callWorker`
    

还有一个 `effect`，就是组件卸载时调用 `killWorker` 清理 `worker`。

而另一个返回值 `workerController` 则是包含 `status` 和 `killWorker`

|  **WORKER\_STATUS**  |  **类型**  |  **描述**  |
| --- | --- | --- |
|  `PENDING`  |  string  |  Web Worker 已初始化，但尚未执行  |
|  `SUCCESS`  |  string  |  Web Worker 已正确执行  |
|  `RUNNING`  |  string  |  Web Worker 正在运行  |
|  `ERROR`  |  string  |  Web Worker，以错误结尾  |
|  `TIMEOUT_EXPIRED`  |  string  |  Web Worker 已终止，因为定义的超时已过期。  |

##### 3.案例：

```plaintext
import { useWorker, WORKER_STATUS } from "@koale/useworker";

// 模拟耗时任务
const bubleSort = (arr: number[]): number[] => {
  const len = arr.length;

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
};
const numbers = [...Array(50000)].map(() =>
  Math.floor(Math.random() * 1000000)
);
function SortingArray() {
  const [sortStatus, setSortStatus] = useState(false);
  const [sortWorker, { status: sortWorkerStatus }] = useWorker(bubleSort);

  console.log("WebWorker status:", sortWorkerStatus);

  const onSortClick = () => {
    setSortStatus(true);
    const result = bubleSort(numbers);
    setSortStatus(false);
    alert("耗时任务结束！");
    console.log("处理结果", result);
  };

  const onWorkerSortClick = () => {
    sortWorker(numbers).then((result) => {
      console.log("使用WebWorker的处理结果", result);
      alert("耗时任务结束！");
    });
  };

  return (
    <div>
      <section>
        <button
          type="button"
          disabled={sortStatus}
          onClick={() => onSortClick()}
        >
          {sortStatus ? `正在处理耗时任务...` : `主线程触发耗时任务`}
        </button>
        <button
          type="button"
          disabled={sortWorkerStatus === WORKER_STATUS.RUNNING}
          onClick={() => onWorkerSortClick()}
        >
          {sortWorkerStatus === WORKER_STATUS.RUNNING
            ? `正在处理耗时任务...`
            : `使用WebWorker处理耗时任务`}
        </button>
      </section>
      <section>
        <span style={{ color: "white" }}>打开控制台查验状态信息</span>
      </section>
    </div>
  );
}

import React, { useState } from "react";
import logo from "./assets/react.svg";
import "./App.css";

let turn = 0;

function infiniteLoop(): void {
  const lgoo = document.querySelector(".logo") as HTMLElement;
  if (lgoo) {
    turn += 8;
    lgoo.style.transform = `rotate(${turn % 360}deg)`;
  } else {
    console.error("Element with class 'logo' not found.");
  }
}

export default function App() {
  React.useEffect(() => {
    const loopInterval = setInterval(infiniteLoop, 100);
    return () => clearInterval(loopInterval);
  }, []);

  return (
    <>
      <div>
        <h1>useWorker Demo</h1>
        <header>
          <img src={logo} className="logo" />
        </header>
        <hr />
      </div>
      <div>
        <SortingArray />
      </div>
    </>
  );
}
```

使用时首先调用 `useWorker`，会返回 `workerHook` 和 `workerController`

`**workerHook**` **的源码。**

*   如果 `isRunning.current` 为 `true`，表示当前 worker 正在运行，需要警告用户不能同时运行多个 worker 实例。
    
*   下一步是检查 `terminate` 变量，这个变量表示是否需要自动终止 `worker`。如果 `terminate` 为 `true`，或者没有当前的 `worker` 实例（即 `worker.current` 为 `false`），则需要创建一个新的 `worker` 实例。这里的 `terminate` 变量是一个布尔类型的标记，用于指示是否需要自动终止 `worker`。如果 `terminate` 为 `true`，则表示需要自动终止 `worker`。如果 `worker.current` 为 `false`，则表示当前没有 `worker` 实例，需要创建一个新的实例。
    
*   最后，`callWorker` 函数被调用来执行 `worker` 中的任务。这里的 `callWorker` 函数是一个引用类型的变量，指向实际执行 `worker` 任务的函数。
    

```plaintext
const workerHook = React.useCallback(
    (...fnArgs: Parameters<T>) => {
        const terminate = options.autoTerminate != null ? options.autoTerminate : DEFAULT_OPTIONS.autoTerminate;

        if (isRunning.current) {
            /* eslint-disable-next-line no-console */
            console.error(
                '[useWorker] You can only run one instance of the worker at a time, if you want to run more than one in parallel, create another instance with the hook useWorker(). Read more: https://github.com/alewin/useWorker'
            );
            return Promise.reject();
        }
        if (terminate || !worker.current) {
            worker.current = generateWorker();
        }
    
        return callWorker(...fnArgs);
    },
    [options.autoTerminate, generateWorker, callWorker]

);
```

**generateWorker源码。**

```plaintext
const generateWorker = useDeepCallback(() => {
    const {
      remoteDependencies = DEFAULT_OPTIONS.remoteDependencies,
      timeout = DEFAULT_OPTIONS.timeout,
      transferable = DEFAULT_OPTIONS.transferable,
      // localDependencies = DEFAULT_OPTIONS.localDependencies,
    } = options
    const blobUrl = createWorkerBlobUrl(fn, remoteDependencies!, transferable! /*, localDependencies!*/)
    const newWorker: Worker & { _url?: string } = new Worker(blobUrl)
    newWorker._url = blobUrl
    newWorker.onmessage = (e: MessageEvent) => {
      const [status, result] = e.data as [WORKER_STATUS, ReturnType<T>]
      switch (status) {
        case WORKER_STATUS.SUCCESS:
          promise.current[PROMISE_RESOLVE]?.(result)
          onWorkerEnd(WORKER_STATUS.SUCCESS)
          break
        default:
          promise.current[PROMISE_REJECT]?.(result)
          onWorkerEnd(WORKER_STATUS.ERROR)
          break
      }
    }
    newWorker.onerror = (e: ErrorEvent) => {
      promise.current[PROMISE_REJECT]?.(e)
      onWorkerEnd(WORKER_STATUS.ERROR)
    }
    if (timeout) {
      timeoutId.current = window.setTimeout(() => {
        killWorker()
        setWorkerStatus(WORKER_STATUS.TIMEOUT_EXPIRED)
      }, timeout)
    }
    return newWorker
  }, [fn, options, killWorker])
```

\[**url**\]    ++https://github.com/alewin/useWorker/blob/master/packages/useWorker/src/useWorker.ts++ 

#### 三、总结

虽然Web Worker在小型项目中使用场景不多，使用时要考虑是否会导致负优化。但如果遇到特殊场景，它也是一种不错的优化方案。