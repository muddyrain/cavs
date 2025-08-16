import { NodeSpec, Schema } from "prosemirror-model"
import { schema as schemaBasic } from "prosemirror-schema-basic"
import { blockquote } from "./blockquote"
import { heading } from "./heading"
import { bullet_list, list_item, ordered_list } from "./list"
import { strikethrough, underline } from "./marks"

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

export const schema: Schema = new Schema({
	nodes: {
		doc: { content: "block+" },
		text: {
			group: "inline"
		},
		paragraph,
		heading,
		blockquote,
		bullet_list,
		ordered_list,
		list_item
	},
	marks: schemaBasic.spec.marks.append({ underline, strikethrough })
})
