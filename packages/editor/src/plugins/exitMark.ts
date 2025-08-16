import { MarkType } from "prosemirror-model"
import { Plugin } from "prosemirror-state"
import { schema } from "@/schemas"

function exitMarkPlugin(markType: MarkType) {
	return new Plugin({
		props: {
			handleTextInput(view, _, __, text) {
				if (text === " ") {
					const { state } = view
					const { $from } = state.selection
					const nodeBefore = $from.nodeBefore
					if (
						nodeBefore &&
						markType.isInSet(nodeBefore.marks) &&
						$from.parentOffset === $from.parent.content.size
					) {
						view.dispatch(state.tr.removeStoredMark(markType))
					}
				}
				return false
			}
		}
	})
}

export const exitMarkPlugins = [exitMarkPlugin(schema.marks.code)]
