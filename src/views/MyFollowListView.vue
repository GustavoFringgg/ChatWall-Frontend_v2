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
  console.log(' res.data.followingList', res.data.followingList)
  getUserFollowListData.value = res.data.followingList.map((list) => ({
    ...list,
    formattedDate: dayjs(list.createdAt).format('YYYY-MM-DD HH:mm'),
  }))
  console.log('getUserFollowListData.value', getUserFollowListData.value)
}

const toggleUnfollow = async (userId) => {
  try {
    const res = await axios.delete(`${localurl}/users/${userId}/unfollow`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    getUserFollowListData.value = res.data.followingList
    showAlert(`已取消追蹤`, 'success', 2000)
  } catch (error) {
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}
onMounted(async () => {
  try {
    await signCheck()
    userStore.loadUserInfo()
    if (signInToken.value) {
      await getUserFollowList()
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
  router.push(`/otherpost/${id}`)
}

const goBack = () => {
  history.back()
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
          <div v-if="!getUserFollowListData?.length">
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
              <div class="col text-center relative">
                <button class="btn btn-success rounded-pill mb-2 absolute" @click="goBack">
                  <i class="bi bi-arrow-90deg-left me-2"></i>返回
                </button>
                <h2 class="fw-bold">您追蹤的名單</h2>
              </div>
            </div>
            <!-- 追蹤項目列表 -->
            <div class="row mt-2" v-for="list in getUserFollowListData" :key="list._id">
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
                        <p class="text-muted mb-0">追蹤時間：{{ list.formattedDate }}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        class="btn btn-outline-success btn-sm me-1"
                        @click="goToUserPage(list.user._id)"
                      >
                        查看個人資料
                      </button>
                      <button
                        class="btn btn-outline-danger btn-sm"
                        @click="toggleUnfollow(list.user._id)"
                      >
                        取消追蹤
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

<style scoped>
/* .follow-list-body {
  max-height: 100px;
  overflow-y: auto;
} */

/*倒退按鈕*/
.back-button button {
  background-color: transparent;
  border: none;
  font-size: 25px;
  cursor: pointer;
  color: #333;
}
</style>
