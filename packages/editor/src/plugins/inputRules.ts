import { inputRules } from "prosemirror-inputrules"
import { schema } from "@/schemas"
import {
	boldInputRule,
	codeInputRule,
	italicInputRule,
	strikethroughInputRule,
	underlineInputRule
} from "./rules"

export const inputPlugins = inputRules({
	rules: [
		strikethroughInputRule(schema.marks.strikethrough),
		underlineInputRule(schema.marks.underline),
		boldInputRule(schema.marks.strong),
		italicInputRule(schema.marks.em),
		codeInputRule(schema.marks.code)
	]
})
