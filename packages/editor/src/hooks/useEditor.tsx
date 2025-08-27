import { toast } from "@cavs/ui"
import { setBlockType, toggleMark } from "prosemirror-commands"
import { wrapInList } from "prosemirror-schema-list"
import { EditorView } from "prosemirror-view"
import { useMemo, useRef, useState } from "react"
import { SYMBOL_SET_EDITOR_VIEW } from "@/constant/symbol"
import { schema } from "@/schemas"
import { AlignType, EditorType, ProseMirrorEditorCommandsType } from "@/types"

export const useEditor = (_editor?: EditorType): EditorType => {
	if (_editor) {
		// 如果传入了 editor，则直接返回
		return _editor
	}
	const [editorView, setEditorView] = useState<EditorView | null>(null)
	const inputFileRef = useRef<HTMLInputElement>(null)
	const commands = useMemo(() => {
		return {
			editorView,
			focus: () => {
				if (editorView?.hasFocus()) {
					return // 如果已经有焦点，则不需要再次设置焦点
				}
				editorView?.focus()
			},
			bold: () => {
				if (!editorView) return
				toggleMark(schema.marks.strong)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			italic: () => {
				if (!editorView) return
				toggleMark(schema.marks.em)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			underline: () => {
				if (!editorView) return
				toggleMark(schema.marks.underline)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			strikethrough: () => {
				if (!editorView) return
				toggleMark(schema.marks.strikethrough)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			code: () => {
				if (!editorView) return
				toggleMark(schema.marks.code)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			textAlign: (align: AlignType) => {
				if (!editorView) return
				const { state, dispatch } = editorView
				const type = state.schema.nodes.paragraph
				// 设置段落对齐方式
				if (type) {
					setBlockType(type, { align })(state, dispatch)
					editorView.focus()
				}
			},
			bulletList: () => {
				if (!editorView) return
				wrapInList(schema.nodes.bullet_list)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			orderedList: () => {
				if (!editorView) return
				wrapInList(schema.nodes.ordered_list)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			blockquote: () => {
				if (!editorView) return
				wrapInList(schema.nodes.blockquote)(editorView.state, editorView.dispatch)
				editorView.focus()
			},
			image: () => {
				if (!editorView) return
				if (!inputFileRef.current) return
				inputFileRef.current.click()
				inputFileRef.current.onchange = (e) => {
					const target = e.target as HTMLInputElement
					for (const file of inputFileRef.current?.files || []) {
						// 校验文件类型
						if (!/image\/(png|jpg|jpeg|gif)/.test(file.type)) {
							toast.info("只支持上传图片文件")
							return
						}
						const reader = new FileReader()
						reader.readAsDataURL(file)
						reader.onload = () => {
							const src = reader.result as string
							const node = editorView.state.schema.nodes.image.create({
								src,
								alt: file.name,
								title: file.name
							})
							const tr = editorView.state.tr.replaceSelectionWith(node, false)
							editorView.dispatch(tr)
							editorView.focus()
						}
					}
					// 上传后清空文件列表，避免无法上传同一张图片
					if (inputFileRef.current) {
						inputFileRef.current.files = null
						target.value = ""
					}
				}
			}
		} as ProseMirrorEditorCommandsType
	}, [editorView])

	const editorInstance = {
		commands,
		editorView,
		inputFileRef,
		[SYMBOL_SET_EDITOR_VIEW]: setEditorView
	}
	return editorInstance as EditorType & {
		[SYMBOL_SET_EDITOR_VIEW]: (view: EditorView | null) => void
	}
}
