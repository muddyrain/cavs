import { EditorType } from "@cavs/editor"
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "@cavs/ui"
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	ChevronDown,
	Code,
	Code2,
	Heading1,
	Heading2,
	Heading3,
	ImageIcon,
	Italic,
	Link,
	List,
	ListOrdered,
	MoreHorizontal,
	Quote,
	Redo,
	Strikethrough,
	Table,
	Underline,
	Undo
} from "lucide-react"
import { FC } from "react"

export const EditorToolbar: FC<{
	editor: EditorType
}> = ({ editor }) => {
	return (
		<div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-300 bg-card">
			{/* 撤销重做 */}
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Undo className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>撤销 (Ctrl+Z)</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Redo className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>重做 (Ctrl+Y)</TooltipContent>
				</Tooltip>
			</div>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* 标题样式 */}
			<div className="flex items-center gap-1">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="gap-1">
							<Heading1 className="h-4 w-4" />
							<ChevronDown className="h-3 w-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<Heading1 className="h-4 w-4 mr-2" />
							标题 1
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Heading2 className="h-4 w-4 mr-2" />
							标题 2
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Heading3 className="h-4 w-4 mr-2" />
							标题 3
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* 文本格式 */}
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.bold()
							}}
						>
							<Bold className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>粗体 (Ctrl+B)</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.italic()
							}}
						>
							<Italic className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>斜体 (Ctrl+I)</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.underline()
							}}
						>
							<Underline className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>下划线 (Ctrl+U)</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.strikethrough()
							}}
						>
							<Strikethrough className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>删除线</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.code()
							}}
						>
							<Code className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>行内代码</TooltipContent>
				</Tooltip>
			</div>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* 对齐方式 */}
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.textAlign("left")
							}}
						>
							<AlignLeft className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>左对齐</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.textAlign("center")
							}}
						>
							<AlignCenter className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>居中对齐</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								editor?.commands.textAlign("right")
							}}
						>
							<AlignRight className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>右对齐</TooltipContent>
				</Tooltip>
			</div>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* 列表和引用 */}
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<List className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>无序列表</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<ListOrdered className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>有序列表</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Quote className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>引用块</TooltipContent>
				</Tooltip>
			</div>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* 插入元素 */}
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Link className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>插入链接</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<ImageIcon className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>插入图片</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Table className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>插入表格</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Code2 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>代码块</TooltipContent>
				</Tooltip>
			</div>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* 更多选项 */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>插入分割线</DropdownMenuItem>
					<DropdownMenuItem>插入数学公式</DropdownMenuItem>
					<DropdownMenuItem>插入 Mermaid 图表</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>清除格式</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
