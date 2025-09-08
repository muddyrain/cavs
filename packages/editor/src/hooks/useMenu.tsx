import {
	CodeIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ListIcon,
	ListOrderedIcon,
	TypeIcon
} from "lucide-react"
import { useState } from "react"
import { EditorType, SlashMenuItem, SlashMenuKey } from "@/types"
export const useMenu = (_: EditorType) => {
	const [menus, setMenus] = useState<SlashMenuItem[]>([
		{
			label: "基础",
			key: "basic",
			children: [
				{
					icon: <TypeIcon />,
					label: "文本",
					key: SlashMenuKey.Paragraph
				},
				{
					icon: <Heading1Icon />,
					label: "一级标题",
					key: SlashMenuKey.Heading1
				},
				{
					icon: <Heading2Icon />,
					label: "二级标题",
					key: SlashMenuKey.Heading2
				},
				{
					icon: <Heading3Icon />,
					label: "三级标题",
					key: SlashMenuKey.Heading3
				},
				{
					icon: <ListOrderedIcon />,
					label: "有序列表",
					key: SlashMenuKey.OrderedList
				},
				{
					icon: <ListIcon />,
					label: "无序列表",
					key: SlashMenuKey.BulletList
				},
				{
					icon: <CodeIcon />,
					label: "代码块",
					key: SlashMenuKey.CodeBlock
				}
			]
		}
	])
	return { menus, setMenus }
}
