import { exampleSetup } from "prosemirror-example-setup"
import { DOMParser, Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { useEffect, useRef } from "react"
import "./index.less"

export const ProseMirrorEditor = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const editorViewRef = useRef<EditorView | null>(null)
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
			editorViewRef.current = new EditorView(containerRef.current, {
				state: EditorState.create({
					doc: DOMParser.fromSchema(schemaWithLists).parse(containerRef.current),
					plugins: exampleSetup({ schema: schemaWithLists, menuBar: false })
				})
			})
		}
	}, [])

	return <div className="prosemirror-editor" ref={containerRef}></div>
}
