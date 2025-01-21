<script setup>
import { useUserStore } from '@/stores/tempStore..js'
const userStore = useUserStore()
</script>

<template>
  <aside class="col-lg-3">
    <div class="card border border-3 border-dark">
      <div class="card-body text-center">
        <RouterLink class="btn btn-primary w-100 mb-3 text-decoration-none" to="/userpost"
          >張貼動態</RouterLink
        >
        <div class="d-flex flex-column align-items-start">
          <div class="d-flex align-items-center mb-3">
            <!-- test start-->
            <div
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <img
                :src="userStore.photo"
                alt="Avatar"
                class="rounded-circle me-2"
                style="width: 50px; height: 50px"
              />
              <span>{{ userStore.username }}</span>
            </div>

            <div
              class="offcanvas offcanvas-end"
              tabindex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div class="offcanvas-header">
                <h5 id="offcanvasRightLabel">{{ userStore.username }}的個人資料</h5>
                <button
                  type="button"
                  class="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div class="offcanvas-body">
                <div>姓名:{{ userStore.username }}</div>
                <div>
                  <img
                    :src="userStore.photo"
                    alt="userphoto"
                    class="rounded-circle mt-2 me-2"
                    style="width: 200px; height: 200px"
                  />
                </div>
                <div>註冊時間:{{ userStore.formatTime }}</div>

                <div>粉絲{{ userStore.followers.length }}</div>
                <div>追蹤人數{{ userStore.following.length }}</div>
              </div>
            </div>
            <!-- test end -->
          </div>
          <RouterLink class="btn btn-light w-100 text-start mb-2" to="/myfollowlist"
            ><i class="bi bi-bell me-2"></i>追蹤名單</RouterLink
          >
          <RouterLink class="btn btn-light w-100 text-start mb-2" to="/mylikelist"
            ><i class="bi bi-hand-thumbs-up me-2"></i>我按讚的文章</RouterLink
          >
        </div>
      </div>
    </div>
  </aside>
</template>
