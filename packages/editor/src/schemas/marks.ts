import { MarkSpec } from "prosemirror-model"

export const underline: MarkSpec = {
	parseDOM: [
		{ tag: "u" },
		{ style: "text-decoration", getAttrs: (value) => value === "underline" && null }
	],
	toDOM() {
		return ["u", 0]
	}
}

export const strikethrough: MarkSpec = {
	parseDOM: [
		{ tag: "s" },
		{ tag: "del" },
		{ tag: "strike" },
		{
			style: "text-decoration",
			getAttrs: (value) => (value as string).includes("line-through") && null
		}
	],
	toDOM() {
		return ["s", 0]
	}
}
