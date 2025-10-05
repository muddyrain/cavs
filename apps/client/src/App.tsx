import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { zh } from "@blocknote/core/locales"

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
