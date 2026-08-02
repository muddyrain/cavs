// 路由节点
// 根据intent上游节点更新的intent的状态值
// 导航到不同的下一个节点
import type { T_travelSchema } from "../../../states/index.ts";

export function router(state: T_travelSchema): string {
  const intent = state.intent;
  if (intent === "weather") return "weather";
  else if (intent === "ticket") return "ticket";
  return "chat";
}
