import { z } from "zod/v4";
import type { BaseMessage } from "@langchain/core/messages";
import { registry } from "@langchain/langgraph/zod";
import { MessagesZodMeta } from "@langchain/langgraph";

export const travelSchema = z.object({
  // 聊天的消息
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, {
      ...MessagesZodMeta,
      default: () => [] as BaseMessage[],
    })
    .describe("聊天的消息"),
  intent: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => null,
    })
    .describe("识别的意图"),
  // 存储子图的结果
  sub_result: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => null,
    })
    .describe("存储子图的结果"),
});

export type T_travelSchema = z.infer<typeof travelSchema>;
