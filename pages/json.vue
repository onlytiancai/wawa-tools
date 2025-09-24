<template>
  <div class="container">
    <h1 class="title">JSON 格式化</h1>
    <div class="back-link">
      <NuxtLink to="/">返回首页</NuxtLink>
    </div>
    
    <div class="editor-container">
      <div class="editor-section">
        <h2>输入 JSON</h2>
        <textarea 
          v-model="jsonInput" 
          class="editor" 
          placeholder="在这里粘贴 JSON 数据..."
          @input="formatJson"
        ></textarea>
        <div class="button-group">
          <button @click="formatJson" class="btn format">格式化</button>
          <button @click="minifyJson" class="btn minify">压缩</button>
          <button @click="clearJson" class="btn clear">清空</button>
        </div>
      </div>
      
      <div class="output-section">
        <h2>格式化结果</h2>
        <div class="output" :class="{ error: hasError }">
          <pre><code>{{ jsonOutput }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const jsonInput = ref('{\n  "name": "Wawa Tools",\n  "version": "1.0.0",\n  "description": "实用的在线工具集合",\n  "features": ["Markdown预览", "JSON格式化"],\n  "isAwesome": true\n}');
const jsonOutput = ref('');
const hasError = ref(false);

// 初始化时格式化示例JSON
formatJson();

function formatJson() {
  try {
    if (!jsonInput.value.trim()) {
      jsonOutput.value = '';
      hasError.value = false;
      return;
    }
    
    const parsedJson = JSON.parse(jsonInput.value);
    jsonOutput.value = JSON.stringify(parsedJson, null, 2);
    hasError.value = false;
  } catch (error) {
    jsonOutput.value = `错误: ${error.message}`;
    hasError.value = true;
  }
}

function minifyJson() {
  try {
    if (!jsonInput.value.trim()) {
      jsonOutput.value = '';
      hasError.value = false;
      return;
    }
    
    const parsedJson = JSON.parse(jsonInput.value);
    jsonOutput.value = JSON.stringify(parsedJson);
    hasError.value = false;
  } catch (error) {
    jsonOutput.value = `错误: ${error.message}`;
    hasError.value = true;
  }
}

function clearJson() {
  jsonInput.value = '';
  jsonOutput.value = '';
  hasError.value = false;
}
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

.editor-section, .output-section {
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
  margin-bottom: 1rem;
}

.output {
  flex-grow: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-y: auto;
  background-color: #f9f9f9;
  font-family: monospace;
}

.output.error {
  color: #e74c3c;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.format {
  background-color: #3498db;
  color: white;
}

.format:hover {
  background-color: #2980b9;
}

.minify {
  background-color: #2ecc71;
  color: white;
}

.minify:hover {
  background-color: #27ae60;
}

.clear {
  background-color: #e74c3c;
  color: white;
}

.clear:hover {
  background-color: #c0392b;
}

pre {
  margin: 0;
}
</style>