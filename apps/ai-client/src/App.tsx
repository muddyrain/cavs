import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	ScrollArea,
	Separator
} from "@cavs/ui"
import {
	Bot,
	Copy,
	Loader2,
	MessageSquare,
	Send,
	Sparkles,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	User
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Message {
	id: string
	role: "user" | "assistant"
	content: string
	timestamp: Date
	isStreaming?: boolean
}
// 添加历史会话接口
interface HistorySession {
	role: "user" | "assistant"
	content: string
}
function App() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			role: "assistant",
			content: "你好！我是你的AI助手，有什么可以帮助你的吗？",
			timestamp: new Date()
		}
	])
	const [input, setInput] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [showHistoryDialog, setShowHistoryDialog] = useState(false)
	const [historyLoading, setHistoryLoading] = useState(false)
	const [historySessions, setHistorySessions] = useState<HistorySession[]>([])
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
			if (scrollElement) {
				scrollElement.scrollTop = scrollElement.scrollHeight
			}
		}
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])
	const handleSend = async () => {
		const question = input.trim()
		if (!question || isLoading) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: question,
			timestamp: new Date()
		}

		setMessages((prev) => [...prev, userMessage])
		setInput("")
		setIsLoading(true)

		// 3. 发送请求到代理服务器
		const res = await fetch("/api/ask", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ question })
		})
		const reader = await res.body?.getReader()
		if (!reader) {
			setIsLoading(false)
			console.error("无法读取响应体")
			return
		}

		const decoder = new TextDecoder("utf-8")
		let botMessage = ""
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			// 这里假设服务器发送的是文本数据
			const chunk = decoder.decode(value)
			const lines = chunk.split("\n").filter((line) => line.trim())
			setIsLoading(false)
			for (const line of lines) {
				try {
					if (line) {
						// 只要开始有数据就关掉加载状态
						botMessage += line
						// 实时更新消息内容
						setMessages((prev) => {
							// 检查是否已经有一个正在流式传输的消息
							const lastMessage = prev[prev.length - 1]
							if (lastMessage && lastMessage.role === "assistant" && lastMessage.isStreaming) {
								// 更新现有的消息
								const updatedMessages = [...prev]
								updatedMessages[updatedMessages.length - 1] = {
									...lastMessage,
									content: botMessage
								}
								return updatedMessages
							} else {
								// 添加一个新的流式传输消息
								return [
									...prev,
									{
										id: Date.now().toString(),
										role: "assistant",
										content: botMessage,
										timestamp: new Date(),
										isStreaming: true
									}
								]
							}
						})
					}
				} catch (error) {
					console.error("解析数据出错:", error)
				}
			}
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
	}

	const showHistory = async () => {
		try {
			setHistoryLoading(true)
			const response = await fetch("/api/history", {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			})
			setShowHistoryDialog(true)
			if (response.ok) {
				const data = await response.json()
				setHistorySessions(data.conversations || [])
			}
		} catch (error) {
			console.error("Error fetching history:", error)
		} finally {
			setHistoryLoading(false)
		}
	}

	const clearHistory = async () => {
		if (!confirm("确定要清除历史记录吗？")) {
			return
		}
		try {
			const response = await fetch("/api/clear", {
				method: "POST",
				headers: { "Content-Type": "application/json" }
			})
			if (response.ok) {
				alert("历史记录已清除")
				setMessages([])
			} else {
				alert("请稍后再试")
			}
		} catch {
			alert("清除失败，请检查网络连接")
		}
	}

	return (
		<div className="h-screen flex flex-col bg-background">
			{/* Header */}
			<div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
				<div className="flex h-14 items-center justify-between px-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
							<Sparkles className="w-4 h-4 text-white" />
						</div>
						<div>
							<h1 className="font-semibold text-sm">AI 助手</h1>
							<p className="text-xs text-muted-foreground">智能对话助手</p>
						</div>
					</div>
					<Badge variant="secondary" className="text-xs">
						在线
					</Badge>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-hidden">
				<ScrollArea ref={scrollAreaRef} className="h-full">
					<div className="p-4 space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={cn(
									"flex gap-3 group",
									message.role === "user" ? "justify-end" : "justify-start"
								)}
							>
								{message.role === "assistant" && (
									<Avatar className="w-8 h-8 shrink-0">
										<AvatarImage src="/ai-avatar.png" />
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
											<Bot className="w-4 h-4" />
										</AvatarFallback>
									</Avatar>
								)}

								<div
									className={cn("max-w-[70%] space-y-2", message.role === "user" && "order-first")}
								>
									<Card
										className={cn(
											"shadow-sm transition-all duration-200 py-0",
											message.role === "user"
												? "bg-primary text-primary-foreground ml-auto"
												: "bg-card hover:shadow-md"
										)}
									>
										<CardContent className="p-3">
											<p className="text-sm leading-relaxed whitespace-pre-wrap">
												{message.content}
											</p>
										</CardContent>
									</Card>

									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span>{message.timestamp.toLocaleTimeString()}</span>
										{message.role === "assistant" && (
											<div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
												<Button
													variant="ghost"
													size="sm"
													className="h-6 w-6 p-0"
													onClick={() => copyToClipboard(message.content)}
												>
													<Copy className="w-3 h-3" />
												</Button>
												<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
													<ThumbsUp className="w-3 h-3" />
												</Button>
												<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
													<ThumbsDown className="w-3 h-3" />
												</Button>
											</div>
										)}
									</div>
								</div>

								{message.role === "user" && (
									<Avatar className="w-8 h-8 shrink-0">
										<AvatarImage src="/user-avatar.png" />
										<AvatarFallback className="bg-muted text-muted-foreground text-xs">
											<User className="w-4 h-4" />
										</AvatarFallback>
									</Avatar>
								)}
							</div>
						))}

						{/* Loading indicator */}
						{isLoading && (
							<div className="flex gap-3 group">
								<Avatar className="w-8 h-8 shrink-0">
									<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
										<Bot className="w-4 h-4" />
									</AvatarFallback>
								</Avatar>
								<Card className="bg-card shadow-sm">
									<CardContent className="p-3">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Loader2 className="w-4 h-4 animate-spin" />
											AI正在思考中...
										</div>
									</CardContent>
								</Card>
							</div>
						)}
					</div>
				</ScrollArea>
			</div>

			<Separator />

			{/* Input Area */}
			<div className="p-4 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
				<div className="flex gap-2 items-end">
					<div className="flex-1 relative">
						<Input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
							className="min-h-[44px] pr-12 resize-none"
							disabled={isLoading}
						/>
					</div>
					<Button
						onClick={handleSend}
						disabled={!input.trim() || isLoading}
						size="default"
						className="h-[44px] px-4"
					>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</div>

				{/* Quick actions */}
				<div className="flex gap-2 mt-3">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							showHistory()
						}}
						disabled={isLoading}
					>
						查看历史
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							clearHistory()
						}}
						disabled={isLoading}
					>
						清除历史
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setInput("帮我写一段代码")}
						disabled={isLoading}
					>
						代码助手
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setInput("帮我分析这个问题")}
						disabled={isLoading}
					>
						问题分析
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setInput("用简单的话解释一下")}
						disabled={isLoading}
					>
						简单解释
					</Button>
				</div>
			</div>

			{/* 历史记录弹框 */}
			<Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
				<DialogContent className="max-w-2xl max-h-[80vh]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<MessageSquare className="w-5 h-5" />
							历史记录
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col gap-4">
						{historyLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin mr-2" />
								<span className="text-muted-foreground">加载历史记录中...</span>
							</div>
						) : (
							<ScrollArea className="h-[400px] pr-4">
								<div className="space-y-3">
									{historySessions.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											<MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
											<p>暂无历史记录</p>
										</div>
									) : (
										historySessions.map((session, index) => (
											<Card
												key={index}
												className="transition-all duration-200 hover:shadow-md cursor-pointer group"
											>
												<CardContent className="p-4">
													<div className="flex items-start justify-between gap-3">
														<div className="flex-1 space-y-2">
															<div className="flex items-center gap-2">
																{session.role === "user" ? (
																	<User className="w-4 h-4 text-muted-foreground" />
																) : (
																	<Bot className="w-4 h-4 text-blue-500" />
																)}
																<Badge
																	variant={session.role === "user" ? "default" : "secondary"}
																	className="text-xs"
																>
																	{session.role === "user" ? "用户" : "AI助手"}
																</Badge>
															</div>
															<p className="text-sm text-foreground line-clamp-3 leading-relaxed">
																{session.content}
															</p>
														</div>
														<Button
															variant="ghost"
															size="sm"
															className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
															onClick={(e) => {
																e.stopPropagation()
															}}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</CardContent>
											</Card>
										))
									)}
								</div>
							</ScrollArea>
						)}

						<div className="flex justify-between items-center pt-2 border-t">
							<p className="text-sm text-muted-foreground">共 {historySessions.length} 个会话</p>
							<div className="flex gap-2">
								<Button variant="default" size="sm" onClick={() => setShowHistoryDialog(false)}>
									关闭
								</Button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default App
