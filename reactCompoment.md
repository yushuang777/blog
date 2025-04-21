# React 组件库搭建

## 1.初始化项目

以 vite 为例

在 github 搜索 awesome-vite，其中有大量快速生成项目案例

在此使用 react-ts-vite-template

点击 use this template 添加到自己的 github 仓库中

```
git clone https://github.com/fabien-ml/react-ts-vite-template.git
```

```
执行 npm ci 兼容性较好
```

```
npm run dev 启动项目
```

配置提交工具 cz-customizable

```
npm install -D cz-customizable
```

配置.cz-config.js 文件

```javascript
module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: "feat", name: "feat:     新增功能" },
    { value: "fix", name: "fix:      修复 bug" },
    { value: "perf", name: "perf:     性能优化" },
    {
      value: "style",
      name: "style:    代码格式（不影响功能，例如空格、分号等格式修正）",
    },
    { value: "docs", name: "docs:     文档变更" },
    { value: "test", name: "test:     添加、修改测试用例" },
    {
      value: "refactor",
      name: "refactor: 代码重构（不包括 bug 修复、功能新增）",
    },
    {
      value: "build",
      name: "build:    构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
    },
    { value: "ci", name: "ci:       修改 CI、项目配置、脚本" },
    {
      value: "chore",
      name: "chore:    对构建过程或辅助工具和库的更改（不影响源文件、测试用例）",
    },
    { value: "revert", name: "revert:   回滚 commit" },
    { value: "wip", name: "wip:      正在开发中" },
    { value: "workflow", name: "workflow: 调整工作流" },
    { value: "types", name: "types:    更新typescript类型" },
    { value: "release", name: "release:  发布新版本" },
  ],

  // scope 类型（定义之后，可通过上下键选择）
  scopes: [
    ["modules", "功能模块"],
    ["service", "服务"],
    ["config", "配置相关"],
    ["decorator", "修饰器"],
    ["api", "接口功能"],
    ["middleware", "中间件"],
    ["pipe", "管道"],
    ["guard", "网关相关"],
    ["res", "静态资源相关"],
    ["hooks", "hook 相关"],
    ["utils", "utils 相关"],
    ["deps", "项目依赖"],
    ["auth", "对 auth 修改"],
    ["other", "其他修改"],
    // 如果选择 custom，后面会让你再输入一个自定义的 scope。也可以不设置此项，把后面的 allowCustomScopes 设置为 true
    ["custom", "以上都不是？我要自定义"],
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`,
    };
  }),

  // 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
  // allowCustomScopes: true,

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  // 针对每一个 type 去定义对应的 scopes，例如 fix
  /*
  scopeOverrides: {
    fix: [
      { name: 'merge' },
      { name: 'style' },
      { name: 'e2eTest' },
      { name: 'unitTest' }
    ]
  },
  */

  // 交互提示信息
  messages: {
    type: "确保本次提交遵循 Angular 规范！\n选择你要提交的类型：",
    scope: "\n选择一个 scope（可选）：",
    // 选择 scope: custom 时会出下面的提示
    customScope: "请输入自定义的 scope：",
    subject: "填写简短精炼的变更描述：\n",
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: "列举非兼容性重大的变更（可选）：\n",
    footer: "列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n",
    confirmCommit: "确认提交？",
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ["feat", "fix"],

  // 跳过要询问的步骤
  // skipQuestions: ['body', 'footer'],

  subjectLimit: 100, // subject 限制长度
  breaklineChar: "|", // 换行符，支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
};
```

并配置 packge.js

```javascript
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-customizable"
    }
  },
```

安装版本工具 conventional-changelog-cli

```
npm install -g conventional-changelog-cli
```

配置启动命令

```javascript
    "log": "conventional-changelog -p angular -i CHANGELOG.md -s",
