<script setup>
//Vue-核心
import { onMounted, ref } from 'vue'

//Vue-Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

//APIS
import {
  postCommentData,
  followMember,
  unFollowMember,
  fetchMemberData,
  fetchMemberPost,
  fetchMemberOnePost,
  deleteMemberPost,
} from '@/apis'

//Components
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import PostCard from '@/components/PostCard.vue'
//Components-loading
const isLoading = ref(true) //判斷是否在loding

//Composables
import { useAlert } from '@/Composables/useAlert.js'
import { useformatTime } from '@/Composables/useformatTime.js'
const { showAlert } = useAlert()
const { formatTime } = useformatTime()

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//forfunction
const getUserData = ref('') //user 個人資料存取
const getUserPost = ref([]) //取的使用者文章
const searchPost = ref('') //收尋文章關鍵字存取
const isFollowing = ref(false) //判斷有無追蹤
const followersCount = ref(0)
const userId = route.params.id // 從路由中獲取 ID

//back router
const goBack = () => {
  router.back()
}

const getOtherUserData = async () => {
  try {
    const res = await fetchMemberData(userId, userStore.token)
    getUserData.value = res.data
    followersCount.value = getUserData.value.data.followers.length
    isFollowing.value = getUserData.value.data?.followers.some(
      (followers) => followers.user === userStore.userid,
    )
  } catch (error) {
    console.log('error', error)
  }
}

//取得貼文
const getPost = async (timeSort = 'desc') => {
  const res = await fetchMemberPost(timeSort, searchPost.value, userId, userStore.token)
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
    getUserPost.value = res.data.message?.map((post) => {
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
  const selectedSort = event.target.value
  getPost(selectedSort)
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
    showAlert(`${error.response.data.message}`, 'error', 1500)
  }
}

//更新留言列表
const updatePostComments = async (postId) => {
  try {
    const data = await fetchMemberOnePost(postId, userStore.token)
    const updateComments = data.message[0].comments.map((comment) => ({
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

//追蹤他人
const toggleFollow = async () => {
  isFollowing.value = !isFollowing.value
  try {
    if (isFollowing.value) {
      await followMember(userId, userStore.token)
      followersCount.value += 1
      userStore.following.length += 1
      showAlert('已追蹤~~', 'success', 1500)
    } else {
      await unFollowMember(userId, userStore.token)
      followersCount.value -= 1
      userStore.following.length -= 1
      showAlert('已取消追蹤~~', 'success', 1500)
    }
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}

onMounted(async () => {
  try {
    userStore.loadUserInfo()
    await getPost()
    await getOtherUserData()
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
          <button class="btn btn-success rounded-3 mb-2" @click="goBack">
            <i class="bi bi-arrow-left"></i>
          </button>

          <div class="header-container mb-3 border border-3 border-dark rounded-3">
            <div class="user-info">
              <img
                :src="getUserData.data.photo"
                alt="Avatar"
                class="rounded-circle me-2"
                style="width: 50px; height: 50px"
              />
              <span class="username pe-2">{{ getUserData.data.name }}</span>
              <span v-if="followersCount === 0" class="user-followers">目前還沒有人追蹤~~</span>
              <span v-else class="user-followers">{{ followersCount }} 人追隨</span>
            </div>

            <div v-if="getUserData.data._id !== userStore.userid">
              <button class="btn btn-warning rounded-pill" @click="toggleFollow">
                {{ isFollowing ? '已追隨' : '追隨' }}
              </button>
            </div>
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
            ></PostCard>
          </div>
        </main>

        <SidebarCard></SidebarCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 外層容器 */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
}

/* 左側：回退按鈕 */
.back-button button {
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #333;
}

/* 中間：用戶資訊 */
.user-info {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.username {
  font-size: 18px;
  font-weight: bold;
}

.user-followers {
  font-size: 14px;
  color: #666;
}

/* 右側：操作按鈕 */
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.follow-button {
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
</style>
