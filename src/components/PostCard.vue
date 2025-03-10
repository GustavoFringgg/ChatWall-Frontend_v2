<script setup>
import Swal from 'sweetalert2'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { useAlert } from '@/Composables/useAlert.js'
const { showAlert } = useAlert()

import { unLikeMemberPost, likeMemberPost } from '@/apis'
const { showDeleteAlert } = useAlert()
const router = useRouter()
const userStore = useUserStore()

// defineProps(['post'])
const props = defineProps({
  post: Object,
})

//確認貼文是否屬於自己
const isOwner = computed(() => props.post.user._id === userStore.userid)

//確認是否開始編輯
const isEditing = ref(false)

//開始編輯後的內容
const editedContent = ref('')

//開始編輯
const startEditing = () => {
  isEditing.value = true
  editedContent.value = props.post.content
}

// 取消編輯
const cancelEditing = () => {
  isEditing.value = false
  editedContent.value = props.post.content
}

//post內容過長縮減
const maxLength = 100
const isExpanded = ref(false)
const expandContent = computed(() => props.post.content.slice(0, maxLength) + ' ....')
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const emit = defineEmits(['submit-comment', 'delete-post', 'update-post']) // 定義事件
const newComment = ref('')

const handleSubmit = (postId) => {
  emit('submit-comment', postId, newComment.value)
  newComment.value = ''
}

//確認編輯
const handleUpdatePost = () => {
  emit('update-post', props.post._id, editedContent.value)
  isEditing.value = false
}

const handleDeletePost = (postId) => {
  showDeleteAlert().then((result) => {
    if (result.isConfirmed) {
      emit('delete-post', postId)
      Swal.fire({
        title: 'Deleted!',
        text: '此貼文已刪除',
        icon: 'success',
      })
    }
  })
}

const isLiked = ref(props.post.likes?.some((like) => like._id === userStore.userid))
const likeCount = ref(props.post.likes.length)

const toggleLike = async () => {
  try {
    if (isLiked.value) {
      await unLikeMemberPost(props.post._id, userStore.token)
      likeCount.value -= 1
      isLiked.value = false
    } else {
      await likeMemberPost(props.post._id, userStore.token)
      likeCount.value += 1
      isLiked.value = true
    }
  } catch (error) {
    showAlert('此貼文可能被刪除囉，請重新整理', 'error', 2000)
  }
}

const goToUserPage = (id) => {
  router.push(`/otherpost/${id}`)
}
</script>

<template>
  <div class="card border border-3 border-dark">
    <div class="card-body position-relative shadow-lg">
      <div class="d-flex align-items-center mb-3">
        <img
          :src="post.user.photo"
          alt="Avatar"
          class="rounded-circle me-2"
          style="width: 50px; height: 50px; object-fit: cover"
        />
        <div>
          <h6
            @click="goToUserPage(post.user._id)"
            class="m-0"
            style="cursor: pointer; color: black"
          >
            {{ post.user.name }}
          </h6>
          <small class="text-muted"> {{ post.formattedDate }}</small>
        </div>
      </div>
      <div v-if="isEditing">
        <textarea
          v-model="editedContent"
          class="form-control"
          rows="8"
          style="resize: none"
        ></textarea>
        <div class="mt-2">
          <button class="btn btn-success btn-sm me-2" @click="handleUpdatePost">確認修改</button>
          <button class="btn btn-secondary btn-sm" @click="cancelEditing">取消</button>
        </div>
      </div>
      <div v-else>
        <p v-if="post.content.length < maxLength" style="white-space: pre-wrap">
          {{ post.content }}
        </p>
        <p v-else style="white-space: pre-wrap">{{ isExpanded ? post.content : expandContent }}</p>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm rounded-pill"
          v-if="post.content.length > maxLength"
          @click="toggleExpand"
        >
          {{ isExpanded ? '收起來' : '閱讀更多' }}
        </button>
      </div>
      <div v-if="isOwner" class="dropdown position-absolute" style="top: 10px; right: 10px">
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="dropdownMenuButton2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
          <li>
            <button type="button" class="dropdown-item" @click="startEditing()">編輯貼文</button>
          </li>
          <li>
            <button type="button" class="dropdown-item" @click="handleDeletePost(post.id)">
              刪除貼文
            </button>
          </li>
        </ul>
      </div>
      <div v-if="post.image" class="mb-3 img-container border border-3 border-dark text-center">
        <img :src="post.image" alt="Image Preview" class="img-fluid-cos rounded" />
      </div>
      <!-- 按讚區域 -->
      <div class="d-flex align-items-center-3">
        <button type="button" class="btn btn-link text-decoration-none" @click="toggleLike">
          <i v-if="isLiked" class="bi bi-hand-thumbs-up-fill me-2"></i>
          <i v-else class="bi bi-hand-thumbs-up text-secondary me-2"></i>
          <span v-if="!likeCount" class="text-secondary">成為第一個按讚的人吧</span>
          <span v-else>{{ likeCount }} 人</span>
        </button>
      </div>

      <!-- 留言區域 -->
      <div class="card-footer">
        <div class="mb-3 d-flex align-items-center">
          <img
            :src="userStore.photo"
            alt="頭像"
            class="rounded-circle me-2"
            style="width: 40px; height: 40px; object-fit: cover"
          />
          <input
            type="text"
            v-model="newComment"
            class="form-control me-2"
            style="flex: 1"
            placeholder="留言..."
            @keyup.enter="handleSubmit(post._id)"
          />
          <button class="btn btn-primary" @click="handleSubmit(post._id)">留言</button>
        </div>
        <!-- 顯示留言列表 -->
        <ul class="list-group list-group-flush mt-3 comment-list-body gap-3">
          <li
            v-for="comment in post.comments"
            :key="comment.id"
            class="d-flex p-2 rounded-3"
            style="background-color: #f8f6f4"
          >
            <div class="d-flex align-items-center text-center me-2">
              <img
                :src="comment.user.photo"
                alt="userphoto"
                style="width: 35px; height: 35px; object-fit: cover"
                class="rounded-circle me-2"
              />
            </div>
            <div>
              <strong>{{ comment.user.name }}</strong>
              <p class="text-muted mb-0" style="font-size: 12px">
                {{ comment.formattedCommentDate }}
              </p>
              <p class="text-break mb-0">{{ comment.comment }}</p>
            </div>
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
  max-height: 300px;
  overflow-y: auto;
}
</style>
