<script setup>
//Vue
import { onMounted, ref } from 'vue'

//Components
import ChatRoom from '@/components/ChatRoom.vue'
import PostCard from '@/components/PostCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

//Components-loading
const isLoading = ref(true) //判斷是否在loding

//API
import { fetchMemberOnePost, fetchAllPost, postCommentData, updateMemberPost } from '@/apis'

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//Composables
import { useAuth } from '@/Composables/useAuth'
import { useDeletePost } from '@/Composables/useDeletePost'
import { useAlert } from '@/Composables/useAlert.js'
import { useformatTime } from '@/Composables/useformatTime.js'
const { signCheck } = useAuth()
const { deletePost, getUserPost } = useDeletePost()
const { showAlert } = useAlert()
const { formatTime } = useformatTime()

//forfunction
const searchPost = ref('') //收尋文章關鍵字存取

const getPost = async (timeSort = 'desc') => {
  const res = await fetchAllPost(timeSort, searchPost.value, userStore.token)

  if (res.data.data.length === 0) {
    showAlert(`沒有找到關於${searchPost.value}的貼文`, 'warning', 1500)
    searchPost.value = ''
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
    console.log(error)
    showAlert(`${error}`, 'error')
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
    showAlert('此貼文可能被刪除囉，請重新整理', 'error', 2000)
  }
}

//更新留言
const updatePost = async (postId, newContent) => {
  try {
    const post = getUserPost.value.find((p) => p._id === postId)
    if (post) post.content = newContent
    showAlert('貼文修改成功', 'success', 2000)
    await updateMemberPost(postId, newContent, userStore.token)
  } catch (error) {
    showAlert('此貼文可能被刪除囉，請重新整理', 'error', 2000)
  }
}

const updatePostComments = async (postId) => {
  try {
    //取得最新的post貼文
    const data = await fetchMemberOnePost(postId, userStore.token)
    //將貼文的新留言時間格時化
    const updateComments = data.data[0].comments.map((comment) => ({
      ...comment,
      formattedCommentDate: formatTime(comment.createdAt),
    }))
    //本地找到此貼文，並更新新留言
    const postIndex = getUserPost.value.findIndex((post) => post._id === postId)
    if (postIndex !== -1) {
      getUserPost.value[postIndex].comments = updateComments
    }
  } catch (error) {
    console.log('更新留言區域失敗:', error)
    showAlert('留言更新失敗，請稍後再試', 'error', 1500)
  }
}
onMounted(async () => {
  try {
    await signCheck()
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
      <!-- Main Section -->
      <div class="row mt-4">
        <!-- Main Content -->
        <main class="col-lg-9">
          <!-- Filter and Search -->
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
              <input type="text" class="form-control" placeholder="搜尋貼文" v-model="searchPost" />
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
              @update-post="updatePost"
            ></PostCard>
          </div>
        </main>
        <SidebarCard></SidebarCard>
      </div>
    </div>
    <ChatRoom></ChatRoom>
  </div>
</template>
