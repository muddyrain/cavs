import { ProseMirrorEditor, useEditor } from "@cavs/editor"
import { Button, Input, ScrollArea } from "@cavs/ui"
import {
	ChevronDown,
	ChevronRight,
	FileText,
	Folder,
	FolderOpen,
	Plus,
	Search,
	X
} from "lucide-react"
import { FC, useState } from "react"
import { EditorToolbar } from "./EditorToolbar"

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
	const editor = useEditor()
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
			<div className="min-w-64 border-r border-zinc-300 bg-card flex flex-col">
				<div className="p-3 border-b border-zinc-300">
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
							className="pl-6! h-8 text-xs"
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
				<div className="flex items-center px-4 py-1 border-b border-zinc-300 bg-muted/30">
					<div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-t-md border border-zinc-300 border-b-0">
						<FileText className="h-3 w-3" />
						<span className="text-sm">README.md</span>
						<Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2">
							<X className="h-3 w-3" />
						</Button>
					</div>
				</div>
				{/* 富文本编辑工具栏 */}
				<EditorToolbar editor={editor} />
				{/* ProseMirror 编辑器区域 */}
				<div className="flex-1 overflow-hidden">
					<ScrollArea className="h-full">
						<div className="p-6 max-w-4xl mx-auto">
							<ProseMirrorEditor editor={editor} />
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	)
}
