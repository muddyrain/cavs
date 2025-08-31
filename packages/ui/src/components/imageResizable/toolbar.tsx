import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import { FC } from "react"
import { Toggle } from "../ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Alignment } from "."

export const ImageResizableToolbar: FC<{
	onClick?: (type: "flex-start" | "center" | "flex-end") => void
	alignment?: Alignment
}> = ({ onClick, alignment }) => {
	return (
		<>
			<div className="absolute left-1/2 -translate-x-1/2 bg-white delay-200 duration-500 h-10 translate-y-4 opacity-0 border border-solid border-zinc-300 rounded-lg flex items-center gap-1 border-b p-1 group-hover:-translate-y-12 group-hover:opacity-100">
				<div className="flex items-center gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								className={alignment === Alignment.left ? "text-blue-500" : ""}
								onClick={() => {
									onClick?.("flex-start")
								}}
							>
								<AlignLeft className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent className="flex flex-col">
							<span>左对齐</span>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								className={alignment === Alignment.center ? "text-blue-500" : ""}
								onClick={() => {
									onClick?.("center")
								}}
							>
								<AlignCenter className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent className="flex flex-col">
							<span>居中对齐</span>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								className={alignment === Alignment.right ? "text-blue-500" : ""}
								onClick={() => {
									onClick?.("flex-end")
								}}
							>
								<AlignRight className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent className="flex flex-col">
							<span>右对齐</span>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</>
	)
}
