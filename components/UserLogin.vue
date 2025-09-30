<template>
  <div class="flex items-center">
    <!-- 未登录状态 -->
    <div v-if="!userInfo" class="flex items-center">
      <Button 
        @click="handleWechatLogin" 
        variant="outline" 
        class="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 dark:border-green-800"
      >
        <span class="text-lg">🔑</span>
        <span>微信登录</span>
      </Button>
    </div>

    <!-- 已登录状态 -->
    <div v-else class="flex items-center">
      <div class="relative group">
        <Button 
          variant="ghost" 
          class="flex items-center gap-2"
          @click="toggleUserMenu"
        >
          <img 
            :src="userInfo.avatar || '/default-avatar.png'" 
            alt="用户头像" 
            class="w-8 h-8 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
          />
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ userInfo.nickname || '用户' }}</span>
        </Button>

        <!-- 用户菜单 -->
        <div 
          v-if="showUserMenu" 
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
        >
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ userInfo.nickname }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userInfo.openid }}</p>
          </div>
          <button 
            @click="handleLogout" 
            class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const userInfo = ref(null);
const showUserMenu = ref(false);

// 在组件挂载时检查登录状态
onMounted(async () => {
  await checkLoginStatus();
});

// 检查登录状态
async function checkLoginStatus() {
  try {
    const storedUser = localStorage.getItem('wawa-user');
    if (storedUser) {
      userInfo.value = JSON.parse(storedUser);
      
      // 验证 token 是否有效
      const { data, error } = await useFetch('/edge-api/auth/verify', {
        method: 'POST',
        body: {
          token: userInfo.value.token
        }
      });
      
      if (error.value || !data.value?.valid) {
        // token 无效，清除登录状态
        handleLogout();
      }
    }
  } catch (err) {
    console.error('检查登录状态失败:', err);
    handleLogout();
  }
}

// 处理微信登录
function handleWechatLogin() {
  // 获取微信登录授权 URL
  useFetch('/edge-api/auth/wechat/url')
    .then(({ data, error }) => {
      if (error.value) {
        console.error('获取微信登录 URL 失败:', error.value);
        return;
      }
      
      // 打开微信授权页面
      if (data.value?.authUrl) {
        // 保存当前页面 URL，用于登录后重定向回来
        localStorage.setItem('wawa-login-redirect', window.location.href);
        
        // 跳转到微信授权页面
        window.location.href = data.value.authUrl;
      }
    });
}

// 处理退出登录
function handleLogout() {
  userInfo.value = null;
  localStorage.removeItem('wawa-user');
  showUserMenu.value = false;
}

// 切换用户菜单显示状态
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

// 点击外部关闭用户菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (showUserMenu.value && !e.target.closest('.group')) {
      showUserMenu.value = false;
    }
  });
});

// 导出用户信息，供其他组件使用
defineExpose({
  userInfo
});
</script>