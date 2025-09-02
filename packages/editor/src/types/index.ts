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
	inputFileRef: React.RefObject<HTMLInputElement>
}

export interface CoordsType {
	left: number
	right: number
	top: number
	bottom: number
}

export type SlashMenuItem = {
	label: string
	key: string
	children: SlashMenuButtonItem[]
}
export type SlashMenuButtonItem = {
	label: string
	key: string
	icon?: React.ReactNode
	action?: (view: EditorView) => void
}
