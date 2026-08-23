import { test, expect } from "vitest";
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod/v4";

const State = z.object({
  my_key: z.string(),
  step_history: z.array(z.string()).default([]), // 做字段变化的记录，方便观察流程，相当于节点足迹
});

const createGraph = () => {
  return (
    new StateGraph(State)
      .addNode("node1", (state) => ({
        my_key: "node1节点信息",
        step_history: [...state.step_history, "经过node1"],
      }))
      // 节点2
      .addNode("node2", (state) => ({
        my_key: "node2节点信息",
        step_history: [...state.step_history, "经过node2"],
      }))
      // 节点3
      .addNode("node3", (state) => ({
        my_key: "node3节点信息",
        step_history: [...state.step_history, "经过node3"],
      }))
      // 节点4
      .addNode("node4", (state) => ({
        my_key: "node4节点信息",
        step_history: [...state.step_history, "经过node4"],
      }))

      .addEdge(START, "node1")
      .addEdge("node1", "node2")
      .addEdge("node2", "node3")
      .addEdge("node3", "node4")
      .addEdge("node4", END)
  );
};

test("跳过node1，直接从node2开始执行，并在node3停下", async () => {
  // 每一个测试用例需要有一个独立的graph
  const builder = createGraph();

  const checkpointer = new MemorySaver();

  const graph = builder.compile({ checkpointer });

  const config = {
    configurable: {
      thread_id: "test-thread-1",
    },
  };

  // 更新状态：因为要跳过node1，更新一个假的node1节点执行完的状态
  await graph.updateState(
    config,
    {
      my_key: "我是伪造的节点1数据",
      step_history: ["伪造的node1的执行历史"],
    },
    // 这个参数表明当前的这份状态是node1产生的
    // 系统看到这个，就会去找node1的下一个节点
    "node1"
  );

  // 断言
  const result = await graph.getState(config); // 拿到当前最新的状态
  expect(result.next).toEqual(["node2"]); // 下一个节点应该是node2节点
  expect(result.values.my_key).toBe("我是伪造的节点1数据");

  // 接下来要跑到node3停止

  // 第1个参数是null，代表不要新的状态输入，而是使用checkpoint存档里面的状态继续跑
  const result2 = await graph.invoke(null, {
    ...config,
    interruptAfter: ["node3"], // 代表了执行完node3节点后中断
  });

  // 断言
  expect(result2.my_key).toBe("node3节点信息");
  expect(result2.step_history).toEqual([
    "伪造的node1的执行历史",
    "经过node2",
    "经过node3",
  ]);

  // 再次查看当前的状态
  const finalState = await graph.getState(config);
  // 因为目前是在node3中断了，所以下一个节点应该是node4
  expect(finalState.next).toEqual(["node4"]);
});
