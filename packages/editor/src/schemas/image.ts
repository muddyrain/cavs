import { NodeSpec } from "prosemirror-model"

export const image: NodeSpec = {
	inline: true,
	group: "inline",
	draggable: true,
	attrs: {
		src: {},
		alt: { default: null },
		title: { default: null }
	},
	parseDOM: [
		{
			tag: "img",
			getAttrs(dom) {
				return {
					src: dom.getAttribute("src"),
					alt: dom.getAttribute("alt"),
					title: dom.getAttribute("title")
				}
			}
		}
	],
	toDOM(node) {
		return ["img", node.attrs]
	}
}
