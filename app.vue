<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- 对于微信登录回调页面，不使用 Sidebar 布局 -->
    <Sidebar v-if="!isAuthPage">
      <NuxtPage />
    </Sidebar>
    <NuxtPage v-else />
  </div>
</template>

<script setup>
const route = useRoute();

// 判断当前页面是否为认证相关页面
const isAuthPage = computed(() => {
  return route.path.startsWith('/auth/');
});
</script>