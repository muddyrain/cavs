import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"
import { FC, memo, ReactNode } from "react"
import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from "./tooltip.tsx"

type ContentType = React.ComponentProps<typeof TooltipPrimitive.Content>
const TooltipInner: FC<
	{
		children: ReactNode
		content?: ReactNode
		className?: string
	} & Pick<ContentType, "align" | "side">
> = ({ children, content, align, side, className }) => {
	return (
		<TooltipRoot>
			<TooltipTrigger asChild>
				<span className={className}>{children}</span>
			</TooltipTrigger>
			{content && (
				<TooltipContent className="select-none" align={align} side={side}>
					{content}
				</TooltipContent>
			)}
		</TooltipRoot>
	)
}

export const Tooltip = memo(TooltipInner)
