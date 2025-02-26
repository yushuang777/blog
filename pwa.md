# 【黄佳鑫】认识渐进式Web应用--PWA

**一、什么是PWA应用？**

**1、PWA简介**

渐进式Web应用（Progressive Web App），简称PWA，是 Google 在 2015 年提出的一种使用web平台技术构建的应用程序，官方认为其核心在于Reliable（可靠的）、Fast（快速的）、Engaging（可参与的），结合了web网站程序和原生应用程序两者的优点，可以带给用户更佳的使用体验。

PWA既能像网站一样，通过一套代码在多个平台运行，而且可以通过浏览器进行访问，并通过Url链接进行分享。又能像原生应用一样，安装之后可以通过图标访问，作为一个独立的应用程序被启动；而且即使脱离网络，也可以通过应用缓存访问到部分页面和数据。

但需要注意的是，当PWA应用通过安装在设备上的图标打开时，虽然从外观上看来像是一个原生的应用程序，但从技术角度来看，其仍属于网站范畴，所以仍需要一个浏览器引擎来解析和运行，为其提供正常运行的环境。因此其原理类似于打开了一个单独的、自定义窗口内容的浏览器窗口。

PWA不仅是一种技术，更代表了一种Web网站的开发理念，如果一个网站程序实现了可安装、可离线等多种特定功能，我们就可以将其视为一个PWA应用。

目前国内支持PWA的网站有：

腾讯网（[https://www.qq.com/](https://www.qq.com/)）

语雀（[https://mxkw.yuque.com/](https://mxkw.yuque.com/)）

mdn（[https://developer.mozilla.org/zh-CN/docs/Web/Progressive\_web\_apps/Tutorials/js13kGames](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps/Tutorials/js13kGames)）

效果图：在pc端可通过右上角安装当前网页 ，移动端可通过浏览器的添加到桌面，将页面作为桌面应用添加到桌面

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/106768f5-e8e9-437e-ba67-d7ee16097366.png)

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/8546e4df-bfeb-48bc-827c-d88b0a99956f.png)![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/824a9901-9850-4a5f-812f-d43c9eaad334.png)

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/d7deb622-1768-4206-a8f5-db8ddcbc9f6d.png)

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/7dbc177c-c772-40cb-9fbb-fa071d81d19f.png)

**2、PWA特点**

原生应用程序：代表了最佳的功能，因为与操作系统深入结合，拥有易于访问、可离线、操作系统集成等优点。 

Web 网站程序：代表了最广的范围，因为它以浏览器为基础，拥有跨平台、无需下载、易于更新部署等优点。

而PWA 则处于原生应用程序功能和 Web 网站程序范围的交叉点，是两者的结合体，主要拥有以下几种特点：

① 跨平台： PWA应用只需开发者书写一套代码，就可以在不同操作平台上运行，而且PWA应用采取渐进式增强的理念，其核心功能可以在任何浏览器上正常运行，其余强大的功能则需要依赖于浏览器对PWA特性的支持，根据浏览器的支持性，逐步升级体验。

② 可安装： PWA应用可以添加到主屏幕或应用程序菜单中，实现类似原生应用的图标入口，点击图标，作为一个独立应用被启动，用户可以更方便地访问应用。也可以将程序打包并上传各个应用商店，让用户通过应用商店安装网站应用。

③ 离线访问： PWA应用具备离线访问的能力，它们可以缓存应用的核心资源，使得用户可以在没有网络连接的情况下继续访问应用，查看到部分页面和数据，提供基本的功能，并在网络恢复时更新缓存。

④ 推送通知： PWA应用可以主动发送推送通知给用户，使得应用可以及时通知用户有关重要更新、新消息或其他关键信息，类似于原生应用的通知功能。

⑤ 快速加载： PWA应用使用Service Workers来缓存资源并提供离线体验，这也使得应用可以更快地加载和响应用户操作。

⑥ 可搜索： PWA应用可以通过搜索引擎被发现，而且可以通过url链接进行分享。

⑦ 热更新： PWA应用中的部分内容发生更新时，可在联网后自动进行局部热更新，确保用户能用到最新的应用程序，而无需像原生应用一样，重新下载安装客户端。

**二、PWA的核心技术是什么？**

PWA的实现依赖于多种技术实现，其中最核心的技术为Service Worker、Web App Manifest和Push Notification。

**1、Service Worker**

Service Worker是一个独立于网页线程的脚本，无权访问页面的DOM结构，主要用于浏览器和网络之间的代理，每个PWA应用都只能注册一个Service Worker，在PWA中主要用来实现离线访问、后台同步、缓存资源、推送通知等功能。

