import { defineConfig } from 'vitepress'

//命令集：pnpm add -D vitepress vue @mdit-vue/shared @types/node busuanzi.pure.js canvas-confetti less medium-zoom sass vitepress-plugin-comment-with-giscus xgplayer

import { devDependencies } from '../../package.json'

import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

export default defineConfig({
  lang: 'zh-CN',
  title: "时间淡忘一切",
  description: "时间淡忘一切的技术博客",

  // #region fav
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  // #endregion fav

  base: '/', //网站部署到github的vitepress这个仓库里

  //cleanUrls:true, //开启纯净链接无html

  //启用深色模式
  appearance: 'dark',



  //markdown配置
  markdown: {
    //行号显示
    lineNumbers: true,

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true
    },

    // 组件插入h1标题下
    config: (md) => {
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          let htmlResult = slf.renderToken(tokens, idx, options);
          if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
          return htmlResult;
      },


      md.use(groupIconMdPlugin) //代码组图标

    }

  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ts: localIconLoader(import.meta.url, '../public/svg/typescript.svg'), //本地ts图标导入
          md: localIconLoader(import.meta.url, '../public/svg/md.svg'), //markdown图标
          css: localIconLoader(import.meta.url, '../public/svg/css.svg'), //css图标
          js: 'logos:javascript', //js图标
        },
      })
    ],
  },

  lastUpdated: true, //此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释

  //主题配置
  themeConfig: {
    //左上角logo
    logo: '/logo.png',
    //logo: 'https://vitejs.cn/vite3-cn/logo-with-shadow.png', //远程引用
    //siteTitle: false, //标题隐藏

    //设置站点标题 会覆盖title
    //siteTitle: 'Hello World',

    //编辑本页
    editLink: {
      pattern: 'https://gitee.com/djxchi/vitepress/tree/master/:path',
      text: '在GitHub编辑本页'
    },

    //上次更新时间
    lastUpdated: {
      text: '上次更新时间',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },

    //导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '🍉指南',
        items: [
          {
            text: '数据中间件',
            collapsed: true,
            items: [
              {text: 'Canal', link: '/guide/middleware/canal.md'},
              {text: 'Seata', link: '/guide/middleware/seata.md'},
              {text: 'TransmittableThreadLocal', link: '/guide/middleware/TransmittableThreadLocal.md'},
            ]
          }, {
            text: '前端',
            collapsed: true,
            items: [
              {text: 'TypeScript快速入门', link: '/guide/js/TypeScript快速入门.md'},
              {text: 'uniapp消息推送', link: '/guide/uniapp/messagePush.md'},
              {text: 'uniapp集成第三方SDK', link: '/guide/uniapp/otherSDK.md'},
              {text: 'uniapp入门到打包', link: '/guide/uniapp/package.md'},
              {text: '微信小程序部分功能示例', link: '/guide/uniapp/WeChatMiniProgram.md'},
            ]
          }, {
            text: '开源项目',
            items: [
              {
                text: '🔥Mybatis Flex Helper', link: '/guide/mybatisFlex_Helper/index.md',
                collapsed: true,
                items: [
                  {text: '功能演示', link: '/guide/mybatisFlex_Helper/features'},
                  {text: '模板变量', link: '/guide/mybatisFlex_Helper/templateVariate.md'},
                  {text: '常见问题', link: '/guide/mybatisFlex_Helper/issue.md'},
                  {text: '更新日志', link: '/guide/mybatisFlex_Helper/changelog.md'},
                ]
              },
              {text: 'java异常消息提醒', link: '/guide/frame/exceptionNotice.md'},
            ]
          }, {
            text: 'java相关',
            collapsed: true,
            items: [
              {text: '自定义starter', link: '/guide/starter/自定义starter及上传私服.md'},
              {text: 'Cypher入门', link: '/guide/java/Cypher.md'},
              {text: '下载限速', link: '/guide/java/java-speed-limit.md'},
            ]
          },
        ],
      },
    ],


    //侧边栏
    sidebar: [
      {
        text: '数据中间件',
        collapsed: true,
        items: [
          {text: 'Canal', link: '/guide/middleware/canal.md'},
          {text: 'Seata', link: '/guide/middleware/seata.md'},
          {text: 'TransmittableThreadLocal', link: '/guide/middleware/TransmittableThreadLocal.md'},
        ]
      }, {
        text: '前端',
        collapsed: true,
        items: [
          {text: 'TypeScript快速入门', link: '/guide/js/TypeScript快速入门.md'},
          {text: 'uniapp消息推送', link: '/guide/uniapp/messagePush.md'},
          {text: 'uniapp集成第三方SDK', link: '/guide/uniapp/otherSDK.md'},
          {text: 'uniapp入门到打包', link: '/guide/uniapp/package.md'},
          {text: '微信小程序部分功能示例', link: '/guide/uniapp/WeChatMiniProgram.md'},
        ]
      }, {
        text: '开源项目',
        items: [
          {
            text: '🔥Mybatis Flex Helper', link: '/guide/mybatisFlex_Helper/index.md',
            collapsed: true,
            items: [
              {text: '功能演示', link: '/guide/mybatisFlex_Helper/features'},
              {text: '模板变量', link: '/guide/mybatisFlex_Helper/templateVariate.md'},
              {text: '常见问题', link: '/guide/mybatisFlex_Helper/issue.md'},
              {text: '更新日志', link: '/guide/mybatisFlex_Helper/changelog.md'},
            ]
          },
          {text: 'java异常消息提醒', link: '/guide/frame/exceptionNotice.md'},
        ]
      }, {
        text: 'java相关',
        collapsed: true,
        items: [
          {text: '自定义starter', link: '/guide/starter/自定义starter及上传私服.md'},
          {text: 'Cypher入门', link: '/guide/java/Cypher.md'},
          {text: '下载限速', link: '/guide/java/java-speed-limit.md'},
        ]
      },
    ],



    //本地搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                },
              },
            },
          },
        },
      },
    },



    //社交链接
    socialLinks: [
      { icon: 'gitee', link: 'https://gitee.com/djxchi/vitepress' },
    ],

    //手机端深浅模式文字修改
    darkModeSwitchLabel: '深浅模式',

    //页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023-${new Date().getFullYear()}<div style="display: flex; align-items: center; justify-content: center;"> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=43010202001744" rel="noreferrer" target="_blank" style="display: flex; align-items: center; justify-content: center;"><image src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png" style="height: 17px; margin-right: 4px; display: inline-block"/>湘公网安备43010202001744</a> <span style="margin: 0 5px">|</span> <a href="https://beian.miit.gov.cn/" target="_blank" style="white-space: nowrap;">湘ICP备19019594号-1</a></div> `,
    },

    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲'
    },


    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

  },



})
