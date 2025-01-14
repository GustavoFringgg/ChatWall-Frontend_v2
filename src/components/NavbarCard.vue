<script setup>
import { useUserStore } from '@/stores/userStore'
import { useAlert } from '@/Composables/useAlert.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const { showAlert } = useAlert()
userStore.loadUserInfo()

const signOut = async () => {
  document.cookie = 'Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
  console.log('After deletion:', document.cookie) // 確認刪除狀態
  userStore.clearUserInfo()
  showAlert('登出成功，導回登入頁', 'success', 1500)
  setTimeout(() => {
    router.push({ path: '/' })
  }, 1500)
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <!-- 左側 LOGO -->
        <RouterLink class="fs-4 m-0 text-decoration-none" to="/index">ChatWall雀窩</RouterLink>
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
                style="width: 40px; height: 40px"
              />
              <span>{{ userStore.username }}</span>
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
                  >個人資料</RouterLink
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
.navbar {
  border-bottom: 1px solid #ddd;
}
.dropdown-menu {
  min-width: 150px;
}
</style>
