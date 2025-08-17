import { NodeSpec } from "prosemirror-model"

export const paragraph: NodeSpec = {
	content: "inline*",
	group: "block",
	attrs: { align: { default: "left" } },
	parseDOM: [
		{
			tag: "p",
			getAttrs(dom) {
				return { align: dom.style.textAlign || "left" }
			}
		}
	],
	toDOM(node) {
		const { align } = node.attrs
		return ["p", { style: `text-align: ${align}` }, 0]
	}
}
