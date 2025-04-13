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



### 5.koa配置开发热加载，ES6语法支持webpack



安装

```
npm install -D nodemon
```



启动

```
npx nodemon src/index.js
```


在packge.json配置

```javascript
  "scripts": {
    "start": "nodemon src/index.js"
  },
```


安装webpack

```
npm install -D webpack webpack-cli
```

安装一系列包

```
npm install clean-webpack-plugin webpack-node-externals @babel/core @babel/node @babel/preset-env babel-loader cross-env
```



webpack配置

新建 webpack.config.js文件

```javascript
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpackconfig = {
  target: "node",
  mode: "development",
  entry: {
    server: path.join(__dirname, "index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "../dist"),
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: [path.join(__dirname, "../node_modules")],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
};

module.exports = webpackconfig;

```

新建.babelrc文件

```javascript
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}

```



这样后可以使用es6语法

如：使用import

```javascript
import Koa from "koa";
const Router = require("koa-router");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const json = require("koa-json");
const app = new Koa();
const router = new Router();

```

启动方式调整

```javascript
npx babel-node index.js
```

开启热加载

```
npx nodemon --exec babel-node index.js
```


在package.json文件中配置

```javascript
  "scripts": {
    "start": "nodemon --exec babel-node index.js"
  },
```





### 6.优化koa项目webpack配置，npm构建脚本



1.安装npm检查插件更新脚本

```
npm install npm-check-updates
```

2.检查可以更新的插件

```
ncu
```

3.更新

```
ncu-u
```



###### koa插件koa-compose集成中间键

安装

```
npm install koa-compose -s
```

整合app.use

```javascript
import compose from "koa-compose";


const middleware=compose([
  koaBody(),
  cors(), // 允许跨域(默认所有请求都允许跨域,可以传入参数来指定允许跨域的请求)
  json({ pretty: false, param: "pretty" })
])

app.use(middleware);
```



###### 新建config文件夹，配置开发与生产环境打包


基本文件 webpack.config.base.js

```javascript
 plugins: [new CleanWebpackPlugin(),new webpack.DefinePlugin({'oprocess.env':(process.env.NODE_ENV==='production'||
    process.env.NODE_ENV==='prod')?'production':'development'})],
```



```javascript
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { webpack } = require("webpack");
const webpackconfig = {
  target: "node",
  mode: "development",
  entry: {
    server: path.join(__dirname, "index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "../dist"),
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: [path.join(__dirname, "../node_modules")],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin(),new webpack.DefinePlugin({'process.env':(process.env.NODE_ENV==='production'||
    process.env.NODE_ENV==='prod')?'production':'development'})],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
};

module.exports = webpackconfig;

```





开发环境配置 

安装 webpack整个工具

```
npm install webpack-merge -d
```

```javascript
const {webpackMerge} = require("webpack-merge");
const base = require("./webpack.config.base");
const webpackconfig =webpackMerge(base,{
  mode: "development",
  devtool: "eval-source-map",
  stats:{children:false}
})
module.exports = webpackconfig;
```



生产环境配置

安装压缩js工具

```javascript
npm install terser-webpack-plugin --save-dev
```

```javascript
const {webpackMerge} = require("webpack-merge");
const base = require("./webpack.config.base");
const terserPlugin = require("terser-webpack-plugin");
const webpackconfig =webpackMerge(base,{
  mode: "production",
  devtool: "eval-source-map",
  stats:{children:false},
  optimization:{
    minimize:true,
    minimizer:[new terserPlugin({
      terserOptions:{
        warnings:false,
        compress:{
          warnings:false,
          drop_console:true,
          drop_debugger:true,
          pure_funcs:['console.log']
        },
        output:{
          comments:false,
          beautify:false
        }
      }
    })]
  }
})
module.exports = webpackconfig;
```



### 7.koa应用打包优化

配置splitChunks
splitChunk是Webpack中的一种优化策略，主要用于代码分割。它将代码分割成多个块

```javascript
    splitChunks:{
      cacheGroups:{
        commons:{
         name:"commons",
         chunks:"initial",
         minChunks:3,
         enforce:true
        }
      }
    }
```



删除根目录 webpack.config.js

新增

```javascript
const path = require("path");
exports.resolve = function resolve(dir) {
  return path.join(__dirname, '..', dir);
};

// 修改APP_PATH指向根目录
exports.APP_PATH = exports.resolve('');  // 空字符串表示根目录
exports.DIST_PATH = exports.resolve('dist');
```

引用

```javascript
  entry: {
    server: path.join(utils.APP_PATH, "index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: utils.DIST_PATH,
    publicPath: "/"  // 添加publicPath配置
  },
```



安装cross-env

在package.json配置命令

```
 "build": "cross-env NODE_ENV=production webpack --config config/webpack.config.prod.js",
```

安装rimraf

```
npm install -d rimraf
```

配置命令

```
  "clean": "rimraf dist"
```

