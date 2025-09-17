import { toast } from "@cavs/ui"
import { setBlockType, toggleMark } from "prosemirror-commands"
import { wrapInList } from "prosemirror-schema-list"
import { EditorView } from "prosemirror-view"
import { useCallback, useMemo, useRef, useState } from "react"
import { SYMBOL_SET_EDITOR_VIEW } from "@/constant/symbol"
import { schema } from "@/schemas"
import { EditorType, ProseMirrorEditorCommandsType } from "@/types"

export const useEditor = (_editor?: EditorType): EditorType => {
	if (_editor) {
		// 如果传入了 editor，则直接返回
		return _editor
	}
	const [editorView, setEditorView] = useState<EditorView | null>(null)
	const inputFileRef = useRef<HTMLInputElement>(null)
	const editorFocus = useCallback(
		(duration?: number) => {
			if (editorView?.hasFocus()) {
				return // 如果已经有焦点，则不需要再次设置焦点
			}
			if (duration) {
				setTimeout(() => {
					editorView?.focus()
				}, duration)
			} else {
				editorView?.focus()
			}
		},
		[editorView]
	)
	const clearCurrentLineContent = useCallback(() => {
		if (!editorView) return
		const { state, dispatch } = editorView
		const { $from, $to } = state.selection
		const tr = state.tr.delete($from.start(), $to.end())
		dispatch(tr)
		editorFocus()
	}, [editorView, editorFocus])
	const commands: ProseMirrorEditorCommandsType = useMemo(() => {
		return {
			editorView,
			focus: () => {
				if (editorView?.hasFocus()) {
					return // 如果已经有焦点，则不需要再次设置焦点
				}
				editorFocus()
			},
			bold: () => {
				if (!editorView) return
				toggleMark(schema.marks.strong)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			italic: () => {
				if (!editorView) return
				toggleMark(schema.marks.em)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			underline: () => {
				if (!editorView) return
				toggleMark(schema.marks.underline)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			strikethrough: () => {
				if (!editorView) return
				toggleMark(schema.marks.strikethrough)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			code: () => {
				if (!editorView) return
				toggleMark(schema.marks.code)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			textAlign: (align) => {
				if (!editorView) return
				const { state, dispatch } = editorView
				const type = state.schema.nodes.paragraph
				// 设置段落对齐方式
				if (type) {
					setBlockType(type, { align })(state, dispatch)
					editorFocus()
				}
			},
			bulletList: () => {
				if (!editorView) return
				wrapInList(schema.nodes.bullet_list)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			orderedList: () => {
				if (!editorView) return
				wrapInList(schema.nodes.ordered_list)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			blockquote: () => {
				if (!editorView) return
				wrapInList(schema.nodes.blockquote)(editorView.state, editorView.dispatch)
				editorFocus()
			},
			paragraph: () => {
				if (!editorView) return
				const type = schema.nodes.paragraph
				if (type) {
					setBlockType(type)(editorView.state, editorView.dispatch)
					editorFocus(100) // 这里延迟200ms，避免和菜单的关闭冲突
				}
			},
			heading: (level) => {
				if (!editorView) return
				const type = schema.nodes.heading
				if (type) {
					setBlockType(type, { level })(editorView.state, editorView.dispatch)
					editorFocus(100) // 这里延迟200ms，避免和菜单的关闭冲突
				}
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
						}
					}
					// 上传后清空文件列表，避免无法上传同一张图片
					if (inputFileRef.current) {
						inputFileRef.current.files = null
						target.value = ""
					}
				}
			}
		}
	}, [editorView, editorFocus])

	const editorInstance = {
		commands,
		editorView,
		inputFileRef,
		clearCurrentLineContent,
		[SYMBOL_SET_EDITOR_VIEW]: setEditorView
	}
	return editorInstance as EditorType & {
		[SYMBOL_SET_EDITOR_VIEW]: (view: EditorView | null) => void
	}
}
