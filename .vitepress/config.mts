import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  head: [["link", { rel: "icon", href: "/blog/log.svg" }]],
  title: "我的前端学习之路",
  description: "一个普通前端的学习之路",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "知识库", link: "/webWorker" },
    ],

    sidebar: [
      {
        text: "技术分享记录",
        items: [
          { text: "基于WebWorker的技术分享", link: "/webWorker" },
          {
            text: "js利用惰性函数进行性能优化",
            link: "/lazyFunction",
          },
          {
            text: "自定义redux核心源码分享",
            link: "/redux",
          },
          {
            text: "Vue组件库的搭建",
            link: "/vueCompoment",
          },
          {
            text: "渐进式web应用--pwa",
            link: "/pwa",
          },
          {
            text: "自定义hooks",
            link: "/autoHooks",
          },
        ],
      },
      {
        text: "大前端学习记录",
        items: [{ text: "koa入门", link: "/koa" }],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    footer: {
      copyright: `版权所有 © 2023-${new Date().getFullYear()} 余双`,
    },
  },
  lastUpdated: true,
});
