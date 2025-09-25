// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Wawa Tools',
      meta: [
        { name: 'description', content: '实用的在线工具集合，包括Markdown预览和JSON格式化' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [ tailwindcss() ],
  },
  modules: [
    'shadcn-nuxt',
    // …可能还要有 Tailwind 模块或插件
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui', // 放组件的目录（可自定义）
  },
})
