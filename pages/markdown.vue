<template>
  <div class="container">
    <h1 class="title">Markdown 预览</h1>
    <div class="back-link">
      <NuxtLink to="/">返回首页</NuxtLink>
    </div>
    
    <div class="editor-container">
      <div class="editor-section">
        <h2>编辑</h2>
        <textarea 
          v-model="markdownText" 
          class="editor" 
          placeholder="在这里输入 Markdown 文本..."
          @input="updatePreview"
        ></textarea>
      </div>
      
      <div class="preview-section">
        <h2>预览</h2>
        <div class="preview" v-html="htmlPreview"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  text-align: center;
}

.back-link {
  margin-bottom: 2rem;
}

.back-link a {
  color: #3498db;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 70vh;
}

.editor-section, .preview-section {
  display: flex;
  flex-direction: column;
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #3498db;
}

.editor {
  flex-grow: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 1rem;
  resize: none;
}

.preview {
  flex-grow: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

/* Markdown 样式 */
.preview :deep(h1) {
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}

.preview :deep(h2) {
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}

.preview :deep(h3) {
  font-size: 1.17em;
  margin-top: 1em;
  margin-bottom: 1em;
}

.preview :deep(h4) {
  margin-top: 1.33em;
  margin-bottom: 1.33em;
}

.preview :deep(h5) {
  font-size: 0.83em;
  margin-top: 1.67em;
  margin-bottom: 1.67em;
}

.preview :deep(h6) {
  font-size: 0.67em;
  margin-top: 2.33em;
  margin-bottom: 2.33em;
}

.preview :deep(p) {
  margin-top: 1em;
  margin-bottom: 1em;
}

.preview :deep(blockquote) {
  margin-left: 0;
  padding-left: 1em;
  border-left: 3px solid #ddd;
  color: #777;
}

.preview :deep(pre) {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.preview :deep(code) {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.preview :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.preview :deep(li) {
  margin: 0.5em 0;
}

.preview :deep(img) {
  max-width: 100%;
}

.preview :deep(a) {
  color: #3498db;
  text-decoration: none;
}

.preview :deep(a:hover) {
  text-decoration: underline;
}
</style>