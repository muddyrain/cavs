import { toggleMark } from "prosemirror-commands"
import { exampleSetup } from "prosemirror-example-setup"
import { keymap } from "prosemirror-keymap"
import { DOMParser } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { FC, useEffect, useRef } from "react"
import { schema } from "@/schemas"
import "./index.less"
import { SYMBOL_SET_EDITOR_VIEW } from "@/constant/symbol"
import { useEditor } from "@/hooks/useEditor"
import { EditorType, ProseMirrorEditorCommandsType } from "@/types"

export type ProseMirrorEditorRef = ProseMirrorEditorCommandsType

type _EditorType = EditorType & {
	[SYMBOL_SET_EDITOR_VIEW]: (view: EditorView | null) => void
}
export const ProseMirrorEditor: FC<{
	editor?: EditorType
}> = (props) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const innerEditorRef = useRef<EditorView | null>(null)
	const editor = useEditor(props.editor)
	useEffect(() => {
		// 确保容器存在
		if (innerEditorRef.current) {
			innerEditorRef.current.destroy()
			;(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](null)
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
			innerEditorRef.current = new EditorView(containerRef.current, {
				state: editorState
			})
			;(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](innerEditorRef.current)
		}
		return () => {
			innerEditorRef.current?.destroy()
			// 清理
			if ((editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW])
				(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](null)
		}
	}, [])

	return <div className="prosemirror-editor" ref={containerRef}></div>
}
