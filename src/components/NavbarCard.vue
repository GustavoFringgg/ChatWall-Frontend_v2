<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { useAlert } from '@/Composables/useAlert.js'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const { showAlert } = useAlert()
// userStore.loadUserInfo()

const signOut = async () => {
  showAlert('登出成功，導回登入頁', 'success', 1500)
  setTimeout(() => {
    document.cookie = 'Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    userStore.clearUserInfo()
    router.push({ path: '/' })
  }, 1500)
}

// 判斷螢幕寬度是否小於992px
const isMobile = ref(window.innerWidth < 992)
const handleResize = () => {
  isMobile.value = window.innerWidth < 992
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom border-3 border-dark">
      <div class="container">
        <!-- 左側 LOGO -->
        <RouterLink class="rounded-pill navbar-header fs-4 my-2 text-decoration-none" to="/index"
          >ChatWall雀窩</RouterLink
        >
        <!-- 右側內容 -->
        <div class="d-flex align-items-center">
          <!-- 用戶名稱和圖片 -->
          <div class="dropdown">
            <button
              class="btn btn-light dropdown-toggle d-flex align-items-center"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="userStore.photo"
                alt="User Avatar"
                class="rounded-circle me-2"
                style="width: 45px; height: 45px; object-fit: cover"
              />
              <span class="fs-6">{{ userStore.username }}</span>
            </button>
            <!-- 下拉選單 -->
            <ul class="dropdown-menu" aria-labelledby="userDropdown">
              <li>
                <RouterLink class="dropdown-item text-decoration-none" to="/mypost"
                  >我的貼文牆</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item text-decoration-none" to="/profile"
                  >修改個人資料</RouterLink
                >
              </li>
              <li v-if="isMobile"><hr class="dropdown-divider" /></li>
              <li v-if="isMobile">
                <RouterLink class="btn btn-light w-100 text-start mb-2" to="/userpost"
                  ><i class="bi bi-card-text me-2"></i>張貼動態</RouterLink
                >
              </li>
              <li v-if="isMobile">
                <RouterLink class="btn btn-light w-100 text-start mb-2" to="/myfollowlist"
                  ><i class="bi bi-bell me-2"></i>追蹤名單</RouterLink
                >
              </li>
              <li v-if="isMobile">
                <RouterLink class="btn btn-light w-100 text-start mb-2" to="/mylikelist"
                  ><i class="bi bi-hand-thumbs-up me-2"></i>按讚的文章</RouterLink
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><button type="button" class="dropdown-item" @click="signOut">登出</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped>
.dropdown-menu {
  min-width: 150px;
}

.navbar-header {
  background-color: #0d6efd;
  color: white;
  padding: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: white;
    color: #0d6efd;
  }
}
</style>
