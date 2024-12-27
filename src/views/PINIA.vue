<!-- <script setup>
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
console.log(userStore.username) // JohnDoe
console.log(userStore.userid) // 12345
</script>

<template>
  <div>{{ userStore.username }}</div>
  <div>{{ userStore.userid }}</div>
  <div>{{ userStore.token }}</div>
  <img :src="userStore.photo" alt="" />
</template> -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!-- 左側 LOGO -->
      <a class="navbar-brand" href="#">Chat!</a>

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
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              class="rounded-circle me-2"
              style="width: 40px; height: 40px"
            />
            <span>1234567</span>
          </button>
          <!-- 下拉選單 -->
          <ul class="dropdown-menu" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#">我的貼文牆</a></li>
            <li><a class="dropdown-item" href="#">個人資料</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#">登出</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar {
  border-bottom: 1px solid #ddd;
}
.dropdown-menu {
  min-width: 150px;
}
</style>
