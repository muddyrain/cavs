import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { useMemo } from "react"
import "@/styles/index.less"
import { Button } from "@cavs/ui"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCaret from "@tiptap/extension-collaboration-caret"
import { WebsocketProvider } from "y-websocket"
import * as Y from "yjs"
import { getInitialUser } from "@/utils/getInitialUser"

const roomName = "tiptap-editor-room"
const ydoc = new Y.Doc()
const provider = new WebsocketProvider("ws://localhost:1234", roomName, ydoc)

export const TiptapEditor = () => {
	const editor = useEditor({
		enableContentCheck: true,
		onContentError: ({ disableCollaboration }) => {
			disableCollaboration()
		},
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3]
				}
			}),
			Collaboration.configure({
				document: ydoc
			}),
			CollaborationCaret.configure({
				provider,
				user: getInitialUser()
			})
		]
	})
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
