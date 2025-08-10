import { Schema } from "prosemirror-model"
import { schema as schemaBasic } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { strikethrough, underline } from "./marks"

export const schema = new Schema({
	nodes: addListNodes(schemaBasic.spec.nodes, "paragraph block*", "block"),
	marks: schemaBasic.spec.marks.append({ underline, strikethrough })
})
