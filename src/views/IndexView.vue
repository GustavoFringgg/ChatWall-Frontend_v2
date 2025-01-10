<script setup>
import axios from 'axios'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
import dayjs from 'dayjs'
import PostCard from '@/components/PostCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import { useUserStore } from '@/stores/userStore'
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
const comments = ref([]) // 留言列表

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime) // 啟用相對時間插件
dayjs.locale('zh-tw') // 設定為台灣地區（可選）

const getPost = async (timeSort = 'desc') => {
  const res = await axios.get(`${localurl}/posts/`, {
    params: { timeSort, keyword: searchPost.value },
  })
  comments.value = res.data.message
  try {
    getUserPost.value = res.data.message.map((post) => {
      const postTime = dayjs(post.createdAt)
      const now = dayjs()

      // 計算時間差
      const diffMinutes = now.diff(postTime, 'minute')
      const diffHours = now.diff(postTime, 'hour')
      const diffSeconds = now.diff(postTime, 'second')

      const formattedTime =
        diffSeconds < 60
          ? `${diffSeconds}秒鐘前`
          : diffMinutes < 60
            ? `${diffMinutes} 分鐘前`
            : diffHours < 24
              ? `${diffHours} 小時前`
              : postTime.format('YYYY-MM-DD HH:mm')

      return {
        ...post,
        formattedDate: formattedTime,
      }
    }) // 格式化日期
    console.log('    getUserPost.value', getUserPost.value)
  } catch (error) {
    showAlert(`${comments.value}`, 'error')
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
    router.push({ path: '/login' })
  }
  try {
    const res = await axios.get(`${localurl}/users/checkout`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`,
      },
    })
    getUserData.value = res.data
    userStore.setUserInfo(getUserData.value.user, signInToken.value)
    getUserId.value = res.data.user._id
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error')
    router.push({ path: '/' })
    // setTimeout(() => {
    //   nextTick(() => {
    //     location.reload() // 強制刷新頁面，保證渲染完成後再重新加載
    //   })
    // }, 500)
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
    // const postItem = post.find((post) => post.id === postId)
    // if (postItem) {
    //   postItem.comments.push(res.data.comment)
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
    console.log('這是Index的onMounted')
    userStore.loadUserInfo()
    if (signInToken.value) {
      await getPost()
    } else {
      router.push({ path: '/' })
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-text">載入中...</div>
    </div>
    <div v-else>
      <!-- <header class="row align-items-center border-bottom border-3 border-dark p-3 bg-white">
        <div class="col">
          <h1 class="fs-4 m-0">MetaWall</h1>
          <RouterLink class="fs-4 m-0" to="/index">MetaWall</RouterLink>
        </div>
        <div class="col-auto d-flex align-items-center">
          <span class="me-2">{{ userStore.username }}</span>

          <img
            :src="userStore.photo"
            alt="Avatar"
            class="rounded-circle"
            style="width: 40px; height: 40px"
          />
        </div>
      </header> -->
      <!-- Header -->
      <NavbarCard></NavbarCard>

      <div class="container">
        <!-- Main Section -->
        <div class="row mt-4">
          <!-- Main Content -->
          <main class="col-lg-9">
            <!-- Filter and Search -->
            <div class="d-flex mb-4">
              <select class="form-select w-auto me-2" @change="handleSortChange">
                <option value="desc">最新貼文</option>
                <option value="asc">最舊貼文</option>
                <option value="hot">熱門貼文</option>
              </select>
              <div class="input-group">
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
  </div>
</template>
