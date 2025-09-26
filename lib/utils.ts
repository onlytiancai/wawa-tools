import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EditorView } from '@codemirror/view'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 暗黑模式行号样式
export const darkLineNumberTheme = EditorView.theme({
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#888',
    border: 'none',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    color: '#666',
  },
}, { dark: true })

// 亮色模式行号样式
export const lightLineNumberTheme = EditorView.theme({
  '.cm-gutters': {
    backgroundColor: '#ffffff',
    color: '#999',
    border: 'none',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    color: '#bbb',
  },
}, { dark: false })
