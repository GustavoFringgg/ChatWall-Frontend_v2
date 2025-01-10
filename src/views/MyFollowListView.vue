<script setup>
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
import axios from 'axios'
const signInToken = ref('') //user token存取
const { showAlert } = useAlert()
const router = useRouter()
const localurl = 'http://localhost:3000'
const getUserData = ref('') //user 個人資料存取
const userStore = useUserStore()
const isLoading = ref(true)
const getUserFollowListData = ref() //取得個人追蹤列表
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

const getUserFollowList = async () => {
  const res = await axios.get(`${localurl}/users/getFollowingList`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })
  getUserFollowListData.value = res.data.followingList
  console.log('追蹤列表List', getUserFollowListData.value)
}

onMounted(async () => {
  try {
    await signCheck()
    await getUserFollowList()
    console.log('這是追蹤列表的onMounted')
    // userStore.loadUserInfo()
    if (signInToken.value) {
      console.log('ready')
    } else {
      router.push({ path: '/' })
    }
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

const goToUserPage = (id) => {
  router.push(`/otherpost/${id}`) // 跳轉到 URL，並附上 ID
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
            <div class="row">
              <div class="col text-center">
                <h2 class="fw-bold">追蹤名單</h2>
              </div>
            </div>

            <!-- 追蹤項目列表 -->
            <div
              class="row mt-2 follow-list-body"
              v-for="list in getUserFollowListData"
              :key="list._id"
            >
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
                        <p class="text-muted mb-0">追蹤時間：2025-01-07 06:45</p>
                      </div>
                    </div>
                    <div>
                      <button
                        class="btn btn-outline-success btn-sm me-1"
                        @click="goToUserPage(list.user._id)"
                      >
                        查看個人資料
                      </button>
                      <button class="btn btn-outline-danger btn-sm">取消追蹤</button>
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

<style scoped>
.follow-list-body {
  max-height: 400px;
  overflow-y: auto;
}
</style>
