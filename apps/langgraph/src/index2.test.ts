import { test, expect } from "vitest";
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod/v4";

const State = z.object({
  my_key: z.string(),
});

// 工厂函数
const createGraph = () => {
  return new StateGraph(State)
    .addNode("node1", () => {
      return { my_key: "node1节点信息" };
    })

    .addNode("node2", () => {
      return { my_key: "node2节点信息" };
    })

    .addNode("node3", (state) => {
      return { my_key: `${state.my_key} -> 节点3处理完毕` };
    })

    .addNode("node4", () => {
      throw new Error("节点4发生的测试错误");
    })

    .addEdge(START, "node1")
    .addEdge("node1", "node2")
    .addEdge("node2", END)
    .addEdge(START, "node3")
    .addEdge("node3", END)
    .addEdge(START, "node4")
    .addEdge("node4", END);
};

test("测试节点1", async () => {
  const builder = createGraph();

  const checkpointer = new MemorySaver();

  const graph = builder.compile({ checkpointer });

  // 拿到了节点1的执行结果
  const result = await graph.nodes["node1"].invoke({
    my_key: "初始值",
  });

  // 断言
  expect(result.my_key).toBe("node1节点信息");
});

test("测试节点3", async () => {
  // 每一个测试用例需要有一个独立的graph
  const builder = createGraph();

  const checkpointer = new MemorySaver();

  const graph = builder.compile({ checkpointer });

  const result = await graph.nodes["node3"].invoke({
    my_key: "aaa",
  });

  expect(result.my_key).toBe("aaa -> 节点3处理完毕");
});

test("测试节点4", async () => {
  // 每一个测试用例需要有一个独立的graph
  const builder = createGraph();

  const checkpointer = new MemorySaver();

  const graph = builder.compile({ checkpointer });

  await expect(
    graph.nodes["node4"].invoke({
      my_key: "bbb",
    })
  ).rejects.toThrow("节点4发生的测试错误");
});
