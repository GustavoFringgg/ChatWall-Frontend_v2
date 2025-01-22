<script setup>
import axios from 'axios'
import { useRoute } from 'vue-router'
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
const getUserPost = ref([]) //取的使用者文章
const isLoading = ref(true) //判斷是否在loding
const route = useRoute()

const getOnePost = async () => {
  const post_id = route.params.id
  const res = await axios.get(`${localurl}/posts/${post_id}`, {
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

//刪除貼文
const deletePost = async (postId) => {
  try {
    const res = await axios.delete(`${localurl}/posts/${postId}/post`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    setTimeout(() => {
      router.push({ path: '/mylikelist' })
    }, 1500)
  } catch (error) {
    console.log(error)
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
  <LoadingOverlay :is-loading="isLoading" />
  <div v-if="!isLoading">
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
  </div>
</template>
