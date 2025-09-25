<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4">
          <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">📝</span>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Markdown 预览</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Wawa Tools - 实时 Markdown 编辑与预览</p>
        <div class="mt-4">
          <NuxtLink to="/" class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            <span>← 返回首页</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 编辑器区域 -->
      <div class="flex flex-col h-[calc(100vh-160px)] w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 px-2">
          <!-- 编辑区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-purple-600 dark:text-purple-400">✏️</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">编辑</h2>
            </div>
            
            <textarea 
              v-model="markdownText" 
              class="flex-1 w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-0"
              placeholder="# 在这里输入 Markdown 文本..."
              @input="updatePreview"
            ></textarea>
          </div>

          <!-- 预览区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-pink-600 dark:text-pink-400">👁️</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">预览</h2>
            </div>
            
            <div class="flex-1 w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-auto markdown-preview min-h-0">
              <div v-html="htmlPreview"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const markdownText = ref('# Markdown 预览工具\n\n欢迎使用 **Wawa Tools** 的 Markdown 预览功能！\n\n## 功能特点\n\n- 实时预览\n- 简洁界面\n- 支持常用 Markdown 语法\n\n### 示例代码\n\n```javascript\nfunction hello() {\n  console.log("Hello, Markdown!");\n}\n```\n\n> 在左侧编辑，右侧实时预览效果');
const htmlPreview = ref('');

// 简单的Markdown解析函数
function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  // 处理标题
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  
  // 处理粗体和斜体
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>')
    .replace(/\_(.*?)\_/g, '<em>$1</em>');
  
  // 处理链接
  html = html.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
  
  // 处理图片
  html = html.replace(/!\[([^\[]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // 处理列表
  html = html.replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\s*-\s(.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\s*\d\.\s(.*$)/gm, '<li>$1</li>');
  
  // 处理引用
  html = html.replace(/^\>\s(.*$)/gm, '<blockquote>$1</blockquote>');
  
  // 处理代码块
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 处理段落和换行
  html = html.replace(/\n\n/g, '</p><p>');
  
  // 包装在段落标签中
  html = '<p>' + html + '</p>';
  
  // 清理多余的段落标签
  html = html.replace(/<\/p><p><\/p><p>/g, '</p><p>');
  
  return html;
}

function updatePreview() {
  htmlPreview.value = parseMarkdown(markdownText.value);
}

onMounted(() => {
  updatePreview();
});
</script>

<style scoped>
/* 保留必要的自定义样式 */
.container {
  max-width: 1200px;
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  font-weight: bold;
  color: #2c3e50;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  font-weight: bold;
  color: #2c3e50;
}

.markdown-preview :deep(h3) {
  font-size: 1.17em;
  margin-top: 1em;
  margin-bottom: 1em;
  font-weight: bold;
  color: #2c3e50;
}

.markdown-preview :deep(p) {
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.6;
}

.markdown-preview :deep(blockquote) {
  margin-left: 0;
  padding-left: 1em;
  border-left: 3px solid #ddd;
  color: #777;
  font-style: italic;
}

.markdown-preview :deep(pre) {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-preview :deep(code) {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-preview :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-preview :deep(li) {
  margin: 0.5em 0;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.markdown-preview :deep(a) {
  color: #3498db;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

.markdown-preview :deep(strong) {
  font-weight: bold;
}

.markdown-preview :deep(em) {
  font-style: italic;
}
</style>