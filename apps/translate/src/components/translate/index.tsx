import { ArrowLeftRight, LoaderCircleIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
export const Translate: FC<{
  text?: string;
  onClose?: () => void;
  isAutoTranslate?: boolean;
  isShowClose?: boolean;
}> = ({ text, onClose, isAutoTranslate = false, isShowClose = true }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState(text || "");
  const [originLang, setOriginLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("auto");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const startTranslate = useCallback(async () => {
    try {
      setIsResultVisible(true);
      setLoading(true);
      const res = await fetch(
        `https://cavs-api.vercel.app/api/translate/baidu?q=${inputText}&from=${originLang}&to=${targetLang}`,
      );
      const data = await res.json();
      if (data && data.trans_result) {
        setResult(data.trans_result[0].dst);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setResult("翻译失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }, [inputText, originLang, targetLang]);
  useEffect(() => {
    const target = textareaRef.current;
    // 临时隐藏滚动条并重置高度
    target.style.overflow = "hidden";
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  }, []);
  useEffect(() => {
    if (result.length === 0 && text && isAutoTranslate) {
      startTranslate();
    }
  }, [isAutoTranslate, result, startTranslate, text]);
  return (
    <div className="bg-slate-700 border border-solid border-slate-500 text-white rounded-md shadow-lg w-[400px]">
      {/* 顶部标题区 */}
      <div className="flex items-center justify-between p-2">
        <span className="font-bold text-md">翻译</span>
        <div className="flex items-center gap-2">
          {/* 图标/下拉框等 */}
          {isShowClose && (
            <button
              className="text-white hover:text-slate-300"
              onClick={() => {
                if (onClose) onClose();
              }}
            >
              <X />
            </button>
          )}
        </div>
      </div>
      {/* 分隔线 */}
      <div className="border-b border-slate-500" />
      {/* 内容区 */}
      <div className="p-3">
        <div className="bg-slate-600 rounded p-3 text-sm">
          <textarea
            rows={2}
            value={inputText}
            ref={textareaRef}
            className="w-full outline-none resize-none break-words text-white bg-transparent"
            style={{
              minHeight: "2.5rem",
              height: "auto",
              overflow: "hidden", // 始终隐藏滚动条
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              // 临时隐藏滚动条并重置高度
              target.style.overflow = "hidden";
              target.style.height = "auto";
              // 计算真实内容高度
              target.style.height = target.scrollHeight + "px";
            }}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <select
            value={originLang}
            onChange={(e) => setOriginLang(e.target.value)}
            className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-zinc-400"
          >
            <option value="auto">自动检测</option>
            <option value="zh">中文(简体)</option>
            <option value="en">英文</option>
          </select>
          <ArrowLeftRight />
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-zinc-400"
          >
            <option value="auto">自动检测</option>
            <option value="zh">中文(简体)</option>
            <option value="en">英文</option>
          </select>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            onClick={startTranslate}
          >
            翻译
          </button>
        </div>
        {/* 结果区 */}
        {isResultVisible && (
          <div className="bg-slate-600 mt-3 rounded text-sm relative overflow-hidden">
            {loading ? (
              <div className="py-2 flex justify-center items-center bg-white/25">
                <LoaderCircleIcon className="animate-spin" />
              </div>
            ) : (
              <>
                {result.length > 0 ? (
                  <div className="p-2 break-words">{result}</div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
