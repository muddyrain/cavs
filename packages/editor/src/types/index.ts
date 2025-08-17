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
	bulletList: () => void
	orderedList: () => void
	blockquote: () => void
	image: () => void
}

export interface EditorType {
	commands: ProseMirrorEditorCommandsType
	editorView: EditorView | null | undefined
}

export interface CoordsType {
	left: number
	right: number
	top: number
	bottom: number
}
