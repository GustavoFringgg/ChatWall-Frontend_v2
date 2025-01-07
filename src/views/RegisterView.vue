<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert.js'
const { showAlert } = useAlert()
const router = useRouter()

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
    router.push({ path: '/login' })
  } catch (err) {
    console.log('err', err.message)
  }
}
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="row shadow rounded p-5 bg-light border border-3 border-dark w-75">
        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <!-- 左側圖像 -->
          <img :src="img" alt="MetaWall Illustration" class="img-fluid" />
        </div>
        <div class="col-md-6">
          <!-- 登入表單 -->
          <div class="text-center">
            <h1 class="text-primary fw-bold">MetaWall</h1>
            <p class="formControls_label">註冊</p>
          </div>
          <form action="index.html">
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
            <div class="mb-3">
              <label for="password" class="formControls_label">輸入密碼</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="registerField.password"
                required
                placeholder="請輸入密碼"
              />
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
              <input
                class="formControls_btnSubmit btn btn-primary"
                type="button"
                value="註冊帳號"
                @click="registerUser"
              />
            </div>
            <div class="text-center mt-3">
              <RouterLink class="text-decoration-none" to="/">登入</RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
