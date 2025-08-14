import { NodeSpec, Schema } from "prosemirror-model"
import { schema as schemaBasic } from "prosemirror-schema-basic"
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
		heading: {
			attrs: { level: { default: 1 } },
			content: "inline*",
			group: "block",
			defining: true,
			parseDOM: [
				{ tag: "h1", attrs: { level: 1 } },
				{ tag: "h2", attrs: { level: 2 } },
				{ tag: "h3", attrs: { level: 3 } },
				{ tag: "h4", attrs: { level: 4 } },
				{ tag: "h5", attrs: { level: 5 } },
				{ tag: "h6", attrs: { level: 6 } }
			],
			toDOM(node) {
				return ["h" + node.attrs.level, 0]
			}
		},
		blockquote: {
			content: "block+",
			group: "block",
			defining: true,
			parseDOM: [{ tag: "blockquote" }],
			toDOM() {
				return ["blockquote", 0]
			}
		}
	},
	marks: schemaBasic.spec.marks.append({ underline, strikethrough })
})
