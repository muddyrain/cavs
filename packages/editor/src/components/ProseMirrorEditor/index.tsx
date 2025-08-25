import { DOMParser } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { FC, useEffect, useRef, useState } from "react"
import { schema } from "@/schemas"
import "./index.less"
import { Toaster } from "@cavs/ui"
import { SYMBOL_SET_EDITOR_VIEW } from "@/constant/symbol"
import { useEditor } from "@/hooks/useEditor"
import { plugins } from "@/plugins"
import { slashCommandPlugin } from "@/plugins/slashCommand"
import { CoordsType, EditorType, ProseMirrorEditorCommandsType } from "@/types"
import { SlashMenu } from "../SlashMenu"
import { createEditorView } from "./editorView"

export type ProseMirrorEditorRef = ProseMirrorEditorCommandsType

type _EditorType = EditorType & {
	[SYMBOL_SET_EDITOR_VIEW]: (view: EditorView | null) => void
}
export const ProseMirrorEditor: FC<{
	editor?: EditorType
}> = (props) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const innerEditorRef = useRef<EditorView | null>(null)
	const [menuCoords, setMenuCoords] = useState<CoordsType>({ left: 0, right: 0, top: 0, bottom: 0 })
	const [slashMenuVisible, setSlashMenuVisible] = useState(false)

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
				plugins: [
					...plugins,
					slashCommandPlugin(
						(_, coords) => {
							setSlashMenuVisible(true)
							setMenuCoords(coords)
						},
						() => {
							setSlashMenuVisible(false)
						}
					)
				]
			})
			innerEditorRef.current = createEditorView(containerRef.current, editorState)
			;(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](innerEditorRef.current)
		}
		return () => {
			innerEditorRef.current?.destroy()
			if ((editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW])
				(editor as _EditorType)[SYMBOL_SET_EDITOR_VIEW](null)
		}
	}, [])

	return (
		<div className="relative">
			<div className="prosemirror-editor" ref={containerRef}></div>
			{slashMenuVisible && (
				<SlashMenu
					coords={menuCoords}
					items={[
						{
							label: "测试",
							value: "test",
							icon: "icon"
						}
					]}
					onSelect={() => {
						console.log(1)
					}}
				/>
			)}
			<input
				className="hidden"
				type="file"
				name="file"
				accept=".png,.jpg,.jpeg,.gif"
				id="prosemirror-editor-input-file"
				ref={editor.inputFileRef}
			/>
			<Toaster position="top-center" />
		</div>
	)
}
