export const Translate = () => {
  return (
    <div className="bg-slate-800 border border-solid border-zinc-200 text-white p-4 rounded-xl shadow-lg w-[400px]">
      {/* 顶部标题区 */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">翻译</span>
        <div className="flex items-center gap-2">
          {/* 图标/下拉框等 */}
          <select className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-zinc-400">
            <option>自动检测</option>
            <option>中文(简体)</option>
            <option>英文</option>
          </select>
          <button className="text-white hover:text-slate-300">
            <svg width="20" height="20" fill="currentColor"><circle cx="10" cy="10" r="8" /></svg>
          </button>
        </div>
      </div>
      {/* 分隔线 */}
      <div className="border-b border-zinc-600 my-2" />
      {/* 内容区 */}
      <div className="space-y-2">
        <div className="text-base">
          xxxxxx
        </div>
        {/* 分组：百度翻译/谷歌翻译 */}
        <div className="flex gap-2 mt-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">百度翻译</button>
          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">谷歌翻译</button>
        </div>
        {/* 结果区 */}
        <div className="bg-slate-700 rounded p-2 mt-2 text-sm">
          Agent improves employee productivity: The built system can be connected to AI Agent, and employees can trigger business processes and call system capabilities through dialogue, achieving efficient collaboration of "no hands-on" without any action.
        </div>
      </div>
    </div>
  )
}