import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import TIcon from "@/assets/t.png"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 *
 * Tailwind CSS relies on `rem` units, which are based on the root font size (typically defined on the <html>
 * or <body> element). However, in a Shadow DOM (as used by Plasmo), there is no native root element, so the
 * rem values would reference the actual page's root font size—often leading to sizing inconsistencies.
 *
 * To address this, we:
 * 1. Replace the `:root` selector with `:host(plasmo-csui)` to properly scope the styles within the Shadow DOM.
 * 2. Convert all `rem` units to pixel values using a fixed base font size, ensuring consistent styling
 *    regardless of the host page's font size.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText
  return styleElement
}

const PlasmoOverlay = () => {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState("")
  const [pagePosition, setPagePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseUp = (e) => {
      const selection = window.getSelection()
      console.log("up");
      if (!selection || selection.rangeCount === 0) {
        return
      }
      const text = selection.toString().trim()
      if (text.length > 0) {
        setText(text)
        setVisible(true)
        setPagePosition({ x: e.pageX + 5, y: e.pageY + 5 })
      } else {
        setText("")
        setVisible(false)
        setPagePosition({ x: 0, y: 0 })
      }
    }
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
    }
  })
  const handleTranslate = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!visible) {
    return null
  }
  return (
    <div
      style={{ left: pagePosition.x, top: pagePosition.y, userSelect: "none" }}
      className="plasmo-z-[9999999999] plasmo-absolute plasmo-flex plasmo-w-5 plasmo-h-5 plasmo-bg-purple-200 plasmo-p-1 plasmo-rounded-sm plasmo-shadow-sm plasmo-shadow-purple-400"
      onClick={handleTranslate}
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    >
      <img className=" plasmo-cursor-pointer plasmo-duration-300 hover:plasmo-opacity-75" src={TIcon} alt="icon" />
    </div>
  )
}

export default PlasmoOverlay
