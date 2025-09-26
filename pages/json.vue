<template>
  <Sidebar>
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 overflow-auto">

      <!-- 编辑器区域 -->
      <div class="w-full flex-1 min-h-0">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 px-6 py-6 h-full">
          <!-- 编辑区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full">
            <div class="flex items-center mb-4 flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-green-600 dark:text-green-400">📥</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">输入 JSON</h2>
            </div>

            <div class="flex-1 min-h-0">
              <Codemirror 
                @ready="onReady"
                v-model="jsonInput" 
                :extensions="extensions"
                class="w-full h-full border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div class="flex gap-3 mt-4">
              <Button @click="formatJson" variant="outline" class="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <span class="mr-2">✨</span>
                格式化
              </Button>
              <Button @click="minifyJson" variant="outline" class="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <span class="mr-2">🔍</span>
                压缩
              </Button>
              <Button @click="clearJson" variant="outline" class="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <span class="mr-2">🗑️</span>
                清空
              </Button>
            </div>
          </div>

          <!-- 预览区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full">
            <div class="flex items-center mb-4 flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-blue-600 dark:text-blue-400">📤</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">JSON 预览</h2>
            </div>

            <div class="flex-1 min-h-0 overflow-y-auto">
              <div 
                v-if="hasError"
                class="w-full p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-mono text-sm"
              >
                <pre><code>{{ jsonOutput }}</code></pre>
              </div>
              
              <JsonViewer 
                v-else-if="parsedJson"
                :value="parsedJson"
                class="w-full h-full border border-gray-200 dark:border-gray-600 rounded-lg overflow-auto"
                :expand-depth="3"
                :copyable="true"
                :boxed="true"
                :theme="isDark ? 'dark' : 'light'"
              />
              
              <div v-else class="w-full h-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono text-sm flex items-center justify-center">
                等待输入 JSON 数据...
              </div>
            </div>
            
            <div v-if="!hasError && parsedJson" class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
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
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/vue3-json-viewer.css'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { EditorView } from '@codemirror/view'
import { darkLineNumberTheme, lightLineNumberTheme} from '../lib/utils.ts'
import { Compartment } from '@codemirror/state'



const jsonInput = ref('{\n  "name": "Wawa Tools",\n  "version": "1.0.0",\n  "description": "实用的在线工具集合",\n  "features": ["Markdown预览", "JSON格式化"],\n  "isAwesome": true\n}');


const isDark = ref(false);
const themeCompartment = new Compartment()
const extensions = [
  json(),
  EditorView.lineWrapping,
  themeCompartment.of(lightLineNumberTheme)
]

let view = null
function onReady(payload) {
  view = payload.view
}

watch(isDark, (dark) => {
  if (!view) return
  view.dispatch({
    effects: themeCompartment.reconfigure(dark ? darkLineNumberTheme : lightLineNumberTheme)
  })
})

// 监听主题变化
onMounted(() => {
  // 初始检查主题
  isDark.value = document.documentElement.classList.contains('dark');
  
  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        isDark.value = document.documentElement.classList.contains('dark');
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // 清理监听器
  onUnmounted(() => {
    observer.disconnect();
  });
});

// 使用computed实现实时预览
const jsonOutput = computed(() => {
  try {
    if (!jsonInput.value.trim()) {
      return '';
    }
    const parsed = JSON.parse(jsonInput.value);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    return `错误: ${error.message}`;
  }
});

const hasError = computed(() => {
  try {
    if (!jsonInput.value.trim()) return false;
    JSON.parse(jsonInput.value);
    return false;
  } catch {
    return true;
  }
});

const parsedJson = computed(() => {
  try {
    if (!jsonInput.value.trim()) return null;
    return JSON.parse(jsonInput.value);
  } catch {
    return null;
  }
});

function formatJson() {
  try {
    if (!jsonInput.value.trim()) return;
    const parsed = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(parsed, null, 2);
  } catch (error) {
    // 错误状态由computed自动处理
  }
}

function minifyJson() {
  try {
    if (!jsonInput.value.trim()) return;
    const parsed = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(parsed);
  } catch (error) {
    // 错误状态由computed自动处理
  }
}

function clearJson() {
  jsonInput.value = '';
}
</script>

<style scoped>
/* 编辑器区域样式优化 */
:deep(.cm-editor) {
  border-radius: 0.5rem;
  height: 100%;
}

:deep(.cm-scroller) {
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.cm-content) {
  min-height: 100%;
}

/* 高度控制样式 */
:deep(.cm-editor .cm-scroller) {
  height: 100%;
}

:deep(.cm-editor .cm-contentContainer) {
  height: 100%;
}

:deep(.cm-editor .cm-gutters) {
  height: 100%;
}

/* 设置编辑器最小高度 */
:deep(.cm-editor) {
  min-height: 300px;
}

/* JSON Viewer 样式优化 */
:deep(.jv-container) {
  height: 100%;
  overflow: auto;
}

:deep(.jv-code) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 暗色模式适配 */
:deep(.cm-editor.dark) {
  background-color: #1f2937;
}

:deep(.cm-editor.dark .cm-content) {
  color: #e5e7eb;
}

:deep(.cm-editor.dark .cm-gutters) {
  background-color: #111827;
  color: #6b7280;
  border-right: 1px solid #374151;
}

:deep(.cm-editor.dark .cm-activeLine) {
  background-color: #374151;
}

:deep(.cm-editor.dark .cm-activeLineGutter) {
  background-color: #111827;
  color: #9ca3af;
}

:deep(.cm-editor.dark .cm-lineNumbers .cm-gutterElement) {
  color: #6b7280;
}

:deep(.cm-editor.dark .cm-foldGutter .cm-gutterElement) {
  color: #6b7280;
}

/* 暗色模式下的按钮样式适配 */
:deep(.cm-editor.dark .cm-tooltip) {
  background-color: #374151;
  border: 1px solid #4b5563;
  color: #e5e7eb;
}

:deep(.cm-editor.dark .cm-panels) {
  background-color: #1f2937;
  color: #e5e7eb;
}
</style>