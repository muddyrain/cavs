import { FC } from "react"

export const Footer: FC = () => {
	return (
		<div className="flex items-center justify-between px-4 py-1 border-t bg-card text-xs text-muted-foreground">
			<div className="flex items-center gap-4">
				<span>行 1, 列 1</span>
				<span>选中 0 字符</span>
				<span>Markdown</span>
			</div>
			<div className="flex items-center gap-4">
				<span>1,234 字符</span>
				<span>89 行</span>
				<span className="text-green-600">已保存</span>
			</div>
		</div>
	)
}
