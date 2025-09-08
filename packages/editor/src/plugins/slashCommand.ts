import { Plugin } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { CoordsType } from "@/types"

export function slashCommandPlugin(
	onSlash: (view: EditorView, coords: CoordsType) => void,
	onClose?: () => void
): Plugin {
	return new Plugin({
		props: {
			handleTextInput(view: EditorView, _: number, __: number, text: string): boolean {
				if (text === "/") {
					const { state } = view
					const pos = state.selection.from
					const $pos = state.doc.resolve(pos)
					const start = $pos.start()
					const beforeText = state.doc.textBetween(start, pos, undefined, "\0")
					// 只有在段落开头或前面没有其他字符时才触发
					if (beforeText.trim().length === 0) {
						const coords = view.coordsAtPos(pos)
						onSlash(view, coords)
					} else {
						onClose?.()
					}
				} else {
					onClose?.()
				}
				return false
			},
			handleDOMEvents: {
				keydown: (view: EditorView, event: KeyboardEvent): boolean => {
					// 回车、Esc、Tab、方向键等都关闭菜单
					if (
						event.key === "Enter" ||
						event.key === "Escape" ||
						event.key === "Tab" ||
						event.key === "ArrowUp" ||
						event.key === "ArrowDown"
					) {
						onClose?.()
					}
					// 换行（Shift+Enter 或直接输入 \n）
					if (event.key === "Enter" && !event.shiftKey) {
						onClose?.()
					}
					// 监听删除斜杠
					if (event.key === "Backspace" || event.key === "Delete") {
						const { state } = view
						const pos = state.selection.from
						const doc = state.doc

						const prevChar = pos > 1 ? doc.textBetween(pos - 1, pos) : ""
						if (prevChar === "/") {
							onClose?.()
						}
					}

					return false
				}
			}
		}
	})
}
