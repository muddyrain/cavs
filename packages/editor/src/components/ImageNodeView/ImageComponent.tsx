import React from "react"

export const ImageComponent: React.FC<{ src: string; alt?: string; title?: string }> = ({
	src,
	alt,
	title
}) => <img src={src} alt={alt} title={title} style={{ borderRadius: "8px", maxWidth: "100%" }} />
