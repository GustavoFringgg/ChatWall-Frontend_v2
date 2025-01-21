<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert'
import axios from 'axios'
const { showAlert } = useAlert()
const img = ref(
  'https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2FiStock-1987991143.jpg?alt=media&token=72d3cb3f-f061-47a9-b927-8fb6564a9e94',
)
const isActiveForPassword = ref(false)
const localurl = 'http://localhost:3000'
const router = useRouter()
const sigInToken = ref('')
const signInField = ref({
  email: '',
  password: '',
})

watch(isActiveForPassword, () => {
  const inputPassword = document.getElementById('password')
  if (isActiveForPassword.value) {
    inputPassword?.setAttribute('type', 'text')
  } else {
    inputPassword?.setAttribute('type', 'password')
  }
})
const signIn = async () => {
  try {
    console.log('signInField', signInField.value)
    const res = await axios.post(`${localurl}/auth/sign_In`, signInField.value)
    sigInToken.value = res.data.data.user.token
    document.cookie = `Token=${res.data.data.user.token}`
    showAlert(`歡迎回來${res.data.data.user.name}`, 'success', 2000)
    setTimeout(() => {
      router.push({ path: '/index' })
    }, 2000)
  } catch (error) {
    console.log(error)
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}

const signInFromGoogle = async () => {
  try {
    const res = await axios.get(`${localurl}/googleClient/callback`)
    sigInToken.value = res.data.data.user.token
    document.cookie = `Token=${res.data.data.user.token}` //儲存cookie
    showAlert(`歡迎回來${res.data.data.user.name}`, 'success')
    router.push({ path: '/index' })
  } catch (error) {
    console.log(error)
    showAlert(`${error.response.data.message}`, 'error')
  }
}
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="row shadow rounded p-4 w-75 h-75 background-box border border-3 border-dark">
        <div class="col-md-6 d-flex flex-column ms-auto justify-content-center">
          <!-- 登入表單 -->
          <div class="text-center">
            <h1 class="text-primary fw-bold">ChatWall</h1>
            <p class="text-secondary">聊天、交朋友</p>
          </div>
          <form>
            <div class="mb-3 mt-auto ms-4 me-4">
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="signInField.email"
                required
                placeholder="請輸入email"
              />
            </div>
            <div class="mb-2 ms-4 me-4 relative">
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="signInField.password"
                required
                placeholder="請輸入密碼"
              />
              <i
                id="toggleEye"
                :class="isActiveForPassword ? ' bi bi-eye-fill' : ' bi bi-eye-slash'"
                @click="isActiveForPassword = !isActiveForPassword"
              ></i>
            </div>
          </form>
          <div class="text-center mt-1 mb-3">
            <input
              class="btn btn-success w-75 mt-2 mb-3"
              type="button"
              @click="signIn"
              value="登入"
            />
            <input
              class="btn btn-primary w-75 mt-2 mb-3"
              type="button"
              @click="signInFromGoogle"
              value="google登入"
            />
            <RouterLink class="btn btn-primary w-75 mt-2 mb-3" to="/register">註冊</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
