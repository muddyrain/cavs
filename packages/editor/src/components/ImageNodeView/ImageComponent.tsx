import { ImageResizable } from "@cavs/ui"
import React from "react"

export const ImageComponent: React.FC<{ src: string; alt?: string; title?: string }> = ({
	src,
	alt
}) => {
	return <ImageResizable src={src} alt={alt} />
}
