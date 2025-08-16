import { EditorView } from "prosemirror-view"

export type AlignType = "left" | "center" | "right"

export interface ProseMirrorEditorCommandsType {
	focus: () => void
	bold: () => void
	italic: () => void
	underline: () => void
	strikethrough: () => void
	code: () => void
	textAlign: (align: AlignType) => void
	builletList: () => void
	orderedList: () => void
}

export interface EditorType {
	commands: ProseMirrorEditorCommandsType
	editorView: EditorView | null | undefined
}
