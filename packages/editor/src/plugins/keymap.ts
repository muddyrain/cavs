import { toggleMark } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { schema } from "@/schemas"
// 绑定快捷键
export const keymapPlugins = keymap({
	"Mod-b": toggleMark(schema.marks.strong), // Ctrl/Cmd + B 加粗
	"Mod-i": toggleMark(schema.marks.em), // Ctrl/Cmd + I 斜体
	"Mod-u": toggleMark(schema.marks.underline), // Ctrl/Cmd + U 下划线
	"Mod-Shift-x": toggleMark(schema.marks.strikethrough), // Ctrl/Cmd + Shift + X 删除线
	"Mod-Shift-c": toggleMark(schema.marks.code) // Ctrl/Cmd + Shift + C 代码
})
