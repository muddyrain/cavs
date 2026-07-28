import { z } from "zod";
import { tool } from "@langchain/core/tools";

// 工具方法参数 schema
const schema = z.object({
  format: z
    .enum(["iso", "locale", "string"])
    .default("locale")
    .describe("时间格式"),
});

export type TimeInput = z.infer<typeof schema>;

// 工具具体实现
const func = ({ format = "locale" }: TimeInput): string => {
  switch (format) {
    case "iso":
      return new Date().toISOString();
    case "locale":
      return new Date().toLocaleString();
    case "string":
      return new Date().toString();
    default:
      return "不支持的 format 类型，请传入 iso / locale / string";
  }
};

const time = tool(func, {
  name: "time",
  description: "获取当前时间，可选输出格式：iso / locale / string。",
  schema,
});

export default time;
