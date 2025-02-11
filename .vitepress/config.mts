import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  head: [['link', { rel: 'icon', href: '/blog/log.svg' }]],
  title: '我的前端学习之路',
  description: '一个普通前端的学习之路',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '知识库', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: '技术分享记录',
        items: [
          { text: '基于WebWorker的技术分享', link: '/基于WebWorker的技术分享' },
          {
            text: 'js高阶函数_ 利用惰性函数进行性能优化',
            link: '/js高阶函数_ 利用惰性函数进行性能优化',
          },
          {
            text: '自定义redux  核心源码分享',
            link: '/自定义redux  核心源码分享',
          },
          {
            text: 'Vue组件库的搭建',
            link: '/Vue组件库的搭建',
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    footer: {
      copyright: '@ 2025-ys blog',
    },
  },
});
