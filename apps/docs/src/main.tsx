import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Spreadsheet } from "@cavs/spreadsheet"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Spreadsheet />
  </StrictMode>,
)