```

每次大版本更新 vesion 时，执行可以产生提交日志

```
npm run log
```

普通提交还是正常提交，发布版本时要调整版本号

## 2.stylelint 配置

stylelint.config.js

```javascript
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-prettier",
  ],
  plugins: ["stylelint-order", "stylelint-scss"],
  rules: {
    // 要求在声明的冒号前有一个空格或不允许有白字。
    "declaration-colon-space-before": "never",
    // 要求在声明的冒号后有一个空格或不允许有白字。
    "declaration-colon-space-after": "always-single-line",
    // 颜色指定大写 -> lower -> 所有的大写变成小写
    "color-hex-case": "lower",
    // 颜色6位长度 #333 #fff
    "color-hex-length": "long",
    // 兼容自定义标签名
    "selector-type-no-unknown": [
      true,
      {
        ignoreTypes: [],
      },
    ],
    // 不允许未知的伪类选择器。
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    // 为类选择器指定一个模式 regex。
    "selector-class-pattern": null,
    // 忽略伪类选择器 ::v-deep
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep"],
      },
    ],
    // 禁止低优先级的选择器出现在高优先级的选择器之后。
    "no-descending-specificity": null,
    // 不验证@未知的名字，为了兼容scss的函数
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    // 禁止空资源，没有代码的文件
    "no-empty-source": true,
    // 禁止简写属性的冗余值
    "shorthand-property-no-redundant-values": true,
    // 禁止值的浏览器引擎前缀
    "value-no-vendor-prefix": true,
    // 禁止属性的浏览器引擎前缀
    "property-no-vendor-prefix": true,
    // 禁止小于 1 的小数有一个前导零
    "number-leading-zero": null,
    // 禁止空第一行
    "no-empty-first-line": true,
    // 不允许无效的命名网格区域 - 关闭
    "named-grid-areas-no-invalid": null,
    // 要求或不允许使用Unicode 字节顺序标记。
    "unicode-bom": "never",
    // 不允许低特异性的选择器在覆盖高特异性的选择器之后出现。- 关闭，有的时候需要
    "no-descending-specificity": null,
    // scss文件可以不使用文件后缀
    "scss/at-import-partial-extension": null,
    "color-function-notation": null,
    // 未知的单位
    "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }],
    // 属性的排序
    "order/properties-order": [
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "display",
      "justify-content",
      "align-items",
      "float",
      "clear",
      "overflow",
      "overflow-x",
      "overflow-y",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "border",
      "border-style",
      "border-width",
      "border-color",
      "border-top",
      "border-top-style",
      "border-top-width",
      "border-top-color",
      "border-right",
      "border-right-style",
      "border-right-width",
      "border-right-color",
      "border-bottom",
      "border-bottom-style",
      "border-bottom-width",
      "border-bottom-color",
      "border-left",
      "border-left-style",
      "border-left-width",
      "border-left-color",
      "border-radius",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "width",
      "min-width",
      "max-width",
      "height",
      "min-height",
      "max-height",
      "font-size",
      "font-family",
      "font-weight",
      "text-align",
      "text-justify",
      "text-indent",
      "text-overflow",
      "text-decoration",
      "white-space",
      "color",
      "background",
      "background-position",
      "background-repeat",
      "background-size",
      "background-color",
      "background-clip",
      "opacity",
      "filter",
      "list-style",
      "outline",
      "visibility",
      "box-shadow",
      "text-shadow",
      "resize",
      "transition",
    ],
  },
  ignoreFiles: ["**/*.js", "**/*.jsx", "**/*.tsx", "**/*.ts"],
};
```

配置.stylelintignore 文件

```
/dist/*
/public/*
publick/*
```

## 3.封装 button 组件

可以安装 vscode 插件 typescript react code snippets

进行结构快速初始化

button.tsx

```typescript
interface IButtonProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "default" | "large";
  type?: "primary" | "default" | "danger" | "link";
  href?: string;
  children?: React.ReactNode;
}

type NaviveButtonProps = Omit<React.ButtonHTMLAttributes<HTMLElement>, "type"> &
  IButtonProps;
type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLElement>, "type"> &
  IButtonProps;

// Partial类似于？，代表所有的类型都是一个可选属性
type ButtonProps = Partial<NaviveButtonProps & AnchorProps>;
const Button: React.FunctionComponent<ButtonProps> = (props) => {
  const { className, disabled, loading, size, type, href, children, ...rest } =
    props;
  if (type === "link") {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  } else {
    return (
      <button disabled={disabled} {...rest}>
        {children}
      </button>
    );
  }
};

export default Button;
```

我们可以导出到目录下的 index 中

```typescript
export { default as Button } from "./Button";
```
