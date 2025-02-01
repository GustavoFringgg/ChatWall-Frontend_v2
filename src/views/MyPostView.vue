<script setup>
import axios from 'axios'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
import PostCard from '@/components/PostCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useUserStore } from '@/stores/userStore.js'
import { useformatTime } from '@/Composables/useformatTime.js'
const { formatTime } = useformatTime()
const userStore = useUserStore()
const { showAlert } = useAlert()
const router = useRouter()
const localurl = 'http://localhost:3000'
const signInToken = ref('') //user token存取
const searchPost = ref('') //收尋文章關鍵字存取
const getUserPost = ref([]) //取的使用者文章
const isLoading = ref(true) //判斷是否在loding

const getPost = async (timeSort = 'desc') => {
  const res = await axios.get(`${localurl}/posts/${userStore.userid}/user`, {
    params: { timeSort, keyword: searchPost.value },
    headers: {
      Authorization: `Bearer ${signInToken.value}`,
    },
  })
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
    }) // 格式化日期
    console.log('沒有貼文的getUserPost.value', getUserPost.value)
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
    // const post = post.value.find((post) => post.id === postId)
    // if (post) {
    //   post.comments.push(res.data.comment)
    // }

    getPost()
  } catch (error) {
    console.error(`留言失敗：`, error)
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
    console.log('傳回來的deletePost', res)
    getPost()
  } catch (error) {
    console.log(error)
  }
}

//
onMounted(async () => {
  try {
    await signCheck()
    console.log('這是onMounted')
    const userStore = useUserStore()
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

const goBack = () => {
  history.back()
}
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
              <PostCard
                :post="post"
                @submit-comment="submitComment"
                @delete-post="deletePost"
              ></PostCard>
            </div>
          </div>
        </main>

        <!-- Sidebar -->
        <SidebarCard></SidebarCard>
      </div>
    </div>
  </div>
</template>
