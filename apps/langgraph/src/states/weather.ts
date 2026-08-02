import { z } from "zod/v4";
import { registry } from "@langchain/langgraph/zod";

export const weatherSchema = z.object({
  // 城市
  city: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        // 保证节点返回的是一个有效的信息，才会去更新状态
        // 如果y不是null或者undefined，那么就用y去更新状态
        // 否则就用旧值x
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => "",
    })
    .describe("城市"),
  // 天气结果
  weather_result: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => "",
    })
    .describe("对应的天气结果"),
});

export type T_weatherSchema = z.infer<typeof weatherSchema>;
