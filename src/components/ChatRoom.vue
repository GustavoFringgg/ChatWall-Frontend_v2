<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import io from 'socket.io-client'
import { useAlert } from '@/Composables/useAlert'
import { getMessages } from '@/apis/message'
import { useUserStore } from '@/stores/userStore.js'
import { useformatTime } from '@/Composables/useformatTime.js'
const { formatTime } = useformatTime()
const { showAlert } = useAlert()
const userStore = useUserStore()
const isChatOpen = ref(false)
const messages = ref([])
const messageText = ref('')
const messageArea = ref(null)
let socket = {}
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    // 等待 DOM 更新後滾動到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  if (messageArea.value) {
    messageArea.value.scrollTop = messageArea.value.scrollHeight
  }
}

onMounted(() => {
  const URL = 'http://localhost:3000/'
  userStore.loadUserInfo()
  socket = io(URL, { transports: ['websocket'] })
  socket.on('chatMessage', (message) => {
    messages.value.push({
      user: {
        name: message.user.username,
        photo: message.user.photo,
      },
      content: message.content,
      formattedDate: new Date().toLocaleString(), // 假設格式化處理
    })
  })
  getMessage()
})

onUnmounted(() => {
  socket?.disconnect()
  console.log('取消連接')
})

watch(messages, () => {
  if (!messageArea.value) return // 確保 messageArea 已經被正確綁定
  // 若卷軸在下方，則有新訊息時，卷軸持續在最下方
  // 判斷是否滾動到底部
  const isScrolledToBottom =
    messageArea.value.scrollTop + messageArea.value.offsetHeight >=
    messageArea.value.scrollHeight - 5
  console.log('isScrolledToBottom', isScrolledToBottom)

  if (isScrolledToBottom) {
    nextTick(() => {
      messageArea.value.scrollTop = messageArea.value.scrollHeight // 滾動到最底部
    })
  }
})
async function getMessage(query) {
  try {
    const { data } = await getMessages(query)
    messages.value = data.data.map((message) => {
      const formattedMessageTime = formatTime(message.createdAt)
      return {
        ...message,
        formattedDate: formattedMessageTime,
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const sendMessage = (user, content) => {
  if (!content) {
    showAlert('要輸入訊息喔', 'error', 2000)
    return
  }
  socket.emit('chatMessage', {
    user: {
      userid: userStore.userid,
      username: userStore.username,
      photo: userStore.photo,
    },
    content,
  })
  messageText.value = ''
  nextTick(() => {
    if (messageArea.value) {
      messageArea.value.scrollTop = messageArea.value.scrollHeight
    }
  })
}
// if (messageText.value.trim()) {
//   messages.value.push({ user: '你', text: messageText.value })
//   messageText.value = ''
// }
// return { isChatOpen, messages, messageText, toggleChat, sendMessage }
</script>

<template>
  <!-- 聊天室按鈕 -->
  <button class="btn btn-primary chat-toggle" @click="toggleChat">聊天室</button>

  <!-- 聊天室面板 -->
  <div
    v-show="isChatOpen"
    class="chat-room border border-dark rounded shadow position-fixed end-0 me-2 bg-white"
    style="bottom: 55px; max-height: 400px; position: relative"
  >
    <div class="chat-header d-flex justify-content-between p-2">
      <h5 class="mb-0">ChatWall聊天室</h5>
      <button class="btn btn-close" @click="toggleChat"></button>
    </div>
    <div
      class="chat-body overflow-auto p-3"
      ref="messageArea"
      style="max-height: calc(100% - 95px); padding-bottom: 80px"
    >
      <div
        class="mb-1"
        :class="{ 'text-end': msg.user.name === userStore.username }"
        v-for="(msg, index) in messages"
        :key="index"
      >
        <div>
          <img
            :src="msg.user.photo"
            alt="user_name"
            class="rounded-circle me-1"
            style="width: 20px; height: 20px"
          />
          <strong>{{ msg.user.name }}</strong>
          <div class="text-wrap text-break">
            {{ msg.content }}
          </div>
          <span class="text-muted small">
            {{ msg.formattedDate }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="chat-footer bg-white m-2"
      style="position: absolute; bottom: 0; left: 0; right: 0; border-top: 1px solid #ccc"
    >
      <div class="input-group mb-2">
        <input
          v-model="messageText"
          class="form-control"
          type="text"
          placeholder="輸入訊息"
          @keyup.enter="sendMessage(userStore.userid, messageText)"
        />
        <button class="btn btn-success" @click="sendMessage(userStore.userid, messageText)">
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-room {
  width: 335px;
  height: 400px;
}
.chat-toggle {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1050;
}

.chat-header {
  background: #0d6efd;
  color: white;
}
</style>
