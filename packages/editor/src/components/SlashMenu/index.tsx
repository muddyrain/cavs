import React, { useState } from "react"
import { CoordsType, SlashMenuButtonItem, SlashMenuItem } from "@/types"

interface SlashMenuProps {
	coords: CoordsType
	items: SlashMenuItem[]
	onSelect: (item: SlashMenuButtonItem) => void
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
			<div className="border border-zinc-300 rounded-sm bg-white p-2 mt-2">
				{filteredItems.map((item) => (
					<div key={item.key} onClick={() => onSelect(item)}>
						<div className="font-bold mb-2">{item.label}</div>
						<ul className="">
							{item.children.map((cItem) => (
								<li
									className="cursor-pointer p-1 hover:bg-zinc-100 duration-300 rounded-sm flex items-center"
									key={cItem.key}
									onClick={() => onSelect(cItem)}
								>
									{cItem.icon}
									{cItem.label}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	)
}
