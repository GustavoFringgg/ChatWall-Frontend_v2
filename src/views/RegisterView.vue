<script setup>
//Vue-核心
import { ref, watch } from 'vue'

//Vue-Router
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()

//API
import { signUpUser } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert.js'
const { showAlert } = useAlert()

//forfunction
const isActiveForPassword = ref(false)
const registerField = ref({
  name: '',
  email: '',
  confirmPassword: '',
})

//監聽密碼屬性
watch(isActiveForPassword, () => {
  const inputPassword = document.getElementById('password')
  const confirmPassword = document.getElementById('confirmpassword')
  if (isActiveForPassword.value) {
    inputPassword?.setAttribute('type', 'text')
    confirmPassword?.setAttribute('type', 'text')
  } else {
    inputPassword?.setAttribute('type', 'password')
    confirmPassword?.setAttribute('type', 'password')
  }
})

const registerUser = async () => {
  try {
    await signUpUser(registerField.value)
    showAlert('歡迎您，註冊成功，將導回登入頁', 'success', 2000)
    router.push({ path: '/' })
  } catch (error) {
    const { message } = error.response.data
    const errorMessages = {
      402: message,
      422: message,
      409: message,
    }
    const showMessage = errorMessages[error.response.status] || '發生未知錯誤'
    showAlert(showMessage, 'error', 2000)
  }
}
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div
        class="row shadow rounded p-md-4 border-dark w-75 h-75 background-box border border-3 border-dark"
      >
        <div class="col-md-6 d-flex flex-column ms-auto justify-content-center">
          <div class="text-center">
            <h1 class="text-primary fw-bold">註冊</h1>
          </div>
          <form action="index.html" class="mb-3 mt-md-auto ms-3 me-3">
            <div class="mb-3">
              <label for="name" class="formControls_label">你的姓名</label>
              <input
                type="text"
                id="name"
                class="form-control"
                required
                placeholder="請輸入姓名"
                v-model="registerField.name"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="formControls_label">Email</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="registerField.email"
                required
                placeholder="請輸入email"
              />
            </div>
            <div class="mb-3 relative">
              <label for="password " class="formControls_label">輸入密碼</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="registerField.password"
                required
                placeholder="請輸入密碼"
              />
              <i
                id="registerToggleEye"
                :class="isActiveForPassword ? ' bi bi-eye-fill' : ' bi bi-eye-slash'"
                @click="isActiveForPassword = !isActiveForPassword"
              ></i>
            </div>
            <div class="mb-3">
              <label for="confirmpassword" class="formControls_label">再次輸入</label>
              <input
                type="password"
                id="confirmpassword"
                class="form-control"
                v-model="registerField.confirmPassword"
                required
                placeholder="請再次輸入密碼"
              />
            </div>
            <div class="text-center">
              <button
                class="formControls_btnSubmit btn btn-success"
                type="button"
                @click="registerUser"
              >
                註冊帳號
              </button>
            </div>
            <div class="text-center mt-1">
              <RouterLink class="formControls_btnSubmit btn btn-primary" to="/">登入</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
