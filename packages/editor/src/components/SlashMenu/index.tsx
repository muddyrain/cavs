import { EditorView } from "prosemirror-view"
import React, { useState } from "react"
import { CoordsType } from "@/types"

type SlashMenuItem = {
	label: string
	value: string
	icon?: React.ReactNode
	action?: (view: EditorView) => void
}
interface SlashMenuProps {
	coords: CoordsType
	items: SlashMenuItem[]
	onSelect: (item: SlashMenuItem) => void
}

export const SlashMenu: React.FC<SlashMenuProps> = ({ coords, items = [], onSelect }) => {
	const [filter, setFilter] = useState("")
	const filteredItems = items.filter((item) => item.label.includes(filter))
	return (
		<div className="slash-menu" style={{ position: "fixed", top: coords.top, left: coords.left }}>
			<input
				type="text"
				className="outline-none pointer-events-none h-5"
				placeholder="输入关键词"
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
			/>
			<ul className="border border-zinc-300 rounded-sm bg-white p-2 mt-2">
				{filteredItems.map((item) => (
					<li className="cursor-pointer" key={item.value} onClick={() => onSelect(item)}>
						{item.icon}
						{item.label}
					</li>
				))}
			</ul>
		</div>
	)
}
