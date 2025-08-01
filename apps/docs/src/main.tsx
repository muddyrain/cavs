import { Spreadsheet } from "@cavs/spreadsheet"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Spreadsheet />
	</StrictMode>
)
