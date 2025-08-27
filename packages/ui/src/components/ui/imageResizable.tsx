import React, { useEffect, useState } from "react"

interface ImageResizableProps {
	src: string
	alt?: string
	className?: string
	style?: React.CSSProperties
}

export const ImageResizable: React.FC<ImageResizableProps> = ({
	src,
	alt,
	className = "",
	style
}) => {
	const [alignment] = useState<"left" | "center" | "right">("center")
	const [imgWidth, setImgWidth] = useState(0)
	const [imgHeight, setImgHeight] = useState(0)
	useEffect(() => {
		const img = new Image()
		img.src = src
		img.onload = function () {
			const { width, height } = img
			setImgWidth(width)
			setImgHeight(height)
		}
	}, [src])
	return (
		<div className="image-block" style={{ textAlign: alignment }}>
			<div className="relative" style={{ width: imgWidth, height: imgHeight }}>
				<img src={src} alt={alt} className={`rounded-md ${className}`} style={style} />
				<div className="absolute top-0 left-0 w-full h-full border border-solid border-yellow-400"></div>
			</div>
		</div>
	)
}
