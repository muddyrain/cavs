import { toggleMark } from "prosemirror-commands"
import { exampleSetup } from "prosemirror-example-setup"
import { DOMParser, Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import "./index.less"

export interface ProseMirrorEditorRef {
	focus: () => void
	bold: () => void
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
			const schemaWithLists = new Schema({
				nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
				marks: schema.spec.marks
			})
			const editorState = EditorState.create({
				doc: DOMParser.fromSchema(schemaWithLists).parse(containerRef.current),
				plugins: exampleSetup({ schema: schemaWithLists, menuBar: false })
			})
			editorViewRef.current = new EditorView(containerRef.current, {
				state: editorState
			})
		}
	}, [])

	return <div className="prosemirror-editor" ref={containerRef}></div>
})
