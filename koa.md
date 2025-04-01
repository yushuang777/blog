#                        koa的初步使用



### 1.安装与启动

1.快速生成一个package.js  

```
npm init -y
```

2.安装koa

```
npm install -save koa
```

3.创建一个index.js的入口文件

```javascript
const Koa = require("koa");
const app = new Koa();
app.use(async (ctx) => {
  ctx.body = "Hello World";
});
app.listen(3000);
```



### 2.请求不同的api，不同的方法

1.安装koa-router

```
npm instal -S koa-router
```

2.使用router

```javascript
const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Hello World";
});

router.get("/api", (ctx) => {
  ctx.body = "Hello Api";
});

app.use(router.routes()).use(router.allowedMethods()); // 允许所有方法;
app.listen(3000);

```

3.next()使用

注：遵循先进后出的原理

打印结果：

`middleware1
middleware2
middleware
middleware2 end
middleware1 end`

```javascript
const Koa = require("koa");
const app = new Koa();
const middleware = function (ctx, next) {
  console.log("middleware");
  console.log(ctx.request.path);
  //   next(); // 没有next()下面的中间件不会执行
};
const middleware1 = function (ctx, next) {
  console.log("middleware1");
  console.log(ctx.request.path);
  next();
  console.log("middleware1", "end");
};
const middleware2 = function (ctx, next) {
  console.log("middleware2");
  console.log(ctx.request.path);
  next();
  console.log("middleware2", "end");
};

app.use(middleware1);
app.use(middleware2);
app.use(middleware);

app.listen(3000);

```



### 3.使用async await

```javascript
router.get("/async", async (ctx) => {
  let result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("async");
    }, 1000);
  });
  ctx.body = result;
});
app.use(router.routes()).use(router.allowedMethods()); // 允许所有方法;
app.listen(3000);
```



### 4.koa开发restful接口

用到的中间件
1.路由：koa-router

2.协议解析：koa-body

3.跨域处理：@koa/cors



安装koa-body

```
npm install koa-body
```

安装@koa/cors

```
npm install @koa/cors
```



结合postman测试

![image-20250401204226577](C:\Users\11031\AppData\Roaming\Typora\typora-user-images\image-20250401204226577.png)

```javascript
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const app = new Koa();
const router = new Router();

router.post("/post", async (ctx) => {
  let { body } = ctx.request;
  console.log(body);
  console.log(ctx.request);
  ctx.body = {
    ...body,
  };
});

app.use(koaBody());
app.use(cors()); // 允许跨域(默认所有请求都允许跨域,可以传入参数来指定允许跨域的请求)
app.use(router.routes()).use(router.allowedMethods()); // 允许所有方法;
app.listen(3000);

```



路由前缀测试



```javascript
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const app = new Koa();
const router = new Router();

router.prefix("/api");

router.post("/post", async (ctx) => {
  let { body } = ctx.request;
  console.log(body);
  console.log(ctx.request);
  ctx.body = {
    ...body,
  };
});

app.use(koaBody());
app.use(cors()); // 允许跨域(默认所有请求都允许跨域,可以传入参数来指定允许跨域的请求)
app.use(router.routes()).use(router.allowedMethods()); // 允许所有方法;
app.listen(3000);

```

![image-20250401204459817](C:\Users\11031\AppData\Roaming\Typora\typora-user-images\image-20250401204459817.png)

获取get请求中的params

```javascript
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const app = new Koa();
const router = new Router();

router.prefix("/api");

router.get("/api", (ctx) => {
  const params = ctx.request.query; // 获取请求参数
  ctx.body = { name: params.name };
  console.log(params);
});

app.use(koaBody());
app.use(cors()); // 允许跨域(默认所有请求都允许跨域,可以传入参数来指定允许跨域的请求)
app.use(router.routes()).use(router.allowedMethods()); // 允许所有方法;
app.listen(3000);

```

![image-20250401205650514](C:\Users\11031\AppData\Roaming\Typora\typora-user-images\image-20250401205650514.png)

localhost:3000/api/api?name=123&age=28
![image-20250401205711367](C:\Users\11031\AppData\Roaming\Typora\typora-user-images\image-20250401205711367.png)



使用koa-json美化输出

```
npm install koa-json

app.use(json({ pretty: false, param: "pretty" }));
```

```javascript
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const json = require("koa-json");
const app = new Koa();
const router = new Router();

router.prefix("/api");


router.get("/api", (ctx) => {
  const params = ctx.request.query; // 获取请求参数
  ctx.body = { name: params.name };
  console.log(params);
});


app.use(koaBody());
app.use(cors()); // 允许跨域(默认所有请求都允许跨域,可以传入参数来指定允许跨域的请求)
app.use(json({ pretty: false, param: "pretty" }));
app.use(router.routes()).use(router.allowedMethods()); // 允许所有方法;
app.listen(3000);

```



![image-20250401210040561](C:\Users\11031\AppData\Roaming\Typora\typora-user-images\image-20250401210040561.png)

