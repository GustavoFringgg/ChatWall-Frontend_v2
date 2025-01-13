<script setup>
import axios from 'axios'
import { useRoute } from 'vue-router'
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
const getUserPost = ref([]) //取的使用者文章
const isLoading = ref(true) //判斷是否在loding
const comments = ref([]) // 留言列表
const route = useRoute()
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime) // 啟用相對時間插件
dayjs.locale('zh-tw') // 設定為台灣地區（可選）

const getOnePost = async () => {
  const post_id = route.params.id // 從路由中獲取 ID
  const res = await axios.get(`${localurl}/posts/${post_id}`, {
    headers: {
      Authorization: `Bearer ${signInToken.value}`,
    },
  })
  console.log('取的特定貼文的資料', res)
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
    console.error(error)
    showAlert(`${error}`, 'error')
  }
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

    getOnePost()
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
      await getOnePost()
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
      <!-- Header -->
      <NavbarCard></NavbarCard>

      <div class="container">
        <!-- Main Section -->
        <div class="row mt-4">
          <!-- Main Content -->
          <main class="col-lg-9">
            <div class="row">
              <div class="col text-center">
                <h2 class="fw-bold">{{ getUserPost[0].user.name }}的文章</h2>
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
