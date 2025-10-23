import { useCreateBlockNote } from "@cavs/editor-react"
import { BlockNoteView } from "@cavs/editor-shadcn"
import { Button, Separator, SidebarInset, SidebarProvider, SidebarTrigger } from "@cavs/ui"
import { useMemo, useState } from "react"
import TurndownService from "turndown"
import { AppSidebar } from "@/components/app-sidebar"

export const HomePage = () => {
	const [viewMode, setViewMode] = useState<"edit" | "preview" | "side">("edit")
	const editor = useCreateBlockNote()
	const previewPlaceholder = useMemo(() => {
		return "预览区域：后续接入 Markdown/HTML 渲染"
	}, [])
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									/* TODO: 新建 */
								}}
							>
								新建
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									/* TODO: 保存 */
								}}
							>
								保存
							</Button>
							<Separator orientation="vertical" className="!h-4" />
							<Button
								size="sm"
								variant={viewMode === "edit" ? "default" : "outline"}
								onClick={() => setViewMode("edit")}
							>
								编辑
							</Button>
							<Button
								size="sm"
								variant={viewMode === "preview" ? "default" : "outline"}
								onClick={() => setViewMode("preview")}
							>
								预览
							</Button>
							<Button
								size="sm"
								variant={viewMode === "side" ? "default" : "outline"}
								onClick={() => setViewMode("side")}
							>
								并排
							</Button>
							<Separator orientation="vertical" className="!h-4" />
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									const html = editor._tiptapEditor.getHTML()
									const turndownService = new TurndownService({ headingStyle: "atx" })
									const md = turndownService.turndown(html)

									// 自动下载 .md 文件
									const blob = new Blob([md], { type: "text/markdown;charset=utf-8" })
									const url = URL.createObjectURL(blob)
									const a = document.createElement("a")
									a.href = url
									a.download = `export-${Date.now()}.md`
									document.body.appendChild(a)
									a.click()
									a.remove()
									URL.revokeObjectURL(url)
								}}
							>
								导出MD
							</Button>
						</div>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{/* 主编辑区域 */}
					<div className="h-full">
						{viewMode === "edit" && (
							<div className="h-full rounded-md border bg-background p-2">
								<BlockNoteView editor={editor} />
							</div>
						)}
						{viewMode === "preview" && (
							<div className="prose dark:prose-invert max-w-none min-h-[60vh] rounded-md border bg-background p-4">
								{previewPlaceholder}
							</div>
						)}
						{viewMode === "side" && (
							<div className="flex h-full rounded-md border bg-background">
								<div className="flex-1 border-r p-2">
									<BlockNoteView editor={editor} />
								</div>
								<div className="w-1/2 p-4 overflow-auto">
									<div className="prose dark:prose-invert max-w-none">{previewPlaceholder}</div>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* 状态栏（最小示例） */}
				<footer className="h-8 border-t flex items-center px-4 text-xs text-muted-foreground">
					<div className="flex-1">Ln 1, Col 1</div>
					<div>已保存</div>
				</footer>
			</SidebarInset>
		</SidebarProvider>
	)
}
