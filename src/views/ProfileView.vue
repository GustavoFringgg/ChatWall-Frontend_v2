<script setup>
import axios from 'axios'
import { ref } from 'vue'
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useAlert } from '@/Composables/useAlert'
const router = useRouter()
const userStore = useUserStore()
const { showAlert } = useAlert()
const localurl = 'http://localhost:3000'
const uploadedFileUrl = ref(null) // 從後端返回的圖片 URL
const userData = ref({
  name: '',
  sex: '男',
})

const updateUserPassword = async () => {
  try {
    console.log('hihi')
  } catch (error) {
    console.log(error)
  }
}
const updateUserInfo = async () => {
  try {
    console.log('userData', userData.value)
    const resdata = await axios.patch(`${localurl}/users/profile/`, userData.value, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    userData.value.name = ''
    userData.value.sex = '男'
    showAlert(`${resdata.data.message}，將導回首頁`, 'success', 1500)
    setTimeout(() => {
      router.push({ path: '/index' })
    }, 1500)
  } catch (error) {
    console.log(error)
  }
}

/*上傳大頭照↓*/
const selectedImage = ref(null) // 儲存選擇的圖片檔案
const fileInput = ref(null) // 引用隱藏的檔案輸入框
// 觸發檔案選擇
const triggerFileUpload = () => {
  fileInput.value.click() // 觸發檔案輸入框的點擊事件
}
// 處理檔案選擇
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    alert('請選擇圖片！')
    return
  }
  selectedImage.value = file // 儲存檔案
  uploadImage() // 自動上傳
}

// 上傳圖片到後端
const uploadImage = async () => {
  if (!selectedImage.value) {
    showAlert('未選擇圖片！', 'error')
    return
  }
  const formData = new FormData()
  formData.append('file', selectedImage.value) // 添加檔案
  formData.append('type', 'user') // 指定上傳類型
  try {
    const response = await axios.post(`${localurl}/upload/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    uploadedFileUrl.value = response.data.fileUrl // 獲取圖片 URL
    showAlert('圖片上傳成功', 'success')
    userData.value.photo = uploadedFileUrl.value
  } catch (error) {
    console.error('上傳失敗：', error)
    showAlert('圖片上傳失敗！', 'error')
  }
}
/*上傳大頭照↑*/
</script>
<template>
  <div>
    <!-- <div v-if="isLoading" class="loading-overlay">
      <div class="loading-text">載入中...</div>
    </div> -->
    <div>
      <!-- Header -->
      <NavbarCard></NavbarCard>

      <div class="container">
        <!-- Main Section -->
        <div class="row mt-4">
          <!-- Main Content -->
          <main class="col-lg-9">
            <!-- Filter and Search -->
            <h2 class="text-center mb-4">{{ userStore.username }}的個人資料</h2>
            <div class="mb-4">
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
                        <img
                          v-if="uploadedFileUrl"
                          :src="uploadedFileUrl"
                          alt="頭像"
                          class="rounded-circle"
                          style="width: 120px; height: 120px"
                        />
                        <img
                          v-else
                          :src="userStore.photo"
                          alt="頭像"
                          class="rounded-circle"
                          style="width: 120px; height: 120px"
                        />
                        <div class="mt-4">
                          <!-- 上傳檔案按鈕 -->
                          <button class="btn btn-primary" @click="triggerFileUpload">
                            上傳大頭照
                          </button>
                          <!-- 隱藏檔案選擇框 -->
                          <input
                            ref="fileInput"
                            type="file"
                            class="d-none"
                            @change="handleImageUpload"
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <label for="nickname" class="form-label">暱稱</label>
                        <input
                          type="text"
                          class="form-control"
                          id="nickname"
                          placeholder="輸入暱稱"
                          v-model="userData.name"
                        />
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
                            v-model="userData.sex"
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
                            v-model="userData.sex"
                          />
                          <label class="form-check-label" for="genderFemale">女</label>
                        </div>
                      </div>
                      <button
                        :disabled="!userData.name.trim()"
                        type="button"
                        class="btn btn-secondary w-100"
                        @click="updateUserInfo"
                      >
                        送出資訊
                      </button>
                    </form>
                  </div>

                  <!-- 重設密碼內容 -->
                  <div
                    class="tab-pane fade"
                    id="password"
                    role="tabpanel"
                    aria-labelledby="password-tab"
                  >
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
                      <button type="button" class="btn btn-secondary w-100" @click="updateUserInfo">
                        送出資訊
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <!-- Sidebar -->
          <SidebarCard></SidebarCard>
        </div>
      </div>
    </div>
  </div>
</template>
