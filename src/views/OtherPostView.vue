<script setup>
// 接收路由參數
import { useRoute } from 'vue-router'
import NavbarCard from '@/components/NavbarCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import PostCard from '@/components/PostCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
const route = useRoute()
const userId = route.params.id // 從路由中獲取 ID

import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/userStore'
import { useformatTime } from '@/Composables/useformatTime.js'
const { formatTime } = useformatTime()
const userStore = useUserStore()
const { showAlert } = useAlert()
const router = useRouter()
const localurl = 'http://localhost:3000'
const signInToken = ref('') //user token存取
const getUserData = ref('') //user 個人資料存取
const getUserId = ref('') //user 個人id存取
const searchPost = ref('') //收尋文章關鍵字存取
const getUserPost = ref([]) //取的使用者文章
const isLoading = ref(true) //判斷是否在loding

const isFollowing = ref(false) //判斷有無追蹤
const followersCount = ref(0)
const getOtherUserData = async () => {
  try {
    const res = await axios.get(`${localurl}/users/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`,
      },
    })
    getUserData.value = res.data
    followersCount.value = getUserData.value.data.followers.length
    console.log('followersCount.value', followersCount.value)
    console.log('function裡面的getUserData-followers', getUserData.value.data.followers)
    console.log('userStore.userid:', userStore.userid)
    isFollowing.value = getUserData.value.data?.followers.some(
      (followers) => followers.user === userStore.userid,
    )
  } catch (error) {
    console.log('error', error)
  }
}
const getPost = async (timeSort = 'desc') => {
  const res = await axios.get(`${localurl}/posts/${userId}/user`, {
    params: { timeSort, keyword: searchPost.value },
    headers: {
      Authorization: `Bearer ${signInToken.value}`,
    },
  })

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
    }) // 格式化日期
  } catch (error) {
    showAlert(`${error}`, 'error')
  }
}

const handleSortChange = (event) => {
  const selectedSort = event.target.value // 獲取選中的排序條件
  getPost(selectedSort) // 呼叫 API，傳入對應的排序條件
}

const signCheck = async () => {
  signInToken.value = document.cookie.replace(/(?:(?:^|.*;\s*)Token\s*\=\s*([^;]*).*$)|^.*$/, '$1')

  if (!signInToken.value) {
    showAlert(`請登入`, 'error')
    router.push({ path: '/' })
  }
  try {
    const res = await axios.get(`${localurl}/users/checkout`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`,
      },
    })
    getUserId.value = res.data.user._id
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error')
    router.push({ path: '/' })
  }
}

// 提交留言

const submitComment = async (postId, commentText) => {
  if (!commentText || !commentText.trim()) {
    alert('請輸入留言！')
    return
  }
  try {
    const res = await axios.post(
      `${localurl}/posts/${postId}/comment`,
      { comment: commentText },
      {
        headers: {
          Authorization: `Bearer ${signInToken.value}`,
        },
      },
    )

    // 將新留言加入到對應的貼文留言列表中
    // const post = post.value.find((post) => post.id === postId)
    // if (post) {
    //   post.comments.push(res.data.comment)
    // }

    getPost()
  } catch (error) {
    console.error(`留言失敗：`, error)
  }
}
//
onMounted(async () => {
  try {
    await signCheck()
    // const userStore = useUserStore()
    // userStore.loadUserInfo()
    if (signInToken.value) {
      await getPost()
      await getOtherUserData()
    } else {
      router.push({ path: '/' })
    }
  } finally {
    isLoading.value = false
  }
})

const goBack = () => {
  // 返回上一頁邏輯
  history.back()
}

const toggleFollow = async () => {
  isFollowing.value = !isFollowing.value
  try {
    if (isFollowing.value) {
      const res = await axios.post(
        `${localurl}/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        },
      )
      followersCount.value += 1
    } else {
      console.log('here')
      const res = await axios.delete(
        `${localurl}/users/${userId}/unfollow`,

        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        },
      )
      console.log('res', res)
      followersCount.value -= 1
    }
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}
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
          <div class="back-button">
            <button @click="goBack">⬅ 返回</button>
          </div>
          <div class="header-container mb-3">
            <!-- 左側 回退按鈕 -->

            <!-- 中間 主要資訊 -->
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

            <!-- 右側 操作按鈕 -->
            <div class="actions" v-if="getUserData.data._id !== userStore.userid">
              <button class="follow-button" @click="toggleFollow">
                {{ isFollowing ? '已追隨' : '追隨' }}
              </button>
            </div>
          </div>
          <!-- Filter and Search -->
          <div class="d-flex mb-4">
            <select class="form-select w-auto me-2" @change="handleSortChange">
              <option value="desc">最新貼文</option>
              <option value="asc">最舊貼文</option>
              <option value="hot">熱門貼文</option>
            </select>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="搜尋貼文" v-model="searchPost" />
              <button class="btn btn-primary" @click="getPost">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <!-- Posts -->
          <div class="mb-3" v-for="post in getUserPost" :key="post._id">
            <PostCard :post="post" :userId="getUserId" @submit-comment="submitComment"></PostCard>
          </div>
        </main>

        <!-- Sidebar -->
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
