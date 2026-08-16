import { BaseMessage } from "@langchain/core/messages"
import { z } from "zod/v4"

export const Schema = z.object({
	messages: z.array(z.custom<BaseMessage>())
})

export type TState = z.infer<typeof Schema>
