import { toggleMark } from "prosemirror-commands"
import { exampleSetup } from "prosemirror-example-setup"
import { keymap } from "prosemirror-keymap"
import { DOMParser } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { schema } from "@/schemas"
import "./index.less"

export interface ProseMirrorEditorRef {
	focus: () => void
	bold: () => void
	italic: () => void
	underline: () => void
	strikethrough: () => void
	code: () => void
}

export const ProseMirrorEditor = forwardRef<ProseMirrorEditorRef, {}>((_, ref) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const editorViewRef = useRef<EditorView | null>(null)
	useImperativeHandle(ref, () => {
		const commands = {
			focus: () => {
				if (editorViewRef.current?.hasFocus()) {
					return // 如果已经有焦点，则不需要再次设置焦点
				}
				editorViewRef.current?.focus()
			},
			cancelSelection: () => {
				console.log("取消选中")
			},
			bold: () => {
				const editorView = editorViewRef.current!
				const applyBold = toggleMark(schema.marks.strong)
				applyBold(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			italic: () => {
				const editorView = editorViewRef.current!
				const applyItalic = toggleMark(schema.marks.em)
				applyItalic(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			underline: () => {
				const editorView = editorViewRef.current!
				const applyUnderline = toggleMark(schema.marks.underline)
				applyUnderline(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			strikethrough: () => {
				const editorView = editorViewRef.current!
				const applyStrikethrough = toggleMark(schema.marks.strikethrough)
				applyStrikethrough(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			code: () => {
				const editorView = editorViewRef.current!
				const applyCode = toggleMark(schema.marks.code)
				applyCode(editorView.state, editorView.dispatch)
				editorView.focus()
			}
		}
		return commands
	})

	useEffect(() => {
		// 确保容器存在
		if (editorViewRef.current) {
			editorViewRef.current.destroy()
		}
		// 创建 ProseMirror 编辑器实例
		if (containerRef.current) {
			// 绑定快捷键
			const keymapPlugins = keymap({
				"Mod-b": toggleMark(schema.marks.strong), // Ctrl/Cmd + B 加粗
				"Mod-i": toggleMark(schema.marks.em), // Ctrl/Cmd + I 斜体
				"Mod-u": toggleMark(schema.marks.underline), // Ctrl/Cmd + U 下划线
				"Mod-Shift-x": toggleMark(schema.marks.strikethrough), // Ctrl/Cmd + Shift + X 删除线
				"Mod-Shift-c": toggleMark(schema.marks.code) // Ctrl/Cmd + Shift + C 代码
			})

			const editorState = EditorState.create({
				doc: DOMParser.fromSchema(schema).parse(containerRef.current),
				plugins: [...exampleSetup({ schema, menuBar: false }), keymapPlugins]
			})
			editorViewRef.current = new EditorView(containerRef.current, {
				state: editorState
			})
		}
	}, [])

	return <div className="prosemirror-editor" ref={containerRef}></div>
})
