import { Mark, MarkType } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { useEffect, useState } from "react"

export interface EditorStatus {
	isBold: boolean
	isItalic: boolean
	isCode: boolean
	// ...可扩展
}

export function useEditorStatus(editorView: EditorView | null): EditorStatus {
	const [status, setStatus] = useState<EditorStatus>({
		isBold: false,
		isItalic: false,
		isCode: false
	})

	useEffect(() => {
		if (!editorView) return
		function markActive(state: EditorState, type: Mark | MarkType) {
			const { from, $from, to, empty } = state.selection
			if (empty) return !!type.isInSet(state.storedMarks || $from.marks())
			return state.doc.rangeHasMark(from, to, type)
		}

		const update = () => {
			const state = editorView.state
			setStatus({
				isBold: markActive(state, state.schema.marks.strong),
				isItalic: markActive(state, state.schema.marks.em),
				isCode: markActive(state, state.schema.marks.code)
			})
		}

		// 监听 selection/content 变化
		const oldDispatch = editorView.dispatch
		editorView.dispatch = (tr) => {
			oldDispatch.call(editorView, tr)
			update()
		}

		// 初始化时也触发一次
		update()

		// 清理
		return () => {
			editorView.dispatch = oldDispatch
		}
	}, [editorView])

	return status
}
