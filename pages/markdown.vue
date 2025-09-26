<template>
  <Sidebar>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">


      <!-- 编辑器区域 -->
      <div class="flex flex-col h-[calc(100vh-120px)] w-full">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0 px-6">
          <!-- 编辑区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-purple-600 dark:text-purple-400">✏️</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">编辑</h2>
            </div>

            <Codemirror v-model="markdownText" :extensions="extensions" 
            class="flex-1 w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-0"
            />


          </div>

          <!-- 预览区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mr-3">
                <span class="text-pink-600 dark:text-pink-400">👁️</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">预览</h2>
            </div>

            <div
              class="flex-1 w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-auto markdown-preview min-h-0">
              <div class="markdown-body" v-html="htmlPreview"></div>
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
import 'github-markdown-css/github-markdown.css';
import { Codemirror } from 'vue-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

const extensions = [
 markdown({ codeLanguages: languages })
]

const markdownText = ref('# Markdown 预览工具\n\n欢迎使用 **Wawa Tools** 的 Markdown 预览功能！\n\n## 功能特点\n\n- 实时预览\n- 简洁界面\n- 支持常用 Markdown 语法\n- 数学公式支持（KaTeX）\n\n### 数学公式示例\n\n行内公式：$E = mc^2$\n\n块级公式：\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n\n### 示例代码\n\n```javascript\nfunction hello() {\n  console.log("Hello, Markdown!");\n}\n```\n\n> 在左侧编辑，右侧实时预览效果');
const htmlPreview = ref('<p>Markdown 预览工具 - 请在浏览器中查看实时预览</p>');

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

function updatePreview() {
  try {
    let html = marked.parse(markdownText.value);
    html = processMathFormulas(html);
    htmlPreview.value = html;
    
    // 只在客户端执行 DOM 操作
    if (process.client) {
      nextTick(() => {
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      });
    }
  } catch (error) {
    console.error('Error updating preview:', error);
    htmlPreview.value = '<p>预览生成失败</p>';
  }
}

onMounted(() => {
  updatePreview();
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
  background-color: transparent;
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

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .markdown-preview :deep(.markdown-body) {
    color-scheme: dark;
  }
}
</style>