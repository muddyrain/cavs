import { Schema } from "prosemirror-model"
import { schema as schemaBasic } from "prosemirror-schema-basic"
import { blockquote } from "./blockquote"
import { heading } from "./heading"
import { image } from "./image"
import { bullet_list, list_item, ordered_list } from "./list"
import { strikethrough, underline } from "./marks"
import { paragraph } from "./paragraph"

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
		list_item,
		image
	},
	marks: schemaBasic.spec.marks.append({ underline, strikethrough })
})
