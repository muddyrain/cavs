import "@cavs/editor-shadcn/style.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home"
import LoginPage from "./pages/login"

function App() {
	return (
		<div className="h-screen flex flex-col bg-background">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