在网络正常时，当PWA应用请求Service Worker范围内的资源时，Service Worker会拦截该请求，并充当网络代理，然后它可以决定是从缓存中获取数据还是从服务器中获取数据。如果是从服务器中获取数据，Service Worker会缓存请求的数据，等到离线访问时，返回缓存的数据，使得PWA应用可以在离线状态下运行，并且可以利用缓存提升应用的加载速度。

由于Service Worker权利太大，能够直接截取并返回用户的请求，处于安全性考虑，目前仅支持在HTTPS或本地环境的安全环境下使用。

**如何为PWA注册Service Worker？**

说明：在第一次访问PWA应用时，页面还未受到Service Worker的控制，也就无法实现离线访问等功能。

注册Service Worker时，我们只需先判断浏览器是是否支持相关的API，如果支持则直接通过navigator.serviceWorker.register(url)进行注册即可，参数url表示具体Service Worker逻辑代码文件的路径。

_navigator：是一个全局对象,它提供了与浏览器相关的信息和操作接口。_

```plaintext
// 这是页面中唯一与Service Worker有关的代码
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
   .then(registration => {
     console.log('Service Worker 注册成功！', registration);
   })
   .catch(error => {
     console.log('Service Worker 注册失败：', error);
  });
}
```

如果想要查看Service Worker是否已经注册并正常运行，以Chrome浏览器为例，我们可以通过F12开发者工具中的Application，然后选中左侧的Service Workers ，如果右侧展示的信息中的Status中显示activity则表示已经注册并正常运行。

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/fecd0fec-03bf-4376-b10a-37d636fcd5d0.png)

**Service Worker的生命周期**

Service Worker 的生命周期从注册 Service Worker 开始，该生命周期阶段并没有对应的事件，可以通过register()方法的.then()来判断是否注册成功。

**① Registration（注册）**

```plaintext
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
   .then(registration => {
     console.log('Service Worker 注册成功！', registration);
   })
   .catch(error => {
     console.log('Service Worker 注册失败：', error);
  });
}
```

然后浏览器开始下载并安装 Service Worker 文件，安装成功后，则会触发install事件，在整个生命周期中，install事件仅会触发这一次。开发者通常会在此事件中进行初始化，**缓存一些静态资源，以备离线时访问。**

**② Installation（安装）**

```plaintext
// 安装阶段
self.addEventListener('install', function(event) {
  event.waitUntil(
    // 向缓存中存储基本数据
    caches.open('cache-name').then(function(cache) {
      return cache.addAll([
        '/path/to/resource1',
        '/path/to/resource2',
        // ...
      ]);
    })
  );
});
```

在Service Worker中，我们需要通过全局对象self才能监听各个生命周期事件。在waitUntil()方法执行结束之前，Service Worker不会结束安装状态，必须等待其内部代码执行结束之后，才会进入到下一个生命周期。

caches对象是限制在Service Worker 生命周期内使用的特殊对象，用于实现数据的缓存。

**③ Activation（激活）**

当Service Worker安装完成后，并不会立即进入激活状态，为了不影响当前正在访问的页面，此时Service Worker 并没有控制当前页面。所以要等到当前页面关闭，且再次加载该页面时，Service Worker才会进入激活状态，触发activate事件，开始控制网页的请求和缓存。在此阶段，开发者通常会进行清理旧的缓存、处理更新逻辑等操作，因为浏览器的缓存空间是有限的。

```plaintext
// Service Worker激活成功后
self.addEventListener('activate', function(event) {
  event.waitUntil(
    // 对缓存中的数据进行处理
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // 只保留符合要求的数据 删除不需要的旧数据
        cacheNames.filter(function(cacheName) {
          return cacheName !== 'cache-name';
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
```

在waitUntil()方法执行结束之前，Service Worker不会进入下个状态，然后可以通过caches对象，对缓存的数据进行操作。

还有要注意的一点是，Service Worker 进入激活状态后，它会一直保持激活状态，除非被手动注销或者被新的 Service Worker 脚本取代。

**④ Update（更新）**

浏览器会周期性的检测当前应用的Service Worker是否有更新，当检测到Server Worker 脚本文件发生更新时，会在后台下载新的脚本，并触发更新流程。更新流程与安装流程类似，需要经历下载、安装、激活三个阶段。下载完成之后，会立即进行安装，但是安装完成之后，默认并不会立即激活，而且进入等待状态。因为同一时间只能有一个版本的 Service Worker处于Activation状态。只有当旧版本的Service Worker控制的所有页面都被关闭，然后用户再重新访问这些页面时，新的Service Worker才会被激活并接管旧版本所有页面的控制权。

