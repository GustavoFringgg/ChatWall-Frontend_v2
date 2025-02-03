<script setup>
//Vue-核心
import { ref, watch, nextTick, onMounted } from 'vue'

//Vue-Router
import { useRouter } from 'vue-router'
const router = useRouter()

//Components
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'

//API
import { updatePassword, updateUserData, updateUserPhoto } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert'
const { showAlert } = useAlert()

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()

//forfunction
const uploadedFileUrl = ref(null) // 從後端返回的圖片 URL
const isActiveForPassword = ref(false) //顯示密碼
const userData = ref({
  name: '',
  sex: 'male',
})
const userPassword = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

//back router
const goBack = () => {
  router.back()
}

//監聽密碼屬性
watch(isActiveForPassword, () => {
  const currentPassword = document.getElementById('currentPassword')
  const newPassword = document.getElementById('newPassword')
  const confirmPassword = document.getElementById('confirmPassword')
  if (isActiveForPassword.value) {
    currentPassword?.setAttribute('type', 'text')
    newPassword?.setAttribute('type', 'text')
    confirmPassword?.setAttribute('type', 'text')
  } else {
    currentPassword?.setAttribute('type', 'password')
    newPassword?.setAttribute('type', 'password')
    confirmPassword?.setAttribute('type', 'password')
  }
})

const updateUserPassword = async () => {
  if (userPassword.value.newPassword != userPassword.value.confirmPassword) {
    return showAlert('確認密碼不符新密碼', 'error', 2000)
  }
  try {
    await updatePassword(userPassword.value, userStore.token)
    userPassword.value.oldPassword = ''
    userPassword.value.newPassword = ''
    showAlert('更新密碼成功，兩秒後導回登入頁', 'success', 2000)
    nextTick(() => {
      setTimeout(() => {
        router.push({ path: '/' })
      }, 2000)
    })
  } catch (error) {
    const { message } = error.response.data
    const errorMessages = {
      400: message,
      401: message,
    }
    const showMessage = errorMessages[error.response.status] || '發生未知錯誤'
    showAlert(showMessage, 'error', 2000)
  }
}
const updateUserInfo = async () => {
  try {
    const { data } = await updateUserData(userData.value, userStore.token)
    userStore.username = userData.value.name
    userData.value.name = ''
    userData.value.sex = 'male'
    showAlert(`${data.message}，兩秒後導回頁`, 'success', 2000)
    nextTick(() => {
      setTimeout(() => {
        router.push({ path: '/index' })
      }, 2000)
    })
  } catch (error) {
    console.log('error:', error)
    showAlert(`${error.message}`, 'error')
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
  selectedImage.value = file // 儲存檔案
  uploadImage() // 自動上傳
}

// 上傳圖片到後端
const uploadImage = async () => {
  const formData = new FormData()
  formData.append('file', selectedImage.value) // 添加檔案
  formData.append('type', 'user')
  try {
    const data = await updateUserPhoto(formData, userStore.token)
    uploadedFileUrl.value = data.fileUrl // 獲取圖片 URL
    showAlert('圖片上傳成功', 'success')
    userData.value.photo = uploadedFileUrl.value //增加回後端的物件photo
  } catch (error) {
    console.log('上傳失敗：', error)
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}
</script>
<template>
  <div>
    <div>
      <NavbarCard></NavbarCard>
      <div class="container">
        <div class="row mt-4">
          <main class="col-lg-9">
            <div class="mb-4">
              <div class="row justify-content-center">
                <div class="col-md-8 relative">
                  <button
                    class="btn btn-success rounded-3 mb-2 absolute"
                    style="left: 0"
                    @click="goBack"
                  >
                    <i class="bi bi-arrow-left"></i>
                  </button>
                  <div class="col text-center">
                    <h2 class="fw-bold">{{ userStore.username }}的個人資料</h2>
                  </div>
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
                    <li v-if="!userStore.googleId" class="nav-item" role="presentation">
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

                <div class="col-md-8 tab-content border border-top-0 p-4">
                  <div
                    class="tab-pane fade show active"
                    id="nickname"
                    role="tabpanel"
                    aria-labelledby="nickname-tab"
                  >
                    <form>
                      <div class="text-center mb-4">
                        <div class="img-container" style="height: 140px">
                          <img
                            v-if="uploadedFileUrl"
                            :src="uploadedFileUrl"
                            alt="頭像"
                            class="rounded-circle img-fluid-cos"
                            style="width: 200px; height: 200px"
                          />
                          <img
                            v-else
                            :src="userStore.photo"
                            alt="頭像"
                            class="rounded-circle img-fluid-cos"
                            style="width: 120px; height: 120px"
                          />
                        </div>
                        <div class="mt-4">
                          <button class="btn btn-primary" @click="triggerFileUpload">
                            上傳大頭照
                          </button>
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
                            value="male"
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
                            value="female"
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
                      <div class="mb-3 relative">
                        <i
                          id="registerToggleEye"
                          :class="isActiveForPassword ? ' bi bi-eye-fill' : ' bi bi-eye-slash'"
                          @click="isActiveForPassword = !isActiveForPassword"
                        ></i>
                        <label for="currentPassword" class="form-label">目前密碼</label>
                        <input
                          type="password"
                          class="form-control"
                          id="currentPassword"
                          placeholder="輸入目前密碼"
                          v-model="userPassword.oldPassword"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="newPassword" class="form-label">新密碼</label>
                        <input
                          type="password"
                          class="form-control"
                          id="newPassword"
                          placeholder="輸入新密碼"
                          v-model="userPassword.newPassword"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="confirmPassword" class="form-label">確認密碼</label>
                        <input
                          type="password"
                          class="form-control"
                          id="confirmPassword"
                          placeholder="再次輸入新密碼"
                          v-model="userPassword.confirmPassword"
                        />
                      </div>
                      <button
                        type="button"
                        class="btn btn-secondary w-100"
                        @click="updateUserPassword"
                      >
                        送出資訊
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <SidebarCard></SidebarCard>
        </div>
      </div>
    </div>
  </div>
</template>
