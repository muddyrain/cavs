import "@cavs/editor-shadcn/style.css"
import { DocEditor } from "./pages/Doc/DocEditor"

function App() {
	return (
		<div className="h-screen flex flex-col bg-background">
			<DocEditor />
		</div>
	)
}

export default App
