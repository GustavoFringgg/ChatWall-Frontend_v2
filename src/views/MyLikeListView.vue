<script setup>
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
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
const getUserData = ref('') //user 個人資料存取
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
    getUserData.value = res.data
    userStore.setUserInfo(getUserData.value.user, signInToken.value)
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  try {
    await signCheck()
    console.log('這是按讚列表的onMounted')
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
  // 返回上一頁邏輯
  history.back()
}

const goToLikePage = (id) => {
  router.push(`/certainpost/${id}`) // 跳轉到 URL，並附上 postID
}

const getUserLikeList = async () => {
  const res = await axios.get(`${localurl}/users/getLikeList`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })

  getUserLikeListData.value = res.data.likeList.map((list) => ({
    ...list,
    formattedDate: dayjs(list.createdAt).format('YYYY-MM-DD HH:mm'),
  }))
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
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-text">載入中...</div>
    </div>
    <div v-else>
      <NavbarCard></NavbarCard>
      <div class="container">
        <!-- Main Section -->
        <div class="row mt-4">
          <!-- Main Content -->
          <main class="col-lg-9">
            <div v-if="!getUserLikeListData?.length">
              <div class="text-center mt-5 d-flex justify-content-center">
                <div class="back-button text-center">
                  <button @click="goBack">⬅ 返回</button>
                </div>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/DALL%C2%B7E%202025-01-10%2016.19.28%20-%20A%20minimalistic%20web%20design%20with%20only%20the%20text%20'No%20Following'%20in%20bold%2C%20clean%20font%20at%20the%20exact%20center.%20The%20background%20is%20a%20plain%20soft%20yellow%20(%23FFF9DB)%2C%20.webp?alt=media&token=b91934d5-b82a-4ff1-b134-aa4e58d733bb"
                  alt=""
                  class="w-50 h-50"
                />
              </div>
            </div>
            <div v-else>
              <div class="row">
                <div class="col text-center">
                  <h2 class="fw-bold">{{ userStore.username }}按讚的文章</h2>
                </div>
              </div>
              <!-- 追蹤項目列表 -->
              <div class="row mt-2" v-for="list in getUserLikeListData" :key="list._id">
                <!-- 單個追蹤項目 -->
                <div class="col-12">
                  <div class="card p-3 shadow-sm">
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
                        <button
                          class="btn btn-outline-danger btn-sm"
                          @click="toggleUnlike(list._id)"
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

          <!-- Sidebar -->
          <SidebarCard></SidebarCard>
        </div>
      </div>
    </div>
  </div>
</template>
