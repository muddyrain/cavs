<script setup>
import { nextTick, reactive, ref } from "vue"

const input = ref("") // 聊天框内容
const loading = ref(false) // 控制 loading 的显示

const messages = ref([]) // 存储聊天的内容

const chatContainer = ref(null)

// 滚动方法
const scrollHeight = async () => {
	await nextTick()

	chatContainer.value.scrollTo({
		top: chatContainer.value.scrollHeight,
		behavior: "smooth"
	})
}

// 用户聊天
const sendHandler = async () => {
	// TODO
}

// 上传状态显示
const uploadStatus = ref("未上传")

// 上传文件
const onFileChange = async (e) => {
	const file = e.target.files[0] // 拿到用户上传的文件
	e.target.value = ""
	if (!file) return

	// 对上传的文件后缀名做一个防御
	if (!/\.(pdf|md|txt)$/i.test(file.name)) {
		uploadStatus.value = "文件类型仅支持 pdf / md / txt"
		return
	}

	// 代码来到这里，说明文件类型是ok的，可以上传
	uploadStatus.value = `正在上传：${file.name}(${(file.size / 1024 / 1024).toFixed(2)} MB)...`

	try {
		// 进行文件的上传
		const form = new FormData()
		form.append("file", file)

		const res = await fetch("/assets/upload", {
			method: "POST",
			body: form
		})

		const data = await res.json()

		uploadStatus.value = data.message
	} catch (err) {
		console.error(err)
		uploadStatus.value = "上传失败：" + (err?.message || String(err))
	}
}
</script>

<template>
  <div class="container" @keydown.enter="sendHandler">
    <!-- 头部 -->
    <div class="header">
      <h1>RAG实战案例</h1>
      <input type="file" id="upload-element" accept=".pdf,.md,.txt" @change="onFileChange" hidden />
      <span class="upload-status">当前状态：{{ uploadStatus }}</span>
      <label for="upload-element" class="upload-btn">上传文档</label>
    </div>

    <!-- 消息列表 -->
    <div class="chat-container" ref="chatContainer">
      <!-- 渲染 messages 里面的消息 -->
      <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-msg', msg.role]">
        <div class="bubble">
          <span class="role-label">{{ msg.role === "user" ? "🧑‍💻 我" : "🤖 模型" }}</span>
          <div class="text">{{ msg.text }}</div>
        </div>
      </div>
      <!-- loading效果 -->
      <div v-if="loading" class="chat-msg bot">
        <div class="bubble">
          <span class="role-label">🤖 模型</span>
          <div class="text">
            正在思考<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交问题 -->
    <div class="input-area">
      <input type="text" v-model="input" placeholder="请输入您的问题..." />
      <button class="send" @click="sendHandler">发送</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background: #f7f7f7;
}
.header > h1 {
  font-size: 20px;
  font-weight: 100;
  margin: 0;
}

.upload-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: all 0.5s ease;
}

.upload-btn:hover {
  background-color: #0056b3;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.chat-msg {
  display: flex;
  margin-bottom: 12px;
}

.chat-msg.user {
  justify-content: flex-end;
}

.chat-msg.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  line-height: 1.4;
  position: relative;
}

.chat-msg.user .bubble {
  background: #daf1ff;
  color: #333;
  border-bottom-right-radius: 4px;
}

.chat-msg.bot .bubble {
  background: #e6e6e6;
  color: #222;
  border-bottom-left-radius: 4px;
}

.input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: #fff;
}

.input-area input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
}

.input-area button {
  margin-left: 10px;
  padding: 10px 18px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.input-area button:hover {
  background-color: #0056b3;
}

.input-area button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.dot {
  animation: blink 1s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

.upload-status {
  margin-left: 12px;
  color: #666;
  font-size: 14px;
}
</style>
