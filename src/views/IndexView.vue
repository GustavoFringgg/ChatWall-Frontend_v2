<script setup>
import axios from 'axios'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
// import dayjs from 'dayjs'
import ChatRoom from '@/components/ChatRoom.vue'
import PostCard from '@/components/PostCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import { useUserStore } from '@/stores/userStore.js'
import { useformatTime } from '@/Composables/useformatTime.js'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
const { formatTime } = useformatTime()
const userStore = useUserStore()
const { showAlert } = useAlert()
const router = useRouter()
const localurl = 'http://localhost:3000'
const signInToken = ref('') //user token存取
const getUserData = ref('') //user 個人資料存取
const searchPost = ref('') //收尋文章關鍵字存取
const getUserPost = ref([]) //取的使用者文章
const isLoading = ref(true) //判斷是否在loding

const getPost = async (timeSort = 'desc') => {
  console.log('timeSort', timeSort)
  const res = await axios.get(`${localurl}/posts/`, {
    params: { timeSort, keyword: searchPost.value },
  })
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

        // 新增格式化comments時間
        return {
          ...comment,
          formattedCommentDate: formattedCommentTime,
        }
      })
      // 格式化 posts 的時間
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

const signCheck = async () => {
  signInToken.value = document.cookie.replace(/(?:(?:^|.*;\s*)Token\s*\=\s*([^;]*).*$)|^.*$/, '$1')

  if (!signInToken.value) {
    showAlert(`請登入`, 'error', 1500)
    setTimeout(() => {
      router.push({ path: '/' })
    }, 1500)
  }
  try {
    const res = await axios.get(`${localurl}/users/checkout`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`,
      },
    })
    getUserData.value = res.data
    getUserData.value.user.formatTime = formatTime(res.data.user.createdAt)
    userStore.setUserInfo(getUserData.value.user, signInToken.value)
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

//刪除貼文
const deletePost = async (postId) => {
  try {
    const res = await axios.delete(`${localurl}/posts/${postId}/post`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    getPost()
  } catch (error) {
    console.log(error)
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
  <LoadingOverlay :is-loading="isLoading" />
  <div v-if="!isLoading">
    <!-- Header -->
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

          <!-- Posts -->
          <div class="mb-3" v-for="post in getUserPost" :key="post._id">
            <PostCard
              :post="post"
              @submit-comment="submitComment"
              @delete-post="deletePost"
            ></PostCard>
          </div>
        </main>

        <!-- Sidebar -->
        <SidebarCard></SidebarCard>
      </div>
    </div>
    <ChatRoom></ChatRoom>
  </div>
</template>
