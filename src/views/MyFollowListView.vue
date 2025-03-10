<script setup>
//Vue-核心
import { onMounted, ref } from 'vue'

//Vue-Router
import { useRouter } from 'vue-router'
const router = useRouter()

//Components
import NavbarCard from '@/components/NavbarCard.vue'
import SidebarCard from '@/components/SidebarCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

//Components-loading
const isLoading = ref(true)

//API
import { unFollowMember } from '@/apis'

//Composables
import { useGetUserList } from '@/Composables/useGetUserLikeOrFollowList'
const { getUserFollowList, getUserFollowListData } = useGetUserList()

import { useAlert } from '@/Composables/useAlert.js'
const { showAlert } = useAlert()

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//back router
const goBack = () => {
  router.back()
}

const goToUserPage = (id) => {
  router.push(`/otherpost/${id}`)
}

const toggleUnfollow = async (userId) => {
  try {
    await unFollowMember(userId, userStore.token)
    getUserFollowListData.value = getUserFollowListData.value.filter(
      (list) => list.user._id !== userId,
    )
    userStore.following = userStore.following.filter((following) => following._id !== userId)

    showAlert('已取消追蹤', 'success', 2000)
  } catch (error) {
    console.log('錯誤:', error)
  }
}

onMounted(async () => {
  try {
    userStore.loadUserInfo()
    await getUserFollowList(userStore.token)
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
      <!-- Main Section -->
      <div class="row mt-4">
        <!-- Main Content -->
        <main class="col-lg-9">
          <div v-if="!getUserFollowListData?.length">
            <div class="container p-0">
              <button class="btn btn-success rounded-3 mb-2" @click="goBack">
                <i class="bi bi-arrow-left"></i>
              </button>
            </div>
            <div class="custom-card border border-3 border-dark">
              <div class="card-content">目前沒有追蹤的對象，趕快追蹤一個人吧！</div>
            </div>
          </div>
          <div v-else>
            <div class="row">
              <div class="col text-center relative">
                <button class="btn btn-success rounded-3 mb-2 absolute" @click="goBack">
                  <i class="bi bi-arrow-left"></i>
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
                        style="width: 50px; height: 50px; object-fit: cover"
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

        <SidebarCard></SidebarCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*倒退按鈕*/
.back-button button {
  background-color: transparent;
  border: none;
  font-size: 25px;
  cursor: pointer;
  color: #333;
}
</style>
