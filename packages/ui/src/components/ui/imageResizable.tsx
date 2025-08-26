import React from "react"

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
	return (
		<>
			<img
				src={src}
				alt={alt}
				className={`cursor-zoom-in rounded-md border bg-muted transition hover:scale-105 ${className}`}
				style={style}
			/>
		</>
	)
}
