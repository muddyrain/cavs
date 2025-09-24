import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { useMemo } from "react"
import "@/styles/index.less"
import { Document } from "@/extensions/Document"
import { Paragraph } from "@/extensions/Paragraph"
import { Text } from "@/extensions/Text"

export const TiptapEditor = () => {
	const editor = useEditor({
		extensions: [
			Document,
			Text,
			Paragraph
			// StarterKit.configure({
			// 	heading: {
			// 		levels: [1, 2, 3]
			// 	}
			// })
		],
		content: {
			type: "document",
			content: [{ type: "paragraph", content: [{ type: "text", text: "Hello World!" }] }]
		}
	})

	// Memoize the provider value to avoid unnecessary re-renders
	const providerValue = useMemo(() => ({ editor }), [editor])

	return (
		<EditorContext.Provider value={providerValue}>
			<div className="tiptap-wrapper">
				<EditorContent editor={editor} />
				<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
			</div>
		</EditorContext.Provider>
	)
}
