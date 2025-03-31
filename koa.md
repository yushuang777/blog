#   koa的初步使用



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

```
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

```
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

```
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

