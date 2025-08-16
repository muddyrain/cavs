import { InputRule } from "prosemirror-inputrules"
import { MarkType } from "prosemirror-model"

// 匹配 ~~内容~~
export function strikethroughInputRule(markType: MarkType) {
	return new InputRule(/(?:~~)([^~]+)(?:~~)\s$/, (state, match, start, end) => {
		const [_, content] = match
		const tr = state.tr
		if (content) {
			tr.delete(start, end)
			tr.insertText(content, start)
			tr.addMark(start, start + content.length, markType.create())
		}
		return tr
	})
}

// 匹配 ~内容~~
export function underlineInputRule(markType: MarkType) {
	return new InputRule(/(?:~)([^~]+)(?:~)\s$/, (state, match, start, end) => {
		const [_, content] = match
		const tr = state.tr
		if (content) {
			tr.delete(start, end)
			tr.insertText(content, start)
			tr.addMark(start, start + content.length, markType.create())
		}
		return tr
	})
}

// 匹配 **内容**
export function boldInputRule(markType: MarkType) {
	return new InputRule(/(?:\*\*)([^*]+)(?:\*\*)\s$/, (state, match, start, end) => {
		const [_, content] = match
		const tr = state.tr
		if (content) {
			tr.delete(start, end)
			tr.insertText(content, start)
			tr.addMark(start, start + content.length, markType.create())
		}
		return tr
	})
}
// 匹配 *内容*
export function italicInputRule(markType: MarkType) {
	return new InputRule(/(?:\*)([^*]+)(?:\*)\s$/, (state, match, start, end) => {
		const [_, content] = match
		const tr = state.tr
		if (content) {
			tr.delete(start, end)
			tr.insertText(content, start)
			tr.addMark(start, start + content.length, markType.create())
		}
		return tr
	})
}

// 匹配 `内容`
export function codeInputRule(markType: MarkType) {
	return new InputRule(/(?:`)([^`]+)(?:`)\s$/, (state, match, start, end) => {
		const [_, content] = match
		const tr = state.tr
		if (content) {
			tr.delete(start, end)
			tr.insertText(content, start)
			tr.addMark(start, start + content.length, markType.create())
		}
		return tr
	})
}
