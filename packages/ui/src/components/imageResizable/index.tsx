import React, { useEffect, useRef, useState } from "react"
import { ImageResizableToolbar } from "./toolbar"

interface ImageResizableProps {
	src: string
	alt?: string
	className?: string
	imageClass?: string
	style?: React.CSSProperties
}
export enum Alignment {
	left = "flex-start",
	center = "center",
	right = "flex-end"
}
type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right"
export const ImageResizable: React.FC<ImageResizableProps> = ({
	src,
	alt,
	className = "",
	imageClass = "",
	style
}) => {
	const [alignment, setAlignment] = useState<Alignment>(Alignment.center)
	const [imgWidth, setImgWidth] = useState(0)
	const [imgHeight, setImgHeight] = useState(0)
	const aspectRatio = useRef(0 / 0)
	const dragging = useRef<null | Corner>(null)
	const startPos = useRef({ x: 0, y: 0 })
	const startSize = useRef({ width: 0, height: 0 })
	useEffect(() => {
		const img = new Image()
		img.src = src
		img.onload = function () {
			const { width, height } = img
			setImgWidth(width)
			setImgHeight(height)
			aspectRatio.current = img.width / img.height
		}
	}, [src])
	// 拖拽开始
	const onDragStart = (corner: Corner) => (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		dragging.current = corner
		startPos.current = { x: e.clientX, y: e.clientY }
		startSize.current = { width: imgWidth, height: imgHeight }
		document.body.style.cursor = "nwse-resize"
		window.addEventListener("mousemove", onDrag)
		window.addEventListener("mouseup", onDragEnd)
	}
	// 拖拽移动
	const onDrag = (e: MouseEvent) => {
		if (!dragging.current) return
		const dx = e.clientX - startPos.current.x
		const dy = e.clientY - startPos.current.y
		let delta = 0

		// 取最大轴的变化量作为缩放基准
		switch (dragging.current) {
			case "top-left":
				delta = -Math.max(dx, dy)
				break
			case "top-right":
				delta = Math.max(dx, -dy)
				break
			case "bottom-left":
				delta = -Math.max(dx, -dy)
				break
			case "bottom-right":
				delta = Math.max(dx, dy)
				break
		}

		let newWidth = Math.max(50, startSize.current.width + delta)
		let newHeight = Math.max(50, newWidth / aspectRatio.current)
		setImgWidth(newWidth)
		setImgHeight(newHeight)
	}
	// 拖拽结束
	const onDragEnd = () => {
		dragging.current = null
		document.body.style.cursor = ""
		window.removeEventListener("mousemove", onDrag)
		window.removeEventListener("mouseup", onDragEnd)
	}
	return (
		<div className={`image-block my-2 flex ${className}`} style={{ justifyContent: alignment }}>
			<div className="relative group" style={{ width: imgWidth, height: imgHeight }}>
				<ImageResizableToolbar
					alignment={alignment}
					onClick={(type) => {
						switch (type) {
							case Alignment.left:
								setAlignment(Alignment.left)
								break
							case Alignment.center:
								setAlignment(Alignment.center)
								break
							case Alignment.right:
								setAlignment(Alignment.right)
								break
						}
					}}
				/>
				<img
					src={src}
					alt={alt}
					className={`relative rounded-md w-full h-full select-none ${imageClass}`}
					style={style}
					draggable={false}
				/>
				{/* 边框 */}
				<div className="absolute opacity-0 group-hover:opacity-100 top-0 left-0 w-full h-full border border-blue-500 pointer-events-none" />
				{/* 四个角拖拽点 */}
				<div
					className="absolute opacity-0 group-hover:opacity-100 cursor-nwse-resize top-0 left-0 w-3 h-3 rounded-full bg-white border border-blue-500"
					style={{ transform: "translate(-50%, -50%)" }}
					onMouseDown={onDragStart("top-left")}
				/>
				<div
					className="absolute opacity-0 group-hover:opacity-100 cursor-nwse-resize top-0 right-0 w-3 h-3 rounded-full bg-white border border-blue-500"
					style={{ transform: "translate(50%, -50%)" }}
					onMouseDown={onDragStart("top-right")}
				/>
				<div
					className="absolute opacity-0 group-hover:opacity-100 cursor-nwse-resize bottom-0 left-0 w-3 h-3 rounded-full bg-white border border-blue-500"
					style={{ transform: "translate(-50%, 50%)" }}
					onMouseDown={onDragStart("bottom-left")}
				/>
				<div
					className="absolute opacity-0 group-hover:opacity-100 cursor-nwse-resize bottom-0 right-0 w-3 h-3 rounded-full bg-white border border-blue-500"
					style={{ transform: "translate(50%, 50%)" }}
					onMouseDown={onDragStart("bottom-right")}
				/>
			</div>
		</div>
	)
}
