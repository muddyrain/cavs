import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import { FC } from "react"
import { Button } from "../ui/button"

export const ImageResizableToolbar: FC = () => {
	return (
		<>
			<div className="absolute bg-white border border-solid border-zinc-300 rounded-sm flex items-center gap-2 border-b p-2">
				{/* 对齐按钮 */}
				<Button variant="outline" size="icon">
					<AlignLeft className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon">
					<AlignCenter className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon">
					<AlignRight className="h-4 w-4" />
				</Button>
			</div>
		</>
	)
}
