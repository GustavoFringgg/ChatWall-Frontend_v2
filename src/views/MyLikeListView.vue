<script setup>
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
import axios from 'axios'
import dayjs from 'dayjs'
const signInToken = ref('') //user token存取
const { showAlert } = useAlert()
const router = useRouter()
const localurl = 'http://localhost:3000'

const userStore = useUserStore()
const isLoading = ref(true)
const getUserLikeListData = ref() //取得個人按讚列表

const signCheck = async () => {
  signInToken.value = document.cookie.replace(/(?:(?:^|.*;\s*)Token\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  if (!signInToken.value) {
    showAlert('請登入', 'error')
    router.push({ path: '/' })
  }
  try {
    const res = await axios.get(`${localurl}/users/checkout`, {
      headers: {
        Authorization: `Bearer ${signInToken.value}`,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  try {
    await signCheck()
    userStore.loadUserInfo()
    if (signInToken.value) {
      await getUserLikeList()
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

const goToLikePage = (id) => {
  router.push(`/certainpost/${id}`)
}

const getUserLikeList = async () => {
  const res = await axios.get(`${localurl}/users/getLikeList`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })
  console.log('如果沒有喜歡的文章的話', res.data.likeList)
  getUserLikeListData.value = res.data.likeList.map((list) => ({
    ...list,
    formattedDate: dayjs(list.createdAt).format('YYYY-MM-DD HH:mm'),
  }))
  console.log('沒有喜歡文章的getUserLikeListData', getUserLikeListData.value)
}

const toggleUnlike = async (postId) => {
  try {
    const res = await axios.delete(`${localurl}/posts/${postId}/unlikes`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    getUserLikeList()
    showAlert(`已取消讚`, 'success', 1500)
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
          <div v-if="!getUserLikeListData?.length">
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
            <!-- 追蹤項目列表 -->
            <div class="row mt-2" v-for="list in getUserLikeListData" :key="list._id">
              <!-- 單個追蹤項目 -->
              <div class="col-12">
                <div class="card p-3 shadow-sm border border-3 border-dark">
                  <div class="d-flex justify-content-between align-items-center">
                    <!-- 左側內容 -->
                    <div class="d-flex align-items-center">
                      <img
                        :src="list.user.photo"
                        alt="用戶頭像"
                        class="rounded-circle border"
                        style="width: 50px; height: 50px"
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
                      <button class="btn btn-outline-danger btn-sm" @click="toggleUnlike(list._id)">
                        取消按讚
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Sidebar -->
        <SidebarCard></SidebarCard>
      </div>
    </div>
  </div>
</template>
