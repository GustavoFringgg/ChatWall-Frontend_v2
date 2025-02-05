<script setup>
//Vue-核心
import { onMounted, ref } from 'vue'

//Vue-Router
import { useRouter } from 'vue-router'
const router = useRouter()

//Components
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

//Components-loading
const isLoading = ref(true)

//API
import { fetchUserLikeList, unLikeMemberPost } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert.js'
import { useGetUserList } from '@/Composables/useGetUserLikeOrFollowList'
const { showAlert } = useAlert()
const { getUserLikeList, userLikeListData } = useGetUserList()
import dayjs from 'dayjs'

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//forfunction
// const userLikeListData = ref() //取得個人按讚列表

//back router
const goBack = () => {
  router.back()
}

//確認token是否過期
// const checkSignInStatus = async () => {
//   try {
//     await verifyToken(userStore.token)
//   } catch (error) {
//     showAlert(error.response?.data?.message || '登入驗證失敗', 'error', 2000)
//     router.push({ path: '/' })
//   }
// }

const goToLikePage = (id) => {
  router.push(`/certainpost/${id}`)
}

// 取得使用者按讚的文章列表
// const getUserLikeList = async (token) => {
//   const data = await fetchUserLikeList(token)
//   userLikeListData.value = data.likeList.map((list) => ({
//     ...list,
//     formattedDate: dayjs(list.createdAt).format('YYYY-MM-DD HH:mm'),
//   }))
// }

// 取消使用者按讚的文章
const handleUnlikePost = async (postId, token) => {
  try {
    await unLikeMemberPost(postId, token)
    userLikeListData.value = userLikeListData.value.filter((post) => post._id !== postId)
    showAlert(`已取消讚`, 'success', 1500)
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}

onMounted(async () => {
  try {
    userStore.loadUserInfo()
    await getUserLikeList(userStore.token)
  } catch (error) {
    console.log(error)
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
          <div v-if="!userLikeListData?.length">
            <div class="container p-0">
              <button class="btn btn-success rounded-3 mb-2" @click="goBack">
                <i class="bi bi-arrow-left"></i>
              </button>
            </div>
            <div class="custom-card border border-3 border-dark">
              <div class="card-content">目前沒有按讚的貼文，趕快按讚吧！</div>
            </div>
          </div>
          <div v-else>
            <div class="row">
              <div class="col text-center relative">
                <button class="btn btn-success rounded-3 mb-2 absolute" @click="goBack">
                  <i class="bi bi-arrow-left"></i>
                </button>
                <h2 class="fw-bold">您按讚的文章</h2>
              </div>
            </div>
            <div class="row mt-2" v-for="list in userLikeListData" :key="list._id">
              <div class="col-12">
                <div class="card p-3 shadow-sm border border-3 border-dark">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <img
                        :src="list.user.photo"
                        alt="用戶頭像"
                        class="rounded-circle border"
                        style="width: 50px; height: 50px; object-fit: cover"
                      />
                      <div class="ms-3">
                        <p class="mb-1 fw-bold">{{ list.user.name }}</p>
                        <p class="text-muted mb-0">發文時間：{{ list.formattedDate }}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        class="btn btn-outline-success btn-sm me-1"
                        @click="goToLikePage(list._id)"
                      >
                        查看貼文
                      </button>
                      <button
                        class="btn btn-outline-danger btn-sm"
                        @click="handleUnlikePost(list._id, userStore.token)"
                      >
                        取消按讚
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <SidebarCard></SidebarCard>
      </div>
    </div>
  </div>
</template>
