import { z } from "zod/v4";
import { registry } from "@langchain/langgraph/zod";

export const ticketSchema = z.object({
  // 出发城市
  from_city: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => "",
    })
    .describe("出发城市"),
  // 目标城市
  to_city: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => "",
    })
    .describe("目标城市"),
  // 票务信息
  ticket_result: z
    .string()
    .nullable()
    .register(registry, {
      reducer: {
        fn: (x: string | null, y: string | null) => y ?? x,
      },
      default: () => null,
    })
    .describe("票务信息"),
});

export type T_ticketSchema = z.infer<typeof ticketSchema>;