我们也可以通过skipWaiting()方法来强制激活等待中 Service Worker，使其取代旧版 Service Worker，获得页面的控制权。该方法只有在存在等待状态的 Service Worker时，调用才会有意义，所以通常都在install事件中执行调用。

```plaintext
// 新版Service Worker的install事件
self.addEventListener("install", (event) => {
  // 安装好后 调用skipWaiting() 使其立即激活
  // skipWaiting() 返回一个 promise，但完全可以忽略它
  self.skipWaiting();
  // 然后执行 service worker 安装所需的缓存数据等其他操作
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
    })(),
  );
});
```

**⑤ Termination（终止）**

当Service Worker被手动注销，或被新版本Service Worker取代后，就会进入终止阶段，它将不再控制页面的请求，并释放相应的资源。即使不被注销或者取代，Service Worker也不会无限期的存活，各大浏览器的处理逻辑不同，但在激活一段时间后，Service Worker就会被终止。终止之后，需要重新注册，才能继续运行。

```plaintext
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
   .then(registration => {
     console.log('Service Worker 注册成功！', registration);
     // 手动注销Service Worker
     registration.unregister().then(function (boolean) {
        if(boolean) {
          console.log('Service Worker 注销成功！')
        }
      });
   })
   .catch(error => {
     console.log('Service Worker 注册失败：', error);
  });
}
```

**⑥ Fetch（请求）**

Service Worker 还提供了一个fetch事件，每当Service Worker控制的页面中，发出fetch请求或者html、css、js等资源请求时，都会触发该事件，我们可以在此阶段拦截请求并结合缓存使用自定义响应来响应请求。注意：ajax请求不会触发该事件。

通常当请求的资源存在缓存时，我们都会从缓存中获取资源而不是从服务器获取。如果缓存中没有，那我们会使用另一个请求从服务器获取资源，并将资源存储在缓存中，以便下次请求或离线请求时使用。

```plaintext
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      // 从缓存中获取资源
      const r = await caches.match(e.request);
      console.log(`Service Worker正在请求资源: ${e.request.url}`);
      if (r) {
        // 如果缓存中存在资源 则直接返回缓存中的资源
        return r;
      }
      // 如果缓存中没有 则去服务器请求资源
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`Service Worker 缓存新资源: ${e.request.url}`);
      // 将请求的资源存储到缓存中
      cache.put(e.request, response.clone());
      // 将请求结果缓存
      return response;
    })(),
  );
});
```

该fetch事件的事件对象event中包含了一个respondWith()方法，该方法可以阻止浏览器默认的fetch请求操作，并允许自定义请求的response

**2、Web App Manifest**

Web App Manifest（Web应用清单），是一个遵守W3C规范的JSON文件，用来定义PWA安装的客户端在设备上应该如何显示和运行，例如应用的名称、图标、启动方式等等，该文件是实现PWA所必需的。通过该文件，用户可将PWA应用安装到用户的主屏幕上，使其更像一个原生应用的客户端。

*   name: 网站应用的全名。
    
*   short\_name: 显示在主屏上的短名字。
    
*   description: 一两句话解释你的应用的用途。
    
*   icons: 一串图标信息：源 URL，大小和类型。多包含几个图标，这样就能选中一个最适合用户设备的。
    
*   start\_url: 启动应用时打开的主页。
    
*   display: 应用的显示方式；可以是 fullscreen、standalone、minimal-ui 或者 browser。
    
*   theme\_color: UI 主颜色，由操作系统使用。
    
*   background\_color: 背景色，用于安装和显示启动画面时。
    

一份网页清单最少需要 name 和一个图标 (带有 src, size 和 type)。最好也要提供 description、short\_name、和 start\_url。除了上述字段，还有一些其他的字段供你使用，请查看[网页应用清单参考](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)获取详细信息。

##### 3、Push Notification 

 Push 和 Notification是两个独立的API，Push用来接收服务器推送的信息，Notification 用来向用户推送信息。两者都需要在 Service Worker 内调用运行。

具体可查看：[Push Notification](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Re-engageable_Notifications_Push)

**三、如何开发一个PWA应用Demo？**

**1、创建一个demo文件夹，用来存储相关文件**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/f09aeac9-5af6-45c9-a8a1-8e28f2d8f952.png)

**2、创建manifest.json文件，设置PWA应用信息**

```plaintext
{
    "name": "PWA示例",
    "short_name": "PWA示例",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "red",
    "theme_color": "#ccc",
    "icons": [
      {
        "src": "/icons/pwa-image.png",
        "sizes": "192x192",
        "type": "image/png"
      }
    ]
  }
```

