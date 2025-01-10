<script setup>
import axios from 'axios'
import { defineProps, ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
const router = useRouter()
const userStore = useUserStore()
const localurl = 'http://localhost:3000'
// defineProps(['post'])
const props = defineProps({
  post: Object, // 接收父層傳遞的 post 資料
  userId: String,
})

const emit = defineEmits(['submit-comment']) // 定義事件
const newComment = ref('') // 子元件內部儲存新留言
// 點擊按鈕觸發事件，將 post ID 和留言內容發送給父層
const handleSubmit = () => {
  emit('submit-comment', props.post._id, newComment.value)
  newComment.value = '' // 清空留言框
}

const isLiked = ref(props.post.likes?.some((like) => like._id === userStore.userid))
const likeCount = ref(props.post.likes.length)
// console.log(likeCount.value)

const toggleLike = async () => {
  try {
    if (isLiked.value) {
      const res = await axios.delete(`${localurl}/posts/${props.post._id}/unlikes`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      })
      likeCount.value -= 1
      isLiked.value = false
      console.log('togglelike-res', res)
    } else {
      await axios.post(
        `${localurl}/posts/${props.post._id}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        },
      )
      likeCount.value += 1
      isLiked.value = true
    }
  } catch (error) {
    console.log('操作錯誤', error)
  }
}

//
const goToUserPage = (id) => {
  router.push(`/otherpost/${id}`) // 跳轉到 URL，並附上 ID
}
</script>

<template>
  <div class="card">
    <div class="card-body border-style">
      <div class="d-flex align-items-center mb-3">
        <img
          :src="post.user.photo"
          alt="Avatar"
          class="rounded-circle me-2"
          style="width: 50px; height: 50px"
        />
        <div>
          <span @click="goToUserPage(post.user._id)" style="cursor: pointer; color: blue">
            {{ post.user.name }}
          </span>
          <h6 class="m-0">{{ post.user.name }}</h6>
          <small class="text-muted"> {{ post.formattedDate }}</small>
        </div>
      </div>
      <p>{{ post.content }}</p>
      <img :src="post.image" class="img-fluid rounded" v-if="post.image" />
      <!-- 按讚區域 -->
      <div class="d-flex align-items-center-3">
        <button type="button" class="btn btn-link text-decoration-none" @click="toggleLike">
          <span v-if="isLiked" class="text-primary">
            <i class="bi bi-hand-thumbs-up-fill"></i> {{ likeCount }}</span
          >
          <span v-else class="text-primary">
            <i class="bi bi-hand-thumbs-up"></i> {{ likeCount }}</span
          >
        </button>
      </div>

      <!-- 留言區域 -->
      <div class="card-footer">
        <div class="mb-3">
          <input type="text" v-model="newComment" class="form-control" placeholder="留言..." />
        </div>
        <button class="btn btn-primary" @click="handleSubmit(post._id)">留言</button>
        <!-- 顯示留言列表 -->
        <ul class="list-group list-group-flush mt-3 comment-list-body">
          <li v-for="comment in post.comments" :key="comment.id" class="list-group-item">
            <img :src="comment.user.photo" alt="" style="width: 30px; height: 30px" />{{
              comment.user.name
            }}:
            <strong>{{ comment.comment }}</strong>
            <span class="text-muted"> {{ comment.createdAt }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
.text-primary {
  color: #0d6efd;
}
.text-secondary {
  color: #6c757d;
}

.comment-list-body {
  /*留言的區塊*/
  max-height: 200px;
  overflow-y: auto;
}
</style>
