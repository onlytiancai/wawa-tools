<template>
  <Sidebar>
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">


      <!-- 编辑器区域 -->
      <div class="flex flex-col h-[calc(100vh-120px)] w-full">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0 px-6">
          <!-- 输入区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-green-600 dark:text-green-400">📥</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">输入 JSON</h2>
            </div>
            
            <textarea 
              v-model="jsonInput" 
              class="flex-1 w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-0"
              placeholder='{"example": "在这里粘贴 JSON 数据..."}'
              @input="formatJson"
            ></textarea>
            
            <div class="flex gap-3 mt-4">
              <Button @click="formatJson" variant="default" class="flex-1">
                <span class="mr-2">✨</span>
                格式化
              </Button>
              <Button @click="minifyJson" variant="outline" class="flex-1">
                <span class="mr-2">🔍</span>
                压缩
              </Button>
              <Button @click="clearJson" variant="destructive" class="flex-1">
                <span class="mr-2">🗑️</span>
                清空
              </Button>
            </div>
          </div>

          <!-- 输出区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-blue-600 dark:text-blue-400">📤</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">格式化结果</h2>
            </div>
            
            <div 
              class="flex-1 w-full p-4 border rounded-lg font-mono text-sm overflow-auto min-h-0"
              :class="hasError ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white'"
            >
              <pre><code>{{ jsonOutput }}</code></pre>
            </div>
            
            <div v-if="!hasError && jsonOutput" class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <span class="mr-2">✅</span>
              JSON 格式正确
            </div>
            <div v-else-if="hasError" class="mt-4 flex items-center text-sm text-red-600 dark:text-red-400">
              <span class="mr-2">❌</span>
              请检查 JSON 格式
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </Sidebar>
</template>

<script setup>
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
/* 宽屏优化样式 */
</style>