import { NodeSpec } from "prosemirror-model"

export const ordered_list: NodeSpec = {
	group: "block",
	content: "list_item+",
	attrs: { order: { default: 1 } },
	parseDOM: [
		{
			tag: "ol",
			getAttrs(dom) {
				return { order: dom.hasAttribute("start") ? +dom.getAttribute("start")! : 1 }
			}
		}
	],
	toDOM(node) {
		return node.attrs.order === 1 ? ["ol", 0] : ["ol", { start: node.attrs.order }, 0]
	}
}

export const bullet_list: NodeSpec = {
	group: "block",
	content: "list_item+",
	parseDOM: [{ tag: "ul" }],
	toDOM() {
		return ["ul", 0]
	}
}

export const list_item: NodeSpec = {
	content: "paragraph block*",
	parseDOM: [{ tag: "li" }],
	toDOM() {
		return ["li", 0]
	}
}
