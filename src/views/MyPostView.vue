<script setup>
//Vue-核心
import { onMounted, ref } from 'vue'

//Vue-Router
import { useRouter } from 'vue-router'
const router = useRouter()

//Components
import PostCard from '@/components/PostCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
//Components-loading
const isLoading = ref(true) //判斷是否在loding

//API
import { postCommentData, fetchMemberPost, fetchMemberOnePost, deleteMemberPost } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert.js'
import { useformatTime } from '@/Composables/useformatTime.js'
const { showAlert } = useAlert()
const { formatTime } = useformatTime()

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//forfunction
const searchPost = ref('') //收尋文章關鍵字存取
const getUserPost = ref([]) //取的使用者文章

//back router
const goBack = () => {
  router.back()
}

const getPost = async (timeSort = 'desc') => {
  const res = await fetchMemberPost(timeSort, searchPost.value, userStore.userid, userStore.token)
  if (res.data.data.length === 0 && searchPost.value) {
    showAlert(`沒有找到關於${searchPost.value}的貼文`, 'warning', 1500)
    searchPost.value = ''
    return
  }
  if (res.data.data.length === 0) {
    searchPost.value = ''
    getUserPost.value = ''
    return
  }
  if (searchPost.value) {
    showAlert(`找到關於${searchPost.value}的${res.data.message.length}則貼文`, 'success', 1500)
    searchPost.value = ''
  }
  try {
    getUserPost.value = res.data.message.map((post) => {
      const formattedPostTime = formatTime(post.createdAt)
      post.comments = post.comments.map((comment) => {
        const formattedCommentTime = formatTime(comment.createdAt)
        return {
          ...comment,
          formattedCommentDate: formattedCommentTime,
        }
      })
      return {
        ...post,
        formattedDate: formattedPostTime,
      }
    })
  } catch (error) {
    showAlert(`${error.response.message}`, 'error')
  }
}

const handleSortChange = (event) => {
  const selectedSort = event.target.value // 獲取選中的排序條件
  getPost(selectedSort) // 呼叫 API，傳入對應的排序條件
}

// 提交留言
const submitComment = async (postId, commentText) => {
  if (!commentText || !commentText.trim()) {
    return showAlert('請輸入留言~', 'error', 1500)
  }
  try {
    await postCommentData(postId, commentText, userStore.token)
    updatePostComments(postId)
  } catch (error) {
    console.error(`留言失敗：`, error)
  }
}

//更新留言列表
const updatePostComments = async (postId) => {
  try {
    const data = await fetchMemberOnePost(postId, userStore.token)
    const updateComments = data.comments.map((comment) => ({
      ...comment,
      formattedCommentDate: formatTime(comment.createdAt),
    }))
    const postIndex = getUserPost.value.findIndex((post) => post._id === postId)
    if (postIndex !== -1) {
      getUserPost.value[postIndex].comments = updateComments
    }
  } catch (error) {
    console.log('更新留言區域失敗:', error)
    showAlert('留言更新失敗，請稍後再試', 'error', 1500)
  }
}

//刪除貼文
const deletePost = async (postId) => {
  try {
    await deleteMemberPost(postId, userStore.token)
    getUserPost.value = getUserPost.value.filter((post) => post._id !== postId)
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}

onMounted(async () => {
  try {
    userStore.loadUserInfo()
    await getPost()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <LoadingOverlay :is-loading="isLoading" />
  <div v-if="!isLoading">
    <NavbarCard></NavbarCard>
    <div class="container">
      <div class="row mt-4">
        <main class="col-lg-9">
          <div v-if="!getUserPost?.length">
            <div class="container p-0">
              <button class="btn btn-success rounded-3 mb-2" @click="goBack">
                <i class="bi bi-arrow-left"></i>
              </button>
            </div>
            <div class="custom-card border border-3 border-dark">
              <div class="card-content">目前尚無動態，新增一則貼文吧！</div>
            </div>
          </div>
          <div v-else>
            <div class="col text-center relative mb-3">
              <button class="btn btn-success rounded-3 mb-2 absolute" @click="goBack">
                <i class="bi bi-arrow-left"></i>
              </button>
              <h2 class="fw-bold">您的貼文牆</h2>
            </div>
            <div class="d-flex mb-4">
              <select
                class="form-select w-auto me-2 border border-3 border-dark"
                @change="handleSortChange"
              >
                <option value="desc">最新貼文</option>
                <option value="asc">最舊貼文</option>
                <option value="hot">熱門貼文</option>
              </select>
              <div class="input-group border border-3 border-dark rounded-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="搜尋貼文"
                  v-model="searchPost"
                />
                <button class="btn btn-primary" @click="getPost">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>

            <div class="mb-3" v-for="post in getUserPost" :key="post._id">
              <PostCard
                :post="post"
                @submit-comment="submitComment"
                @delete-post="deletePost"
              ></PostCard>
            </div>
          </div>
        </main>
        <SidebarCard></SidebarCard>
      </div>
    </div>
  </div>
</template>
