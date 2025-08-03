import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Main } from "./components/Main"

function App() {
	return (
		<div className="h-screen flex flex-col bg-background">
			{/* 顶部工具栏 */}
			<Header />
			{/* 主内容区域 */}
			<Main />
			{/* 底部状态栏 */}
			<Footer />
		</div>
	)
}

export default App
