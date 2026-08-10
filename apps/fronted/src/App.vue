<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'

interface MessageChunk {
  content: string // token 内容
}

interface Metadata {
  tags?: string[]
  [key: string]: unknown
}

interface StreamEvent {
  msg: MessageChunk
  metadata: Metadata
}

const topic = ref<string>('') // 初始为空，等待用户输入
const jokeTokens = ref<string>('') // 输出在左边
const poemTokens = ref<string>('') // 输出在右边

let sse: EventSource | null = null

function startStream() {
  // 1. 获取当前用户在输入框输入的内容
  const currentTopic = topic.value.trim()

  if (!currentTopic) {
    window.alert('请先输入一个主题，例如猫、狗....')
    return
  }

  jokeTokens.value = ""
  poemTokens.value = ""

  // 代码来到这里，说明输入框有东西

  // 建立SSE连接
  if (sse) {
    sse.close()
    sse = null
  }

  const url = `http://localhost:3002/stream-messages?topic=${encodeURIComponent(currentTopic)}`
  sse = new EventSource(url)

  sse.onmessage = (ev) => {
    const data: StreamEvent = JSON.parse(ev.data);

    const { msg, metadata } = data;

    // 关键：根据metadata上面的tag来判断当前传递过来的token是哪一个模型
    if(metadata.tags?.includes('joke')){
      // 说明是笑话的token
      jokeTokens.value += msg.content;
    }

    if(metadata.tags?.includes('poem')){
      // 说明是诗歌的token
      poemTokens.value += msg.content;
    }
  }
  sse.onerror = () => {
    console.log('SSE连接失败！')
    sse?.close()
  }
}
onBeforeUnmount(() => sse?.close())
</script>

<template>
  <div class="page">
    <h2>按 Tags 分频道显示 LLM Token</h2>

    <div class="controls">
      <input
        v-model="topic"
        class="topic-input"
        type="text"
        placeholder="请输入主题，例如：猫、编程、周末..."
      />
      <button class="btn" @click="startStream">执行</button>
    </div>

    <div class="panels">
      <div class="panel">
        <h3>笑话</h3>
        <pre class="output">{{ jokeTokens }}</pre>
      </div>

      <div class="panel">
        <h3>诗歌</h3>
        <pre class="output">{{ poemTokens }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.topic-input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.panels {
  display: flex;
  gap: 20px;
}

.panel {
  flex: 1;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #67c23a;
}

.output {
  white-space: pre-wrap;
  background: #f2f2f2;
  padding: 12px;
  border-radius: 6px;
  min-height: 200px;
}
</style>
