import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Input,
	ScrollArea,
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
	ChevronRight,
	Code,
	Code2,
	FileText,
	Folder,
	FolderOpen,
	Heading1,
	Heading2,
	Heading3,
	ImageIcon,
	Italic,
	Link,
	List,
	ListOrdered,
	MoreHorizontal,
	Plus,
	Quote,
	Redo,
	Search,
	Strikethrough,
	Table,
	Underline,
	Undo,
	X
} from "lucide-react"
import { FC, useState } from "react"
import { ProseMirrorEditor } from "../ProseMirrorEditor"

interface FileNode {
	id: string
	name: string
	type: "file" | "folder"
	children?: FileNode[]
	isOpen?: boolean
}

const sampleFiles: FileNode[] = [
	{
		id: "1",
		name: "项目文档",
		type: "folder",
		isOpen: true,
		children: [
			{ id: "2", name: "README.md", type: "file" },
			{ id: "3", name: "开发指南.md", type: "file" },
			{
				id: "4",
				name: "API文档",
				type: "folder",
				isOpen: false,
				children: [
					{ id: "5", name: "用户接口.md", type: "file" },
					{ id: "6", name: "认证接口.md", type: "file" }
				]
			}
		]
	},
	{
		id: "7",
		name: "个人笔记",
		type: "folder",
		isOpen: true,
		children: [
			{ id: "8", name: "学习笔记.md", type: "file" },
			{ id: "9", name: "会议记录.md", type: "file" }
		]
	}
]

export const Main: FC = () => {
	const [selectedFile, setSelectedFile] = useState("2")
	const [searchQuery, setSearchQuery] = useState("")

	const FileTreeItem = ({ node, level = 0 }: { node: FileNode; level?: number }) => {
		const [isOpen, setIsOpen] = useState(node.isOpen || false)

		return (
			<div>
				<div
					className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-md transition-colors ${
						selectedFile === node.id ? "bg-accent text-accent-foreground" : ""
					}`}
					style={{ paddingLeft: `${level * 12 + 8}px` }}
					onClick={() => {
						if (node.type === "folder") {
							setIsOpen(!isOpen)
						} else {
							setSelectedFile(node.id)
						}
					}}
				>
					{node.type === "folder" ? (
						<>
							{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
							{isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
						</>
					) : (
						<>
							<div className="w-4" />
							<FileText className="h-4 w-4" />
						</>
					)}
					<span className="truncate">{node.name}</span>
				</div>
				{node.type === "folder" && isOpen && node.children && (
					<div>
						{node.children.map((child) => (
							<FileTreeItem key={child.id} node={child} level={level + 1} />
						))}
					</div>
				)}
			</div>
		)
	}
	return (
		<div className="flex flex-1 overflow-hidden">
			{/* 左侧文件树 */}
			<div className="min-w-64 border-r bg-card flex flex-col">
				<div className="p-3 border-b">
					<div className="flex items-center gap-2 mb-2">
						<h2 className="font-medium text-sm">文件</h2>
						<Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
							<Plus className="h-3 w-3" />
						</Button>
					</div>
					<div className="relative">
						<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
						<Input
							placeholder="搜索文件..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-7 h-8 text-xs"
						/>
					</div>
				</div>

				<ScrollArea className="flex-1 p-2">
					{sampleFiles.map((file) => (
						<FileTreeItem key={file.id} node={file} />
					))}
				</ScrollArea>
			</div>

			{/* 主编辑区域 */}
			<div className="flex-1 flex flex-col">
				{/* 文件标签栏 */}
				<div className="flex items-center px-4 py-1 border-b bg-muted/30">
					<div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-t-md border border-b-0">
						<FileText className="h-3 w-3" />
						<span className="text-sm">README.md</span>
						<Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2">
							<X className="h-3 w-3" />
						</Button>
					</div>
				</div>

				{/* 富文本编辑工具栏 */}
				<div className="flex items-center gap-1 px-4 py-2 border-b bg-card">
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
								<Button variant="ghost" size="sm">
									<Bold className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>粗体 (Ctrl+B)</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm">
									<Italic className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>斜体 (Ctrl+I)</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm">
									<Underline className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>下划线 (Ctrl+U)</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm">
									<Strikethrough className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>删除线</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm">
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
								<Button variant="ghost" size="sm">
									<AlignLeft className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>左对齐</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm">
									<AlignCenter className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>居中对齐</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm">
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

				{/* ProseMirror 编辑器区域 */}
				<div className="flex-1 overflow-hidden">
					<ScrollArea className="h-full">
						<div className="p-6 max-w-4xl mx-auto">
							<ProseMirrorEditor />
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	)
}
