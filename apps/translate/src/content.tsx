/* eslint-disable react-refresh/only-export-components */
import TIcon from "@/assets/t.png"
import cssText from "data-text:@/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import { Translate } from "./components/translate"

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
  const [visibleIcon, setVisibleIcon] = useState(false)
  const [visibleTranslate, setVisibleTranslate] = useState(false)
  const [text, setText] = useState("")
  const [pagePosition, setPagePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanStatus = () => {
    setText("")
    setVisibleIcon(false)
    setPagePosition({ x: 0, y: 0 })
    setVisibleTranslate(false)
  }
  useEffect(() => {
    const handleMouseDown = () => {
      cleanStatus()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        selection.removeAllRanges()
      }
    }
    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        return
      }
      const text = selection.toString().trim()
      if (text.length > 0) {
        setText(text)
        setVisibleIcon(true)
        setPagePosition({ x: e.pageX + 5, y: e.pageY + 5 })
      } else {
        cleanStatus()
      }
    }
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  })
  const handleTranslate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisibleTranslate(true)
  }
  if (!visibleIcon) {
    return null
  }
  return (
    <div
      ref={containerRef}
      style={{ left: pagePosition.x, top: pagePosition.y }}
      className="z-9999999999 absolute flex"
      onClick={handleTranslate}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}>
      {visibleTranslate ? (
        <Translate text={text} />
      ) : (
        <div className="w-5 h-5 bg-purple-200 p-1 rounded-sm shadow-xs shadow-purple-400">
          <img
            className="cursor-pointer duration-300 hover:opacity-75"
            src={TIcon}
            alt="icon"
          />
        </div>
      )}
    </div>
  )
}

export default PlasmoOverlay
