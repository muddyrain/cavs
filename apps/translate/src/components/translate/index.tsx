import { ArrowLeftRight, X } from "lucide-react"
import { useState, type FC } from "react"
export const Translate: FC<{
  text?: string
}> = ({ text }) => {
  const [originLang, setOriginLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("auto")
  const [result] = useState("")
  return (
    <div className="bg-slate-700 border border-solid border-slate-500 text-white rounded-md shadow-lg w-[400px]">
      {/* 顶部标题区 */}
      <div className="flex items-center justify-between p-3">
        <span className="font-bold text-lg">翻译</span>
        <div className="flex items-center gap-2">
          {/* 图标/下拉框等 */}
          <button className="text-white hover:text-slate-300">
            <X />
          </button>
        </div>
      </div>
      {/* 分隔线 */}
      <div className="border-b border-slate-500" />
      {/* 内容区 */}
      <div className="p-3">
        <div className="bg-slate-600 rounded p-2 text-sm">
          {text}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <select value={originLang} onChange={(e) => setOriginLang(e.target.value)} className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-zinc-400">
            <option value="auto">自动检测</option>
            <option value="zh">中文(简体)</option>
            <option value="en">英文</option>
          </select>
          <ArrowLeftRight />
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-zinc-400">
            <option value="auto">自动检测</option>
            <option value="zh">中文(简体)</option>
            <option value="en">英文</option>
          </select>
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">翻译</button>
        </div>
        {/* 结果区 */}
        <div className="bg-slate-600 rounded p-2 mt-2 text-sm">
          {result}
        </div>
      </div>
    </div>
  )
}