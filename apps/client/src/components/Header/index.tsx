import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "@cavs/ui"
import { Save, Settings } from "lucide-react"
import { FC } from "react"

export const Header: FC = () => {
	return (
		<div className="flex items-center justify-between px-4 py-2 border-b bg-card">
			<div className="flex items-center gap-2">
				<h1 className="text-lg font-semibold">Markdown Editor</h1>
				<Badge variant="secondary" className="text-xs">
					v1.0.0
				</Badge>
			</div>
			<div className="flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="sm">
							<Save className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>保存 (Ctrl+S)</TooltipContent>
				</Tooltip>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<Settings className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>偏好设置</DropdownMenuItem>
						<DropdownMenuItem>主题设置</DropdownMenuItem>
						<DropdownMenuItem>快捷键</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>导出 PDF</DropdownMenuItem>
						<DropdownMenuItem>导出 HTML</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
