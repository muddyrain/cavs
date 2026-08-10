// 演示getStateHistory方法
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod/v4";

// 定义状态结构
const State = z.object({
  foo: z.string().optional(),
  bar: z.string().optional(),
});

// 创建checkpointer：checkpoint存储器
const checkpointer = new MemorySaver();

// 构建图
const graph = new StateGraph(State)
  .addNode("nodeA", () => {
    console.log("正在执行节点A");
    return { foo: "foo" };
  })
  .addNode("nodeB", () => {
    console.log("正在执行节点B");
    return { bar: "bar" };
  })
  .addEdge(START, "nodeA")
  .addEdge("nodeA", "nodeB")
  .addEdge("nodeB", END)
  .compile({
    checkpointer, // 将检查点存储器和图绑定到一起了，回头图产生的检查点就会存储到绑定的checkpointer里面
  });

async function main() {
  const config = {
    configurable: {
      thread_id: "user_001",
    },
  };

  await graph.invoke({}, config);

  for await (const cp of graph.getStateHistory(config)) {
    console.log("===================");
    console.log(cp);
  }
}
main();
