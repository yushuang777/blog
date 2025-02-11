# 【姬煜】Vue 组件库的搭建

[vue3 组件库 gitee 地址](https://gitee.com/ji-yu66/my-design-vue)

## 1、组件库封装的原理

利用 vue 框架提供的 api:  **Vue.use( plugin )** ，我们需要把封装好组件的项目打包成 vue 库，并提供**install**方法，然后发布到 npm 中。项目的 main.js 文件中调用  **Vue.use(plugin)**  的时候会自动执行插件中的**install**方法。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/jP2lR4v567w6q8g5/img/0e1aa895-f104-4056-a3fb-3cea1531de09.png)

在 install 方法中   调用    Vue.component  可以将组件绑定到 Vue  实例身上  ，这样就可以在项目中使用该组件。

## 2、组件库搭建

以自己搭建的脚手架（Monorepo（单仓库））为例，packages  中的  components  用于存放开发的组件，hooks  用于存放开发的 hook 函数，play  用于开发时的操作台（本质是一个 vue 项目，用来验证组件的），theme  存放样式等，docs  用于编写组件库的 markdown  文档，core  是用来收集所有组件和 hook 并打包后上传 npm， utils  为   组件库搭建时候所需要的方法。目前只有测试组件，所以下文中只介绍组件(hook 和组件操作同理)。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/jP2lR4v567w6q8g5/img/e6188211-81fa-4e52-ac7b-75a26e017cc2.png)

**utils:**

目前核心的两个方法  **makeInstaller**  和  **widthInstall**

**makeInstaller ：**  用于 core/index.ts  中，参数是所有的组件数组，用于遍历组件数组将所有的组件挂载到 app 实例上。

**widthInstall ：**  用于 components/XXX/index.ts  中，将所有的组件身上添加 install  方法，可以进行 app.use（xxx）  操作。

```javascript
import type { App, Plugin } from "vue";

import { each } from "lodash-es";

type SFCWithInstall<T> = T & Plugin;

export function makeInstaller(components: Plugin[]) {
  const installer = (app: App) => {
    each(components, (component) => {
      // app 为 vue实例，使用use方法使用插件
      app.use(component);
    });
  };
  return installer as Plugin;
}

export const widthInstall = <T>(component: T) => {
  // 给每个组件身上注册 insatll 方法
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any).name;
    app.component(name, component as Plugin);
  };
  return component as SFCWithInstall<T>;
};

```

**components:**

存放封装的所有组件，一个组件就是一个文件夹，文件夹的名称为**大驼峰格式**。如下图

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/jP2lR4v567w6q8g5/img/a7a6e935-41c9-4249-99ed-adc68accac30.png)

XhButton/index.ts  文件用于预处理组件（组件身上添加  install  方法）  和   导出组件、ts  类型等。

**core:**

用于搜集所有组件，并在这里进行打包，上传只 npm  操作。存放着  vite  打包配置文件，以及和包管理的 package.json。

使用不同的打包配置可以打包出为**UMD**（Universal Module Definition）和  **ES**（ECMAScript Modules）

- **UMD（Universal Module Definition）**：

  - UMD  是一种通用模块格式，旨在兼容多种  JavaScript  环境，包括浏览器、Node.js  和  AMD（Asynchronous Module Definition）模块加载器。
  - 其主要目标是确保代码能够在多种环境中工作，而无需针对不同环境编写多个版本。
  - 通常会通过封装一个**自执行的匿名函数**来兼容不同的环境

UMD 对应的配置文件：

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist/umd",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "MyComponents",
      fileName: "index",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["vue"],

      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
      },
    },
  },
});

```

- **ES Modules (ESM，ECMAScript Modules)**：

  - ES Modules  是  ECMAScript  标准（即  JavaScript  的官方标准）引入的模块化机制，规范了模块的导入和导出方式。
  - 它是现代  JavaScript  中推荐的模块系统，支持静态分析，优化打包，且具有更好的性能。
  - 模块通过  `import`  和  `export`  语法来进行模块的导入和导出

ES 对应的配置文件

```javascript
// @ts-nocheck
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";

import fs from "fs";

import { resolve } from "path";

function isUpperCaseFirst(str) {
  return /^[A-Z]/.test(str);
}

