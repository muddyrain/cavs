import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { useMemo } from "react"
import "@/styles/index.less"
import { Button } from "@cavs/ui"

export const TiptapEditor = () => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3]
				}
			})
		],
		content:
			"<p>这是一个 Tiptap 编辑器示例。</p><p>你可以在这里输入内容，并使用工具栏进行格式化。</p>"
	})

	// Memoize the provider value to avoid unnecessary re-renders
	const providerValue = useMemo(() => ({ editor }), [editor])

	return (
		<EditorContext.Provider value={providerValue}>
			<div className="tiptap-wrapper">
				<EditorContent editor={editor} />
				<BubbleMenu editor={editor}>
					<div className="flex gap-x-3">
						<Button
							onClick={() => {
								editor.chain().focus().toggleBold().run()
							}}
						>
							加粗
						</Button>
					</div>
				</BubbleMenu>
			</div>
		</EditorContext.Provider>
	)
}
