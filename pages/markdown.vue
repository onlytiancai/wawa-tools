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

// 初始化 highlight.js
hljs.highlightAll();

const markdownText = ref('# Markdown 预览工具\n\n欢迎使用 **Wawa Tools** 的 Markdown 预览功能！\n\n## 功能特点\n\n- 实时预览\n- 简洁界面\n- 支持常用 Markdown 语法\n- 数学公式支持（KaTeX）\n\n### 数学公式示例\n\n行内公式：$E = mc^2$\n\n块级公式：\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n\n### 示例代码\n\n```javascript\nfunction hello() {\n  console.log("Hello, Markdown!");\n}\n```\n\n> 在左侧编辑，右侧实时预览效果');
const htmlPreview = ref('');

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
      // 如果高亮失败，返回原始代码
      return `<pre><code>${code}</code></pre>`;
    }
  }
});

// 处理数学公式的函数
function processMathFormulas(html) {
  // 处理块级数学公式 $$...$$，需要处理可能包含的<br>标签
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      // 清理数学公式中的HTML标签和多余空格
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
  let html = marked.parse(markdownText.value);
  html = processMathFormulas(html);
  htmlPreview.value = html;
  
  // 在下一个 tick 中手动调用 highlight.js
  nextTick(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  });
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

/* GitHub风格的Markdown样式 */
.markdown-preview :deep(*) {
  box-sizing: border-box;
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  margin: 0.67em 0;
  font-weight: 600;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
  color: #24292e;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
  color: #24292e;
}

.markdown-preview :deep(h3) {
  font-size: 1.25em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  color: #24292e;
}

.markdown-preview :deep(h4) {
  font-size: 1em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  color: #24292e;
}

.markdown-preview :deep(h5) {
  font-size: 0.875em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  color: #24292e;
}

.markdown-preview :deep(h6) {
  font-size: 0.85em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  color: #586069;
}

.markdown-preview :deep(p) {
  margin: 1em 0;
  line-height: 1.6;
  color: #24292e;
}

.markdown-preview :deep(blockquote) {
  margin: 1em 0;
  padding: 0 1em;
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
}

.markdown-preview :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
  font-size: 14px;
  line-height: 1.45;
}

.markdown-preview :deep(code) {
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
}

.markdown-preview :deep(pre code) {
  padding: 0;
  background-color: transparent;
  font-size: 100%;
}

.markdown-preview :deep(ul) {
  margin: 1em 0;
  padding-left: 2em;
}

.markdown-preview :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.markdown-preview :deep(li) {
  margin: 0.25em 0;
  line-height: 1.6;
}

.markdown-preview :deep(table) {
  border-spacing: 0;
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown-preview :deep(th) {
  background-color: #f6f8fa;
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
  font-weight: 600;
  text-align: left;
}

.markdown-preview :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}

.markdown-preview :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

.markdown-preview :deep(strong) {
  font-weight: 600;
}

.markdown-preview :deep(em) {
  font-style: italic;
}

.markdown-preview :deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

/* KaTeX数学公式样式 */
.markdown-preview :deep(.katex) {
  font-size: 1.1em;
}

.markdown-preview :deep(.katex-display) {
  margin: 1em 0;
  text-align: center;
}

.markdown-preview :deep(.katex-display > .katex) {
  text-align: center;
}

/* 代码块样式 */
.markdown-preview :deep(.code-block) {
  margin: 1em 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-preview :deep(.code-header) {
  background: #24292e;
  color: #f6f8fa;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.markdown-preview :deep(.language-label) {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}



/* 确保 highlight.js 样式正确应用 */
.markdown-preview :deep(.hljs) {
  display: block !important;
  background: #f6f8fa !important;
  color: #24292e !important;
}

.markdown-preview :deep(.code-block .hljs) {
  background: #f6f8fa !important;
}

/* 重置代码块内 pre 和 code 的样式 */
.markdown-preview :deep(.code-container pre.hljs) {
  background: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
}

.markdown-preview :deep(.code-container pre.hljs code) {
  background: transparent !important;
  padding: 0 !important;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .markdown-preview :deep(.code-block) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .markdown-preview :deep(h1),
  .markdown-preview :deep(h2),
  .markdown-preview :deep(h3),
  .markdown-preview :deep(h4),
  .markdown-preview :deep(h5),
  .markdown-preview :deep(p) {
    color: #e6edf3;
  }
  
  .markdown-preview :deep(h6) {
    color: #7d8590;
  }
  
  .markdown-preview :deep(blockquote) {
    border-left-color: #3d444d;
    color: #7d8590;
  }
  
  .markdown-preview :deep(pre) {
    background-color: #161b22;
  }
  
  .markdown-preview :deep(code) {
    background-color: rgba(110, 118, 129, 0.4);
  }
  
  .markdown-preview :deep(table th) {
    background-color: #161b22;
    border-color: #3d444d;
  }
  
  .markdown-preview :deep(table td) {
    border-color: #3d444d;
  }
  
  .markdown-preview :deep(hr) {
    background-color: #21262d;
  }
  
  /* 暗色模式下的代码块样式 */
  .markdown-preview :deep(.code-block .hljs) {
    background: #0d1117 !important;
  }
  
  .markdown-preview :deep(.code-header) {
    background: #161b22;
    color: #f0f6fc;
  }
  
  .markdown-preview :deep(.line-numbers) {
    background: #21262d;
    color: #8b949e;
    border-right-color: #30363d;
  }
  
  .markdown-preview :deep(.code-container) {
    background: #0d1117;
  }
}
</style>