// 演示getState方法获取对应checkpoint_id的状态
import { StateGraph, START, END, MemorySaver, type CheckpointTuple, } from "@langchain/langgraph";
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

  // 上面这一行代码执行完之后，就有对应的检查点了
  const cps: CheckpointTuple[] = [];
  for await (const cp of checkpointer.list(config)) {
    cps.push(cp);
  }

  // 现在cps就存储了一系列的检查点

  // 查看最新的checkpoint
  const snapshot = await graph.getState({
    configurable: {
        thread_id: "user_001",
        checkpoint_id: cps[0].checkpoint.id
      },
  });

  console.log(snapshot); // 就是A节点的检查点快照
}
main();
