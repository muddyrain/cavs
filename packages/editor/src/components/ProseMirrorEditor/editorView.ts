import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { ImageNodeViewFactory } from "../ImageNodeView"

export const createEditorView = (containerRef: HTMLDivElement, editorState: EditorState) => {
	return new EditorView(containerRef, {
		state: editorState,
		nodeViews: {
			image: ImageNodeViewFactory
		}
	})
}
