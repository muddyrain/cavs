import { NodeViewConstructor } from "prosemirror-view"
import ReactDOM from "react-dom/client"
import { ImageComponent } from "./ImageComponent"

export const ImageNodeViewFactory: NodeViewConstructor = (node) => {
	const dom = document.createElement("span")
	const root = ReactDOM.createRoot(dom)
	root.render(<ImageComponent src={node.attrs.src} alt={node.attrs.alt} title={node.attrs.title} />)
	return {
		dom,
		update(updatedNode) {
			if (
				updatedNode.attrs.src !== node.attrs.src ||
				updatedNode.attrs.alt !== node.attrs.alt ||
				updatedNode.attrs.title !== node.attrs.title
			) {
				root.render(
					<ImageComponent
						src={updatedNode.attrs.src}
						alt={updatedNode.attrs.alt}
						title={updatedNode.attrs.title}
					/>
				)
			}
			node = updatedNode
			return true
		},
		destroy() {
			root.unmount()
		}
	}
}