// 自动收集components下的文件夹名称,意味着所有的组件必须按照规定的文件夹名称来命名
const getComponentsName = () => {
  const names = fs
    .readdirSync(resolve(__dirname, "../components"), { withFileTypes: true })
    .filter((file) => {
      // 判断是否是文件夹 并且由首字母大写的文件夹才是组件
      return file.isDirectory() && isUpperCaseFirst(file.name);
    })
    .map((file) => file.name);

  return names as string[];
};

// const COMP_NAME = ["XhButton"] as const;

export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: "../../tsconfig.build.json", outDir: "dist/types" }),
  ],
  build: {
    // target: "modules",
    outDir: "dist/es",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "MyComponents",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"], //

      output: {
        // exports: "named",
        // globals: {
        //   vue: "Vue",
        // },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
        // 分包 以防打包出来的文件 有重复定义的情况
        manualChunks(id) {
          // id 是 读取的每个文件的路径名字
          if (id.includes("node_modules")) {
            return "vendor";
          }

          if (id.includes("packages/hooks")) {
            return "hooks";
          }

          if (id.includes("packages/utils")) {
            return "utils";
          }

          for (const item of getComponentsName()) {
            if (id.includes(`/packages/components/${item}`)) {
              return item;
            }
          }
        },
      },
    },
  },
});

