<script setup>
import { ref, computed } from 'vue'

// 確保 getUserData 與 userStore 已正確初始化
const getUserData = ref({
  data: {
    followers: [
      {
        user: '67793aca7ea6039a2dce3947',
        _id: '677ba4af8cc5a530d32da82d',
      },
    ],
  },
})

const userStore = {
  userid: '67793aca7ea6039a2dce3947',
}

// 使用 computed 進行檢查
const isFollowing = computed(() => {
  const followers = getUserData.value.data?.followers || []
  return followers.some((follower) => follower.user === userStore.userid)
})

// Debug 輸出
console.log('isFollowing:', isFollowing.value)
</script>

<!-- <template>
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
