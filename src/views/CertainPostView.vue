<script setup>
//Vue 核心
import { onMounted, ref } from 'vue'

//Vue-Router
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

//Components
import PostCard from '@/components/PostCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

//Components-loading
const isLoading = ref(true) //判斷是否在loding

//API
import { updateMemberPost, fetchMemberOnePost, postCommentData, deleteMemberPost } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert.js'
import { useformatTime } from '@/Composables/useformatTime.js'
const { showAlert } = useAlert()
const { formatTime } = useformatTime()

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//forfunction
const getUserPost = ref([]) //取的使用者文章

const getOnePost = async () => {
  const post_id = route.params.id
  try {
    const res = await fetchMemberOnePost(post_id, userStore.token)
    getUserPost.value = res.message.map((post) => {
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
    showAlert('此貼文可能被刪除囉，將重新導回按讚名單', 'error', 2000)
    router.push('/mylikelist')
  }
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
    setTimeout(() => {
      router.push({ path: '/mylikelist' })
    }, 1500)
  } catch (error) {
    console.log(error)
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
    console.log('更新失敗', error)
  }
}

onMounted(async () => {
  try {
    userStore.loadUserInfo()
    await getOnePost()
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
          <div class="row">
            <div class="col text-center">
              <h2 class="fw-bold">{{ getUserPost[0].user.name }}的文章</h2>
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
  </div>
</template>