```

只需要在  package.json  文件   的  script  指定打包语句并配置指定项即可，如下代码

```json
{
  "name": "my-components",
  "version": "1.0.9",
  "description": "Components library by Vue + TS",
  "type": "module",
  "main": "./dist/umd/index.umd.cjs",
  "module": "./dist/es/index.js",
  "types": "./dist/types/core/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/es/index.js",
      "require": "./dist/umd/index.umd.cjs",
      "types": "./dist/types/core/index.d.ts"
    },
    "./dist/": {
      "import": "./dist/",
      "require": "./dist/"
    }
  },
  "sideEffects": ["./dist/index.css"],
  "scripts": {
    "build": "run-s clean build-only move-style",
    "build-only": "run-p build-umd build-es",
    "build-umd": "vite build --config vite.umd.config.ts",
    "build-es": "vite build --config vite.es.config.ts",
    "move-style": "move-file dist/es/index.css dist/index.css",
    "clean": "rimraf dist",
    "release": "release-it" //
  },
  "keywords": [],
  "dependencies": {
    "@popperjs/core": "^2.11.8",
    "async-validator": "^4.2.5"
  },
  "author": "JiYu",
  "license": "ISC",
  "devDependencies": {
    "vite-plugin-dts": "^3.9.1",
    "@my-components/components": "workspace:*"
  },
  "peerDependencies": {
    "vue": "^3.4.19"
  }
}
```

对 package.json   的部分解读

- `**type**`: `module` ——  说明该项目使用  ES  模块（ESM）标准。使用  `import`  和  `export`  来管理模块。
- `**main**`: `./dist/umd/index.umd.cjs` ——  指定  CommonJS  模块的入口文件。这个文件会作为旧版  Node.js  或  CommonJS  环境下的入口。
- `**module**`: `./dist/es/index.js` ——  指定  ES  模块（ESM）的入口文件，这个文件会被现代的  JavaScript  构建工具和浏览器使用。
- `**types**`: `./dist/types/core/index.d.ts` ——  指定  TypeScript  的类型定义文件。这样使用该库的  TypeScript  用户会获得类型支持。
- `**files**`: `["dist"]` ——  定义了发布到  npm  时包含的文件或文件夹，这里指定了  `dist`  文件夹。这意味着发布时，只会包含  `dist`  目录中的内容。
- `**exports**`:

  - `"."`：当引入整个库时，指定了不同的导出格式：

    - `import`:  采用  ES  模块方式加载  `./dist/es/index.js`。
    - `require`:  采用  CommonJS  模块方式加载  `./dist/umd/index.umd.cjs`。
    - `types`:  引入类型定义文件  `./dist/types/core/index.d.ts`。

  - `"./dist/"`:  定义了  `dist/`  目录下的导出方式，这里分别支持  `import`  和  `require`  的方式加载。

- `**sideEffects**`: `["./dist/index.css"]` ——  该字段告知构建工具，这个项目中的  `dist/index.css`  文件可能会有副作用（例如样式被引入到页面中），因此不应该被  tree-shaking（即删除未使用代码的优化）掉
- `**scripts**` :  定义了项目的构建和发布脚本。你可以通过  `npm run <script-name>`  来运行这些命令：

  - `"build"`:  清理旧的构建文件，执行构建并移动样式文件。
  - `"build-only"`:  分别运行  `build-umd`  和  `build-es`  两个构建命令，生成  UMD  和  ES  模块版本。
  - `"build-umd"`:  使用  Vite  构建  UMD  版本，配置文件为  `vite.umd.config.ts`。
  - `"build-es"`:  使用  Vite  构建  ES  模块版本，配置文件为  `vite.es.config.ts`。
  - `"move-style"`:  将  `dist/es/index.css`  移动到  `dist/index.css`，确保样式文件在正确的位置。
  - `"clean"`:  使用  `rimraf`  删除  `dist`  目录，清理构建产物。
  - `"release"`:  运行  `release-it`  工具，自动化发布流程。

用到的   插件：   [rimraf](https://www.npmjs.com/package/rimraf)  [npm-run-all](https://www.npmjs.com/package/npm-run-all)   [release-it](https://www.npmjs.com/package/release-it)  [move-file-cli](https://www.npmjs.com/package/move-file-cli)

## 3、组件库   文档搭建

docs  用于编写组件库的 markdown  文档，使用  [vite-press](https://vitepress.qzxdp.cn/)  搭建。是一个由[Vite](https://www.baidu.com/s?rsv_dl=re_dqa_generate&sa=re_dqa_generate&wd=Vite&rsv_pq=d44e58580000fc04&oq=vite-press&rsv_t=bc9b3mcMOvLARiz3g267E4xe1d0/QwrPaiyKcWKbZclODVeIsOW08/ZvJz4aHYTbBCSy&tn=baiduhome_pg&ie=utf-8)和[Vue](https://www.baidu.com/s?rsv_dl=re_dqa_generate&sa=re_dqa_generate&wd=Vue&rsv_pq=d44e58580000fc04&oq=vite-press&rsv_t=bc9b3mcMOvLARiz3g267E4xe1d0/QwrPaiyKcWKbZclODVeIsOW08/ZvJz4aHYTbBCSy&tn=baiduhome_pg&ie=utf-8)驱动的静态网站生成器，专门用于构建快速且以内容为核心的站点。它能够将[Markdown](https://www.baidu.com/s?rsv_dl=re_dqa_generate&sa=re_dqa_generate&wd=Markdown&rsv_pq=d44e58580000fc04&oq=vite-press&rsv_t=bc9b3mcMOvLARiz3g267E4xe1d0/QwrPaiyKcWKbZclODVeIsOW08/ZvJz4aHYTbBCSy&tn=baiduhome_pg&ie=utf-8)内容转换为优雅的文档站点，并且支持使用 Vue 组件和语法，提供丰富的交互性。编写 markdown  文档需要参考  [https://markdown.p2hp.com/basic-syntax/](https://markdown.p2hp.com/basic-syntax/)

可使用  [@vitepress-demo-preview/component](https://www.npmjs.com/package/@vitepress-demo-preview/component) [@vitepress-demo-preview/plugin](https://www.npmjs.com/package/@vitepress-demo-preview/plugin)  来进行  vue 组件的预览，具体配置在下方文件中。

```javascript
import { defineConfig } from 'vitepress';
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MyDesign-Vue',
  description: 'vue3 组件库',
  base: '/My-design-vue/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/webWorker' },
      { text: '组件', link: '/components' },
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
      {
        text: '组件',
        items: [
          {
            text: 'XhButton',
            link: '/components',
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
});
```

```javascript
import {
  AntDesignContainer,
  ElementPlusContainer,
  NaiveUIContainer,
} from '@vitepress-demo-preview/component';
import '@vitepress-demo-preview/component/dist/style.css';

import type { App } from 'vue';

import MyUI from 'my-components';
import 'my-components/dist/index.css';

import DefaultTheme from 'vitepress/theme';

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('demo-preview', AntDesignContainer);
    app.use(MyUI);
  },
};
```
