<template>
  <div class="code-editor-container" ref="editorContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { defaultKeymap } from '@codemirror/commands'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const editorContainer = ref(null)
let editorView = null

// 创建编辑器扩展
const createExtensions = () => {
  return [
    lineNumbers(),
    json(),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': {
        fontSize: '14px',
        backgroundColor: 'var(--editor-bg, #f8f9fa)',
        color: 'var(--editor-text, #24292e)',
        height: '100%',
        borderRadius: '8px'
      },
      '.cm-content': {
        padding: '12px 0',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
      },
      '.cm-lineNumbers': {
        fontSize: '14px',
        color: 'var(--line-numbers, #6a737d)',
        paddingRight: '8px'
      },
      '.cm-gutters': {
        backgroundColor: 'var(--gutter-bg, #f6f8fa)',
        borderRight: '1px solid var(--gutter-border, #e1e4e8)'
      },
      '.cm-activeLine': {
        backgroundColor: 'var(--active-line-bg, #f3f4f6)'
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--active-gutter-bg, #e5e7eb)'
      }
    }),
    keymap.of(defaultKeymap),
    EditorState.readOnly.of(props.readOnly),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const value = update.state.doc.toString()
        emit('update:modelValue', value)
        emit('change', value)
      }
    })
  ]
}

// 初始化编辑器
const initEditor = () => {
  if (!editorContainer.value) return

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: createExtensions()
  })

  editorView = new EditorView({
    state,
    parent: editorContainer.value
  })
}

// 销毁编辑器
const destroyEditor = () => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
}

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (editorView && newValue !== editorView.state.doc.toString()) {
    const transaction = editorView.state.update({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newValue
      }
    })
    editorView.dispatch(transaction)
  }
})

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  destroyEditor()
})
</script>

<style scoped>
.code-editor-container {
  height: 100%;
  min-height: 200px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-scroller) {
  overflow: auto;
}

/* 暗色主题支持 */
.dark :deep(.cm-editor) {
  --editor-bg: #1f2937;
  --editor-text: #f9fafb;
  --line-numbers: #9ca3af;
  --gutter-bg: #374151;
  --gutter-border: #4b5563;
  --active-line-bg: #374151;
  --active-gutter-bg: #4b5563;
}

.light :deep(.cm-editor) {
  --editor-bg: #f8f9fa;
  --editor-text: #24292e;
  --line-numbers: #6a737d;
  --gutter-bg: #f6f8fa;
  --gutter-border: #e1e4e8;
  --active-line-bg: #f3f4f6;
  --active-gutter-bg: #e5e7eb;
}
</style>