"use client"

import {
	Button,
	Separator,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem
} from "@cavs/ui"
import { File, Folder, FolderPlus, RefreshCw } from "lucide-react"
import * as React from "react"
import { useCallback, useState } from "react"

export function AppSidebar() {
	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<div className="flex items-center gap-2">
					<Button size="sm" variant="ghost">
						<FolderPlus className="size-4 mr-1" /> 打开文件夹
					</Button>
					<Button size="sm" variant="ghost">
						<RefreshCw className="size-4 mr-1" /> 刷新
					</Button>
					<div className="text-xs text-muted-foreground truncate">{}</div>
				</div>
				<Separator />
			</SidebarHeader>
			<SidebarContent className="p-2">
				<SidebarMenu>
					<div className="p-2 text-sm text-muted-foreground">
						未选择文件夹，点击“打开文件夹”以浏览本地文件
					</div>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<div className="px-2 py-2 text-xs text-muted-foreground">
					Tip: 使用浏览器的文件夹选择或在 Tauri 环境下使用系统对话框。
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
