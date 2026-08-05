<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'

type PartialDataValue = string | number | boolean | null | undefined

interface CustomEventData {
  stage: string
  msg?: string
  progress?: number
  rawData?: number[]
  cleanedData?: number[]
  partial?: Record<string, PartialDataValue>
  finalReport?: string
}

interface StageGroup {
  logs: CustomEventData[]
  progress: number | null
  rawData?: number[]
  cleanedData?: number[]
  partial?: Record<string, PartialDataValue>
  finalReport?: string
}

/*
示例 stages 数据结构：
{
  "fetchData": {
    logs: [
      { stage: "fetchData", msg: "开始获取数据", progress: 10 },
      { stage: "fetchData", msg: "数据获取中", progress: 50 }
    ],
    progress: 100,
    rawData: [10, 20, 30, 40, 50]
  },
  "preprocess": {
    logs: [
      { stage: "preprocess", msg: "开始数据清洗", progress: 20 },
      { stage: "preprocess", msg: "清洗完成", progress: 100 }
    ],
    progress: 100,
    rawData: [10, 20, 30, 40, 50],
    cleanedData: [15, 25, 35, 45, 55]
  },
  "analyze": {
    logs: [
      { stage: "analyze", msg: "开始分析数据", progress: 30 },
      { stage: "analyze", msg: "分析完成", progress: 100 }
    ],
    progress: 100,
    partial: { mean: 35, max: 55 }
  },
  "report": {
    logs: [
      { stage: "report", msg: "生成报告", progress: 80 },
      { stage: "report", msg: "报告完成", progress: 100 }
    ],
    progress: 100,
    finalReport: "数据分析报告：均值为35，最大值为55。"
  }
}
*/
const stages = ref<Record<string, StageGroup>>({}) // 记录每一个阶段的数据
let sse: EventSource | null = null

// 阶段图标
function getIcon(stage: string) {
  switch (stage) {
    case 'fetchData':
      return '📥'
    case 'preprocess':
      return '🧹'
    case 'analyze':
      return '📈'
    case 'report':
      return '📝'
    default:
      return '⚙️'
  }
}

function startStream() {
  // 核心就是建立 SSE 连接
  if (sse) {
    sse.close()
    sse = null
  }

  stages.value = {}

  // 代码来到这里，我们就建立 SSE 连接
  sse = new EventSource('http://localhost:3001/run')

  // 监听对应的事件
  sse.onmessage = (event) => {
    const data: CustomEventData = JSON.parse(event.data)

    // 针对当前的这个阶段做一个初始化
    if (!stages.value[data.stage]) {
      stages.value[data.stage] = {
        logs: [],
        progress: null,
      }
    }

    const group = stages.value[data.stage]! // 将当前阶段的数据取出来

    // 更新日志
    group?.logs.push(data)

    // 更新字段
    if (data.progress) group.progress = data.progress
    if (data.rawData) group.rawData = data.rawData
    if (data.cleanedData) group.cleanedData = data.cleanedData
    if (data.partial) group.partial = data.partial
    if (data.finalReport) group.finalReport = data.finalReport
  }
  sse.onerror = () => {
    console.log('SSE建立失败')
    sse?.close()
  }
}

onBeforeUnmount(() => sse?.close())
</script>

<template>
  <div style="padding: 20px; max-width: 900px; margin: 0 auto">
    <h2>LangGraph 流程实时展示</h2>

    <button @click="startStream" class="btn">开始执行流程</button>

    <div v-for="(group, stage) in stages" :key="stage" class="stage-card">
      <h3 class="stage-title">
        <span class="stage-icon">{{ getIcon(stage) }}</span>
        {{ stage }} 阶段
      </h3>

      <!-- 进度条 -->
      <div v-if="group.progress !== null" class="progress-container">
        <div class="progress-bar" :style="{ width: group.progress + '%' }"></div>
        <span class="progress-text">{{ group.progress }}%</span>
      </div>

      <!-- 日志 -->
      <ul class="log-list">
        <li v-for="(item, idx) in group.logs" :key="idx">
          {{ item.msg }}
        </li>
      </ul>

      <!-- 原始数据展示（蓝色） -->
      <div v-if="group.rawData">
        <strong>原始数据：</strong>
        <div class="number-list">
          <div
            v-for="(n, idx) in group.rawData"
            :key="idx"
            class="number-bar raw-bar"
            :style="{ width: n + '%' }"
          >
            {{ n }}
          </div>
        </div>
      </div>

      <!-- 清洗后的数据展示（绿色） -->
      <div v-if="group.cleanedData">
        <strong>清洗后的数据：</strong>
        <div class="number-list">
          <div
            v-for="(n, idx) in group.cleanedData"
            :key="idx"
            class="number-bar cleaned-bar"
            :style="{ width: n + '%' }"
          >
            {{ n }}
          </div>
        </div>
      </div>

      <!-- 分析结果展示 -->
      <div v-if="group.partial" class="analysis-box">
        <div class="analysis-card">
          <div class="label">均值 (mean)</div>
          <div class="value">{{ group.partial.mean }}</div>
        </div>
        <div class="analysis-card">
          <div class="label">最大值 (max)</div>
          <div class="value">{{ group.partial.max }}</div>
        </div>
      </div>

      <!-- 最终报告 -->
      <div v-if="group.finalReport">
        <strong>最终报告：</strong>
        <pre>{{ group.finalReport }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-bottom: 16px;
  transition: 0.2s;
}
.btn:hover {
  background-color: #66b1ff;
}

.stage-card {
  background: #ffffff;
  padding: 18px;
  margin-top: 20px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.stage-title {
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.stage-icon {
  font-size: 20px;
}

.progress-container {
  display: flex;
  align-items: center;
  height: 14px;
  gap: 6px;
  margin-bottom: 12px;
}
.progress-bar {
  height: 100%;
  background: #67c23a;
  border-radius: 4px;
  transition: width 0.4s ease;
}
.progress-text {
  font-size: 14px;
  font-weight: bold;
}

.log-list {
  padding-left: 20px;
  margin-bottom: 12px;
  color: #555;
}

/* 原始数据 / 清洗后的条形图 */
.number-list {
  margin: 10px 0;
}
.number-bar {
  padding: 4px 6px;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: width 0.3s ease;
  color: white;
  font-size: 14px;
  font-weight: bold;
}
.raw-bar {
  background: #42a5f5;
}
.cleaned-bar {
  background: #66bb6a;
}

/* 分析卡片 */
.analysis-box {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}
.analysis-card {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 10px 14px;
  flex: 1;
  text-align: center;
}
.analysis-card .label {
  font-size: 13px;
  color: #555;
}
.analysis-card .value {
  font-size: 20px;
  font-weight: 600;
  margin-top: 6px;
  color: #333;
}
</style>
