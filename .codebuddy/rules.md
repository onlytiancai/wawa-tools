# Wawa Tools 项目规则

## 项目概述
这是一个基于 Nuxt 3 的在线工具集合项目，集成了 Tailwind CSS 和 shadcn-nuxt UI 组件库。

## 技术栈规范

### Nuxt 3 项目结构
```
pages/           # 页面组件
components/      # 通用组件
assets/          # 静态资源
lib/             # 工具函数
server/          # 服务端API
```

### Tailwind CSS 使用规范
- 使用 Tailwind CSS v4.x
- 颜色系统基于 OKLCH 色彩空间
- 支持暗色模式切换
- 响应式设计优先

### shadcn-nuxt 组件规范
- 组件前缀：空（默认）
- 组件目录：`@/components/ui`
- 使用 Composition API (`<script setup>`)
- 遵循 Vue 3 最佳实践

## 代码编写规范

### Vue 组件结构
```vue
<template>
  <!-- 语义化HTML结构 -->
</template>

<script setup>
// Composition API - 使用 Nuxt 自动导入功能
// ref, onMounted 等 Vue API 无需显式导入
// useState, useFetch 等 Nuxt 组合式函数无需显式导入
// 仅在需要自定义导入时才使用 import 语句
// components 无需显式导入
</script>

<style scoped>
/* Scoped样式 */
</style>
```

### Nuxt 自动导入规范
- 使用 `ref`, `computed`, `watch` 等 Vue API 时无需显式导入
- 使用 `useState`, `useFetch` 等 Nuxt 组合式函数时无需显式导入
- 仅在需要自定义导入时才使用 `import` 语句

### 样式规范
- 优先使用 Tailwind CSS 类名
- 必要时使用自定义 CSS 变量
- 保持样式模块化（scoped）
- 支持暗色模式主题

### 组件命名
- 使用 PascalCase（大驼峰）命名
- 文件名与组件名保持一致
- 页面组件使用 kebab-case（短横线）

## 开发工作流

### 新增工具页面
1. 在 `pages/` 目录创建新页面
2. 在首页添加导航链接
3. 更新项目描述和元数据

### 添加新组件
1. 使用 `npx shadcn-vue add` 命令添加组件
2. 在 `components/ui/` 目录管理
3. 遵循组件设计系统规范

## 部署规范
- 使用 `npm run build` 构建项目
- 使用 `npm run preview` 预览构建结果
- 支持静态站点生成（SSG）

## 注意事项
- 确保所有工具功能在客户端可用
- 保持代码的树摇优化（Tree-shaking）
- 遵循 Vue 3 和 Nuxt 3 的最佳实践