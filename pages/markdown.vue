<template>
  <Sidebar>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 overflow-auto">

      <!-- 编辑器区域 -->
      <div class="w-full flex-1 min-h-0">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 px-6 py-6 h-full">
          <!-- 编辑区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full">
            <div class="flex items-center mb-4 flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-purple-600 dark:text-purple-400">✏️</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">编辑</h2>
            </div>

            <div class="flex-1 min-h-0">
              <Codemirror 
                @ready="onReady"
                v-model="markdownText" 
                :extensions="extensions"
                class="w-full h-full border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- 预览区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full">
            <div class="flex items-center mb-4 flex-shrink-0">
              <div class="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-pink-600 dark:text-pink-400">👁️</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">预览</h2>
            </div>

            <div class="flex-1 min-h-0 overflow-y-auto">
              <div class="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 markdown-preview" :class="{ dark: isDark }">
                <div class="markdown-body" v-html="htmlPreview"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </Sidebar>
</template>

<script setup>
import { marked } from 'marked';
import katex from 'katex';
import hljs from 'highlight.js';
import { nextTick } from 'vue';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import 'github-markdown-css/github-markdown.css';
import { Codemirror } from 'vue-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'
import { darkLineNumberTheme, lightLineNumberTheme } from '../lib/utils.ts'
import { Compartment } from '@codemirror/state'

const isDark = ref(false);
const themeCompartment = new Compartment()
const extensions = [
  markdown({ codeLanguages: languages }),
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

const markdownText = ref('# Markdown 预览工具\n\n欢迎使用 **Wawa Tools** 的 Markdown 预览功能！\n\n## 功能特点\n\n- 实时预览\n- 简洁界面\n- 支持常用 Markdown 语法\n- 数学公式支持（KaTeX）\n\n### 数学公式示例\n\n行内公式：$E = mc^2$\n\n块级公式：\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n\n### 示例代码\n\n```javascript\nfunction hello() {\n  console.log("Hello, Markdown!");\n}\n```\n\n> 在左侧编辑，右侧实时预览效果');


const htmlPreview = computed(() => {
    let html = marked.parse(markdownText.value);
    html = processMathFormulas(html);
    // 只在客户端执行 DOM 操作
    if (import.meta.client) {
      nextTick(() => {
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      });
    }
    return html
})

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function(code, lang) {
    try {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const result = hljs.highlight(code, { language });
      
      return `<div class="code-block">
        <div class="code-header">
          <span class="language-label">${language}</span>
        </div>
        <pre><code class="hljs language-${language}">${result.value}</code></pre>
      </div>`;
    } catch (e) {
      return `<pre><code>${code}</code></pre>`;
    }
  }
});

// 处理数学公式的函数
function processMathFormulas(html) {
  // 处理块级数学公式 $$...$$，需要处理可能包含的<br>标签
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      const cleanMath = math.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').trim();
      return katex.renderToString(cleanMath, { displayMode: true, throwOnError: false });
    } catch (e) {
      return match;
    }
  });
  
  // 处理行内数学公式 $...$
  html = html.replace(/\$([^$]+)\$/g, (match, math) => {
    try {
      const cleanMath = math.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/g, ' ').trim();
      return katex.renderToString(cleanMath, { displayMode: false, throwOnError: false });
    } catch (e) {
      return match;
    }
  });
  
  return html;
}

onMounted(() => {
  
});
</script>

<style scoped>
/* 宽屏优化样式 */
.markdown-preview {
  max-width: none;
}

/* 确保 markdown-body 样式正确应用 */
.markdown-preview :deep(.markdown-body) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  background-color: #ffffff;
  color: #24292e;
  padding: 16px;
  border-radius: 6px;
}

/* 亮色主题下的 markdown 预览样式 */
.markdown-preview:not(.dark) :deep(.markdown-body) {
  background-color: #ffffff;
  color: #24292e;
}

.markdown-preview:not(.dark) :deep(.markdown-body h1),
.markdown-preview:not(.dark) :deep(.markdown-body h2),
.markdown-preview:not(.dark) :deep(.markdown-body h3),
.markdown-preview:not(.dark) :deep(.markdown-body h4),
.markdown-preview:not(.dark) :deep(.markdown-body h5),
.markdown-preview:not(.dark) :deep(.markdown-body h6) {
  color: #24292e;
  border-bottom-color: #eaecef;
}

.markdown-preview:not(.dark) :deep(.markdown-body code) {
  background-color: rgba(175, 184, 193, 0.2);
  color: #24292e;
}

.markdown-preview:not(.dark) :deep(.markdown-body pre) {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
}

.markdown-preview:not(.dark) :deep(.markdown-body blockquote) {
  border-left-color: #dfe2e5;
  background-color: #f6f8fa;
  color: #6a737d;
}

.markdown-preview:not(.dark) :deep(.markdown-body table) {
  border-color: #dfe2e5;
}

.markdown-preview:not(.dark) :deep(.markdown-body th),
.markdown-preview:not(.dark) :deep(.markdown-body td) {
  border-color: #dfe2e5;
}

.markdown-preview:not(.dark) :deep(.markdown-body tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

/* 恢复列表标记符号 */
.markdown-preview :deep(.markdown-body ul) {
  list-style-type: disc;
}

.markdown-preview :deep(.markdown-body ol) {
  list-style-type: decimal;
}

.markdown-preview :deep(.markdown-body li) {
  margin: 0.25em 0;
}

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



/* 暗色模式下的 markdown 预览样式 */
.markdown-preview.dark :deep(.markdown-body) {
  color-scheme: dark;
  background-color: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 6px;
}

.markdown-preview.dark :deep(.markdown-body h1),
.markdown-preview.dark :deep(.markdown-body h2),
.markdown-preview.dark :deep(.markdown-body h3),
.markdown-preview.dark :deep(.markdown-body h4),
.markdown-preview.dark :deep(.markdown-body h5),
.markdown-preview.dark :deep(.markdown-body h6) {
  color: #f9fafb;
  border-bottom-color: #374151;
}

.markdown-preview.dark :deep(.markdown-body code) {
  background-color: #374151;
  color: #f9fafb;
}

.markdown-preview.dark :deep(.markdown-body pre) {
  background-color: #111827;
  border: 1px solid #374151;
}

.markdown-preview.dark :deep(.markdown-body blockquote) {
  border-left-color: #4b5563;
  background-color: #374151;
  color: #d1d5db;
}

.markdown-preview.dark :deep(.markdown-body table) {
  border-color: #374151;
}

.markdown-preview.dark :deep(.markdown-body th),
.markdown-preview.dark :deep(.markdown-body td) {
  border-color: #374151;
}

.markdown-preview.dark :deep(.markdown-body tr:nth-child(2n)) {
  background-color: #1f2937;
}

/* 代码高亮主题切换 */
.markdown-preview:not(.dark) :deep(.hljs) {
  background: #f6f8fa !important;
}

.markdown-preview.dark :deep(.hljs) {
  background: #0d1117 !important;
}
</style>