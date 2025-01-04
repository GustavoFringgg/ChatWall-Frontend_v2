<script setup>
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
userStore.loadUserInfo()
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- 左側 LOGO -->
        <RouterLink class="fs-4 m-0 text-decoration-none" to="/index">MetaWall</RouterLink>
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
                <RouterLink class="dropdown-item text-decoration-none" to="/index"
                  >我的貼文牆(沒功能)</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item text-decoration-none" to="/profile"
                  >個人資料</RouterLink
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">登出</a></li>
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