**3、创建icons文件夹，存储PWA应用图标文件**

**4、创建main.css文件，设置页面样式**

```plaintext
h3 {
    color: red;
  }
```

**5、创建sw.js文件，设置Service Worker相关逻辑**

这里我们只需要直接书写Service Worker的处理逻辑即可：

```plaintext
// 缓存的key值，用于区别新旧版本缓存
var cacheStorageKey = 'minimal-pwa'
// 设置初始需要缓存的文件
var cacheList = [
  '/',
  'index.html',
  'main.css',
  '/icons/pwa-image.png'
]
// 监听安装事件 并在此阶段 缓存基本资源
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
      .then(
        // 缓存基本资源
        cache => cache.addAll(cacheList)
      )
      .then(() =>
        // 当脚本更新时 使新版Service Worker强制进入activate状态
        self.skipWaiting()
      )
  )
})
// 监听fetch请求事件
self.addEventListener('fetch', function (e) {
  // 拦截相关请求
  e.respondWith(
    // 如果缓存中已经有请求的数据就终止请求 直接返回缓存数据
    caches.match(e.request).then(async function (response) {
      if (response != null) {
        return response
      }
      // 否则就重新向服务端请求
      const res = await fetch(e.request)
      // 这块需要结合具体业务具体分析 我这里的示例逻辑是无脑全部缓存
      // 请求成功后将请求的资源缓存起来 后续请求直接走缓存
      const cache = await caches.open(cacheStorageKey)
      cache.put(e.request, res.clone())
      // 将请求的资源返回给页面。
      return res;
    })
  )
})
// 监听激活事件
self.addEventListener('activate', function (e) {
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取缓存中所有不属于当前版本cachekey下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          // 删除不属于当前版本的cache缓存数据
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      // 无须刷新页面 即可使新版server worker接管当前页面
      return self.clients.claim()
    })
  )
})
```

**6、创建主文件index.html，设置页面DOM，并引用各类资源**

```plaintext
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Hello PWA</title>
  <meta name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="main.css">
  <link rel="manifest" href="manifest.json">
</head>

<body>
  <h3>Hello PWA</h3>
</body>
<script>
  // 检测浏览器是否支持SW
  if ('serviceWorker' in navigator) {
    // 为当前页面注册Service Worker
    navigator.serviceWorker.register('./sw.js')
      .then(function (registartion) {
        console.log('当前浏览器支持sw:', registartion.scope);
        console.log('Service Worker注册成功', registartion);
      })
  }
</script>
</html>
```

**7、部署到服务器上(https) 或在本地环境使用**

以本地环境为例，使用VSCode作为辅助工具：

**① 在VSCode中，右键选中index.html文件，选中Open with live Server选项，运行页面：**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/7ba25944-9ae7-4137-8c39-fbfc1d5ebb23.png)

**② F12控制台，查看Service Worker是否注册成功：**

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/b2382b07-2587-427d-828f-c33fb624fb13.png)

**③ 然后点击Application，选中左侧Service Workers，查看sw脚本是否正常运行：**

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/39889c6b-ab39-49e1-81dc-142a56dcdcc7.png)

**④ 点击左侧Cache Storage，选中我们定义的cacheStorageKey-当前域名地址，查看初始资源(sw.js文件中定义的cacheList数组中的资源)是否被缓存：**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/38799ce1-1851-4480-aab3-2029cd2a8292.png)

**⑤ 点击Network，选中All，刷新页面，查看请求资源情况：**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/e724b7cb-0b3a-45c5-8082-43b7f1763e6e.png)

**⑥ 经过上次刷新，所有相关资源已被缓存，再次刷新页面，所有资源都将经过Service Worker之后，从缓存中获取。**

**⑦ 通过选中NetWork中的Offline选项切断网络，查看在无网络时，页面是否能利用缓存正常显示：**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/f2760b01-c169-4a83-9741-5bae91d90117.png)

若部署到服务器上，将会与渐进式应用的操作同理。

 如果我们本地修改了项目文件的内容，直接刷新或者关闭页面再打开，是看不到更新的内容的，因为都是直接从缓存中获取相关数据，而且关闭页面或浏览器后Service Worker脚本依旧在后台执行，再次打开访问时，依旧是从缓存中获取数据。想要页面显示最新的内容需要先注销掉旧的的脚本，然后让新脚本取代旧脚本即可，在浏览器开发工具的Application中我们可以直接注销Service Worker脚本，然后再刷新页面即可：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/MAeqxYaN3NmZO8j9/img/228f9403-81c7-4488-94f0-040038112414.png)