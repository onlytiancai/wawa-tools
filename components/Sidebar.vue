<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <div 
      class="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'w-16' : 'w-64'"
    >
      <!-- 折叠按钮 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button 
          @click="toggleSidebar" 
          variant="ghost" 
          size="icon"
          class="w-full justify-start"
        >
          <span class="text-lg">{{ isCollapsed ? '→' : '←' }}</span>
          <span v-if="!isCollapsed" class="ml-2">折叠</span>
        </Button>
      </div>

      <!-- 导航菜单 -->
      <nav class="p-2">
        <NuxtLink 
          to="/" 
          class="flex items-center p-3 rounded-lg mb-2 transition-colors"
          :class="[
            $route.path === '/' 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <span class="text-lg">🏠</span>
          <span v-if="!isCollapsed" class="ml-3 font-medium">首页</span>
        </NuxtLink>

        <NuxtLink 
          to="/markdown" 
          class="flex items-center p-3 rounded-lg mb-2 transition-colors"
          :class="[
            $route.path === '/markdown' 
              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <span class="text-lg">📝</span>
          <span v-if="!isCollapsed" class="ml-3 font-medium">Markdown 工具</span>
        </NuxtLink>

        <NuxtLink 
          to="/json" 
          class="flex items-center p-3 rounded-lg mb-2 transition-colors"
          :class="[
            $route.path === '/json' 
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <span class="text-lg">{}</span>
          <span v-if="!isCollapsed" class="ml-3 font-medium">JSON 工具</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
}
</style>