/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "@/styles/index.less"
import { Button } from "@cavs/ui"
import { IndexeddbPersistence } from "y-indexeddb"
import { WebsocketProvider } from "y-websocket"
import * as Y from "yjs"

const ydoc = new Y.Doc()
const provider = new WebsocketProvider("ws://localhost:1234", "tiptap-editor", ydoc)
// 生成随机颜色
const userColor = `#${Math.floor(Math.random() * 0xffffff)
	.toString(16)
	.padStart(6, "0")}`
// 生成随机用户名
const userName = `用户-${Math.floor(Math.random() * 1000)}`
provider.awareness.setLocalStateField("user", {
	name: userName,
	color: userColor
})
// 防抖函数
function debounce<T extends any[]>(func: (...args: T) => void, wait: number) {
	let timeout: ReturnType<typeof setTimeout> | null = null
	return (...args: T) => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			func(...args)
		}, wait)
	}
}

export const TiptapEditor = () => {
	// 引用共享文本对象
	const ytextRef = useRef<Y.Text>(null)
	// 本地存储引用
	const persistenceRef = useRef<IndexeddbPersistence>(null)
	const isUpdatingFromYDoc = useRef(false) // 防止循环更新
	const debouncedUpdate = useCallback(
		debounce((value: string) => {
			if (ytextRef.current) {
				if (isUpdatingFromYDoc.current) return // 防止循环
				ytextRef.current.delete(0, ytextRef.current.length)
				ytextRef.current.insert(0, value)
			}
		}, 300),
		[]
	)
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3]
				}
			})
		],
		content:
			"<p>这是一个 Tiptap 编辑器示例。</p><p>你可以在这里输入内容，并使用工具栏进行格式化。</p>",
		onUpdate: ({ editor }) => {
			// 当编辑器内容更新时，更新 Yjs 文档
			const html = editor.getHTML()
			debouncedUpdate(html)
		}
	})
	// Memoize the provider value to avoid unnecessary re-renders
	const providerValue = useMemo(() => ({ editor }), [editor])

	const [currentUser, setCurrentUser] = useState({ name: "", color: "" })
	const [remoteUsers, setRemoteUsers] = useState<Map<number, any>>(new Map())
	const [remoteCursors, setRemoteCursors] = useState<Map<number, any>>(new Map())

	useEffect(() => {
		const yText = ydoc.getText("tiptap")
		ytextRef.current = yText

		// 从 IndexedDB 加载持久化数据
		const persistence = new IndexeddbPersistence("tiptap-editor", ydoc)
		persistenceRef.current = persistence

		// 设置本地用户状态
		setCurrentUser(provider.awareness.getLocalState()?.user ?? { name: "", color: "" })

		// 监听远程用户状态变化
		const awarenessChangeHandler = () => {
			const states = provider.awareness.getStates()
			const users = new Map<number, any>()
			const cursors = new Map<number, any>()
			for (const [clientId, state] of states) {
				if (clientId === provider.awareness.clientID) {
					// 本地用户
					continue
				}
				users.set(clientId, state.user)
				cursors.set(clientId, state.cursor)
			}

			setRemoteUsers(users)
			setRemoteCursors(cursors)
		}
		provider.awareness.on("change", awarenessChangeHandler)

		// 本地同步
		persistence.whenSynced.then(() => {
			editor?.commands.setContent(yText.toString(), {
				emitUpdate: false
			}) // 不触发事件
		})

		const updateHandler = (update: Uint8Array, origin: any) => {
			if (isUpdatingFromYDoc.current) return
			isUpdatingFromYDoc.current = true
			editor?.commands.setContent(yText.toString(), {
				emitUpdate: false
			}) // 不触发事件
			isUpdatingFromYDoc.current = false
		}

		// 监听文档更新
		ydoc.on("update", updateHandler)

		return () => {
			provider.awareness.off("change", awarenessChangeHandler)
			ydoc.off("update", updateHandler)
		}
	}, [])

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			const { clientX, clientY } = event
			provider.awareness.setLocalStateField("cursor", {
				x: clientX,
				y: clientY,
				windowSize: {
					width: window.innerWidth,
					height: window.innerHeight
				}
			})
		}
		document.addEventListener("mousemove", handleMouseMove)
		return () => {
			document.removeEventListener("mousemove", handleMouseMove)
		}
	}, [])

	// 鼠标映射到当前窗口的位置处理
	const getCursorPosition = (cursor: any) => {
		if (!cursor || !cursor.windowSize) return { x: 0, y: 0 }
		const cursorX = (cursor.x / cursor.windowSize.width) * window.innerWidth
		const cursorY = (cursor.y / cursor.windowSize.height) * window.innerHeight
		return { cursorX, cursorY }
	}

	return (
		<EditorContext.Provider value={providerValue}>
			<h3>
				当前用户：
				<span
					style={{
						color: currentUser.color,
						fontWeight: "bold"
					}}
				>
					{currentUser.name}
				</span>
			</h3>
			<div className="my-4">
				远程用户：
				{Array.from(remoteUsers).map(([clientId, user]) => (
					<span key={clientId} style={{ color: user.color, marginRight: 8 }}>
						{user.name}
					</span>
				))}
			</div>
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
			{/* 渲染远程光标 */}
			{Array.from(remoteCursors).map(([clientId, cursor]) => {
				const { cursorX, cursorY } = getCursorPosition(cursor)
				const user = remoteUsers.get(clientId)
				return (
					<div
						key={clientId}
						style={{
							position: "absolute",
							left: cursorX,
							top: cursorY,
							zIndex: 1000,
							transform: "translate(-50%, -100%)",
							pointerEvents: "none"
						}}
					>
						<div className="py-1 px-2" style={{ backgroundColor: user.color, color: "#fff" }}>
							{user.name}
						</div>
						<div
							style={{
								width: 2,
								height: 10,
								backgroundColor: user.color
							}}
						></div>
					</div>
				)
			})}
		</EditorContext.Provider>
	)
}
