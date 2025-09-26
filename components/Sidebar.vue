<template>
  <div class="flex min-h-screen">
    <!-- 侧边栏 -->
    <div class="flex flex-col">
      <div 
        class="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col"
        :class="isCollapsed ? 'w-16' : 'w-64'"
      >
        <!-- 网站标题和logo -->
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <NuxtLink 
            to="/" 
            class="flex items-center justify-center mb-3 transition-colors hover:opacity-80"
          >
            <span class="text-xl">🐸</span>
            <span v-if="!isCollapsed" class="ml-2 text-base font-semibold text-gray-800 dark:text-gray-200">蛙蛙工具</span>
          </NuxtLink>
          
          <!-- 折叠按钮 -->
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
        <nav class="p-1 flex-1 min-h-0 overflow-y-auto">
          <div class="space-y-1">
            <NuxtLink 
              to="/markdown" 
              class="flex items-center p-2 rounded-lg transition-colors"
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
              class="flex items-center p-2 rounded-lg transition-colors"
              :class="[
                $route.path === '/json' 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-lg">{}</span>
              <span v-if="!isCollapsed" class="ml-3 font-medium">JSON 工具</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- 主题切换和底部区域 -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <!-- 主题切换按钮 -->
          <Button 
            @click="toggleTheme" 
            variant="ghost" 
            class="w-full justify-start mb-2"
          >
            <span class="text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
            <span v-if="!isCollapsed" class="ml-2">{{ isDark ? '浅色模式' : '深色模式' }}</span>
          </Button>
          
          <!-- 网站信息 -->
          <div v-if="!isCollapsed" class="text-xs text-gray-500 dark:text-gray-400 text-center">
            Wawa Tools v1.0
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 min-h-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
const isCollapsed = ref(false);
const isDark = ref(false);

// 初始化主题
onMounted(() => {
  // 检查本地存储的主题设置
  const savedTheme = localStorage.getItem('wawa-theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    // 检查系统偏好
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme();
});

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleTheme() {
  isDark.value = !isDark.value;
  applyTheme();
  // 保存到本地存储
  localStorage.setItem('wawa-theme', isDark.value ? 'dark' : 'light');
}

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 监听系统主题变化
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => {
    // 只有在没有手动设置主题时才跟随系统
    if (!localStorage.getItem('wawa-theme')) {
      isDark.value = e.matches;
      applyTheme();
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // 清理监听器
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleChange);
  });
});
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
}
</style>