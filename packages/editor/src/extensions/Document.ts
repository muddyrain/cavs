import { Node } from "@tiptap/core"

export const Document = Node.create({
	name: "document",
	// 是否为顶层节点
	topNode: true,
	// 内容可以包含一个或多个块级元素
	content: "block+"
})
