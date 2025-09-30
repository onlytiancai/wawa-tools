<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div class="text-center">
        <div v-if="loading" class="space-y-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full">
            <span class="text-2xl animate-spin">⏳</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">登录处理中...</h2>
          <p class="text-gray-500 dark:text-gray-400">正在验证您的微信授权，请稍候</p>
        </div>

        <div v-else-if="error" class="space-y-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full">
            <span class="text-2xl">❌</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">登录失败</h2>
          <p class="text-red-500 dark:text-red-400">{{ errorMessage }}</p>
          <Button @click="goHome" class="mt-4">返回首页</Button>
        </div>

        <div v-else class="space-y-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
            <span class="text-2xl">✅</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">登录成功</h2>
          <p class="text-gray-500 dark:text-gray-400">欢迎回来，{{ userInfo?.nickname || '用户' }}</p>
          <Button @click="goToRedirect" class="mt-4">继续浏览</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const userInfo = ref(null);

// 在组件挂载时处理微信回调
onMounted(async () => {
  try {
    // 获取微信授权码
    const code = route.query.code;
    const state = route.query.state;
    
    if (!code) {
      throw new Error('未获取到授权码');
    }
    
    // 调用后端 API 获取用户信息
    const { data, error: fetchError } = await useFetch('/edge-api/auth/wechat/callback', {
      method: 'POST',
      body: {
        code,
        state
      }
    });
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || '登录失败，请重试');
    }
    
    if (!data.value || !data.value.user) {
      throw new Error('获取用户信息失败');
    }
    
    // 保存用户信息到本地存储
    userInfo.value = data.value.user;
    localStorage.setItem('wawa-user', JSON.stringify(data.value.user));
    
    loading.value = false;
  } catch (err) {
    console.error('微信登录回调处理失败:', err);
    loading.value = false;
    error.value = true;
    errorMessage.value = err.message || '登录失败，请重试';
  }
});

// 跳转到登录前的页面
function goToRedirect() {
  const redirectUrl = localStorage.getItem('wawa-login-redirect') || '/';
  localStorage.removeItem('wawa-login-redirect');
  router.push(redirectUrl);
}

// 返回首页
function goHome() {
  router.push('/');
}
</script>