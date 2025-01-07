<script setup>
import { useUserStore } from '@/stores/userStore'
const userSotre = useUserStore()
</script>

<template>
  <aside class="col-lg-3">
    <div class="card">
      <div class="card-body text-center">
        <RouterLink class="btn btn-primary w-100 mb-3 text-decoration-none" to="/userpost"
          >張貼動態</RouterLink
        >
        <div class="d-flex flex-column align-items-start">
          <div class="d-flex align-items-center mb-3">
            <img
              :src="userSotre.photo"
              alt="Avatar"
              class="rounded-circle me-2"
              style="width: 50px; height: 50px"
            />
            <span>{{ userSotre.username }}</span>
          </div>
          <RouterLink class="btn btn-light w-100 text-start mb-2" to="/myfollowlist"
            ><i class="bi bi-bell"></i>追蹤名單</RouterLink
          >
          <RouterLink class="btn btn-light w-100 text-start mb-2" to="/mylikelist"
            ><i class="bi bi-hand-thumbs-up"></i>我按讚的文章</RouterLink
          >
        </div>
      </div>
    </div>
  </aside>
</template>
