import { DOMParser } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { FC, useEffect, useRef } from "react"
import { schema } from "@/schemas"
import "./index.less"
import { SYMBOL_SET_EDITOR_VIEW } from "@/constant/symbol"
import { useEditor } from "@/hooks/useEditor"
import { plugins } from "@/plugins"
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
			const editorState = EditorState.create({
				doc: DOMParser.fromSchema(schema).parse(containerRef.current),
				plugins
			})
			innerEditorRef.current = new EditorView(containerRef.current, {
				state: editorState
			})
			;(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](innerEditorRef.current)
		}
		return () => {
			innerEditorRef.current?.destroy()
			if ((editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW])
				(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](null)
		}
	}, [])

	return <div className="prosemirror-editor" ref={containerRef}></div>
}
