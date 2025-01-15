<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
const { showAlert } = useAlert()
const router = useRouter()
const isActiveForPassword = ref(false)
const local = 'http://localhost:3000'
const img = ref(
  'https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2Fimg.svg?alt=media&token=0cd7e380-7158-4632-9b3c-3f5766bc954c',
)
const registerField = ref({
  name: '',
  email: '',
  confirmPassword: '',
})

const registerToken = ref('')
const registerUser = async () => {
  console.log(registerField.value)
  try {
    const res = await axios.post(`${local}/auth/sign_Up`, registerField.value)
    registerToken.value = res.data.data.user.token
    console.log('token', registerToken.value)
    showAlert('註冊成功', 'success')
    router.push({ path: '/' })
  } catch (err) {
    console.log('err', err.message)
  }
}

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
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="row shadow rounded p-4 border-dark w-75 h-75 yellow-box">
        <div class="col-md-6 d-flex flex-column ms-auto justify-content-center">
          <!-- 登入表單 -->
          <div class="text-center">
            <h1 class="text-primary fw-bold">註冊</h1>
          </div>
          <form action="index.html" class="mb-3 mt-auto ms-3 me-3">
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
<style scope>
.yellow-box {
  background-image: url('https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2Ftest123.png?alt=media&token=7093fa0c-f84d-4a57-a1bc-671d7f32c3d4');
  background-size: cover; /* 確保圖片完全覆蓋 */
  background-position: center; /* 居中對齊 */
}
</style>
