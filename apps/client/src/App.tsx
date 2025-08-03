import { ProseMirrorEditor } from "./components/ProseMirrorEditor"

function App() {
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
			<div className="mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
				<header className="p-4 border-b border-gray-200 dark:border-gray-700">
					<h1 className="text-2xl font-bold">My Notion-like Editor</h1>
				</header>
				<main className="p-4">
					<ProseMirrorEditor />
				</main>
			</div>
		</div>
	)
}

export default App
