<script setup>
import { ref } from 'vue'

const activeTab = ref('nickname')

function switchTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="container my-5">
    <h2 class="text-center mb-4">修改個人資料</h2>
    <div class="row justify-content-center">
      <!-- Tabs -->
      <div class="col-md-8">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <!-- 暱稱修改 Tab -->
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="nickname-tab"
              data-bs-toggle="tab"
              data-bs-target="#nickname"
              type="button"
              role="tab"
              aria-controls="nickname"
              aria-selected="true"
            >
              暱稱修改
            </button>
          </li>
          <!-- 重設密碼 Tab -->
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="password-tab"
              data-bs-toggle="tab"
              data-bs-target="#password"
              type="button"
              role="tab"
              aria-controls="password"
              aria-selected="false"
            >
              重設密碼
            </button>
          </li>
        </ul>
      </div>

      <!-- Tab Content -->
      <div class="col-md-8 tab-content border border-top-0 p-4">
        <!-- 暱稱修改內容 -->
        <div
          class="tab-pane fade show active"
          id="nickname"
          role="tabpanel"
          aria-labelledby="nickname-tab"
        >
          <form>
            <div class="text-center mb-4">
              <img src="#" alt="頭像" class="rounded-circle" style="width: 120px; height: 120px" />
              <button class="btn btn-dark d-block mx-auto mt-2">上傳大頭照</button>
            </div>
            <div class="mb-3">
              <label for="nickname" class="form-label">暱稱</label>
              <input type="text" class="form-control" id="nickname" placeholder="輸入暱稱" />
            </div>
            <div class="mb-3">
              <label class="form-label">性別</label><br />
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="gender"
                  id="genderMale"
                  value="男"
                />
                <label class="form-check-label" for="genderMale">男</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="gender"
                  id="genderFemale"
                  value="女"
                />
                <label class="form-check-label" for="genderFemale">女</label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">送出更新</button>
          </form>
        </div>

        <!-- 重設密碼內容 -->
        <div class="tab-pane fade" id="password" role="tabpanel" aria-labelledby="password-tab">
          <form>
            <div class="mb-3">
              <label for="currentPassword" class="form-label">目前密碼</label>
              <input
                type="password"
                class="form-control"
                id="currentPassword"
                placeholder="輸入目前密碼"
              />
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">新密碼</label>
              <input
                type="password"
                class="form-control"
                id="newPassword"
                placeholder="輸入新密碼"
              />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">確認密碼</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                placeholder="再次輸入新密碼"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">重設密碼</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-tabs .nav-link {
  border-radius: 0;
}

.nav-tabs .nav-link.active {
  background-color: #007bff;
  color: #fff;
}
.tab-content {
  border: 1px solid #ddd;
  border-radius: 0 0 5px 5px;
  background-color: #f9f9f9;
}
</style>
