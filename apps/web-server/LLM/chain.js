const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
require("dotenv").config();

const docPT = PromptTemplate.fromTemplate(`
    你是一名「基于文档回答问题」的智能助手，请严格遵守以下规则：
    
    【规则要求】
    1. 仅使用“相关文档内容”来回答问题；不要编造，也不要依赖外部知识。
    2. 回答开头固定输出：“找到相关文档，然后根据文档内容进行回答。”
    3. 如果文档存在互相矛盾的信息，请指出矛盾，并给出最保守、可靠的结论。
    4. 回答时用简体中文，语言简洁、客观，不超过300字。
    
    【回答结构】
    - 直接结论：先给出简明扼要的最终答案。
    - 依据说明：列出1–3条文档中的关键信息来支撑结论。
    
    【相关文档内容】
    {context}
    
    【用户问题】
    {question}
    
    请根据上述规则与结构输出答案。
    `);

const freePT = PromptTemplate.fromTemplate(`
    你是一名知识型助手。请用简体中文，语言简洁、客观，不超过300字，直接回答用户问题。
    
    【用户问题】
    {question}
    `);

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  streaming: true,
});

const docChatChain = docPT.pipe(model).pipe(new StringOutputParser());
const freeChatChain = freePT.pipe(model).pipe(new StringOutputParser());

module.exports = {
  docChatChain,
  freeChatChain,
};
