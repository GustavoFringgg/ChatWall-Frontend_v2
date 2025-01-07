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
const isLoading = ref(false)
const signCheck = async () => {
  signInToken.value = document.cookie.replace(/(?:(?:^|.*;\s*)Token\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  if (!signInToken.value) {
    showAlert('請登入', 'error')
    router.push({ path: '/login' })
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
      console.log('ready')
    } else {
      router.push({ path: '/login' })
    }
  } catch (error) {
    console.log(error)
  }
})
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
            <!-- Filter and Search -->
            <div>這是按讚列表的onMounte</div>
          </main>

          <!-- Sidebar -->
          <SidebarCard></SidebarCard>
        </div>
      </div>
    </div>
  </div>
</template>
