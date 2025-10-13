import "@cavs/editor-shadcn/style.css"
import { DocEditor } from "./pages/Doc/DocEditor"
import { DocGraph } from "./pages/DocGraph"

function App() {
	return (
		<div className="h-screen flex flex-col bg-background">
			{/* <DocEditor /> */}
			<DocGraph />
		</div>
	)
}

export default App
