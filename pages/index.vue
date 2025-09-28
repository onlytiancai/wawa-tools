<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-12">
      <!-- 头部区域 -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-6">
          <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">🐸</span>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Wawa Tools
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          一站式在线工具集合，为开发者提供便捷高效的解决方案
        </p>
      </div>

      <!-- 功能展示区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <NuxtLink 
          to="/markdown" 
          class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
        >
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <span class="text-blue-600 dark:text-blue-400 text-lg">📝</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Markdown 预览</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            实时预览和编辑 Markdown 文档，支持语法高亮和即时渲染
          </p>
          <div class="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
            开始使用
            <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/json" 
          class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600"
        >
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
              <span class="text-green-600 dark:text-green-400 text-lg">{}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">JSON 格式化</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            智能格式化和验证 JSON 数据，支持语法检查和美化输出
          </p>
          <div class="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
            开始使用
            <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </NuxtLink>

        <div class="group bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span class="text-lg">✨</span>
            </div>
            <h3 class="text-xl font-semibold">更多工具</h3>
          </div>
          <p class="text-blue-100 text-sm leading-relaxed mb-4">
            持续开发中，更多实用工具即将上线...
          </p>
          <Button variant="secondary" size="sm" class="bg-white/20 hover:bg-white/30 text-white border-0">
            敬请期待
          </Button>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="text-center mt-16">
        <div class="mb-4">
          <div class="inline-flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-300 text-sm mr-2">访问次数:</span>
            <span class="font-mono text-blue-600 dark:text-blue-400 font-semibold">{{ visitCount || '加载中...' }}</span>
          </div>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          基于 Nuxt 3 + Tailwind CSS + shadcn-vue 构建
        </p>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
// 访问计数器
const { data: visitCount, error } = await useFetch('/edge-api/visit', {
  key: 'visit-count',
  server: false, // 在客户端执行
  transform: (data) => {
    return data?.visitCount || 0
  }
})

// 错误处理
if (error.value) {
  console.error('获取访问次数失败:', error.value)
}
</script>

<style scoped>
/* 保留必要的自定义样式 */
.container {
  max-width: 1200px;
}
</style>