import { NodeSpec } from "prosemirror-model"

export const image: NodeSpec = {
	content: "block+",
	group: "block",
	defining: true,
	draggable: false,
	selectable: false,
	atom: true,
	attrs: {
		src: {},
		alt: { default: null },
		title: { default: null }
	},
	parseDOM: [
		{
			tag: "img[src]",
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
