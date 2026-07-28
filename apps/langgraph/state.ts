import { z } from "zod/v4";

// 整张图状态的Schema
export const Schema = z.object({
  topic: z.string().describe("文章主题"),
  title: z.string().describe("文章标题"),
  content: z.string().describe("文章内容"),
  summary: z.string().describe("文章摘要"),
  image_path: z.string().describe("图片路径"),
});

// 基于Schema生成的ts类型
export type TArticle = z.infer<typeof Schema>;
