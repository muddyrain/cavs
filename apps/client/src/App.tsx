import { useCreateBlockNote } from "@cavs/editor-react"
import { BlockNoteView } from "@cavs/editor-shadcn"
import "@cavs/editor-shadcn/style.css"
import { zh } from "@cavs/editor-core/locales"

function App() {
	const editor = useCreateBlockNote({
		dictionary: zh
	})
	return (
		<div className="h-screen flex flex-col bg-background">
			<BlockNoteView editor={editor} />
		</div>
	)
}

export default App
