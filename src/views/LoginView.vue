<script setup>
//Vue 核心
import { ref, watch } from 'vue'

//Vue-Router
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()

//API
import { signInUser } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert'
const { showAlert } = useAlert()

//forfunction
const isActiveForPassword = ref(false)
const signInField = ref({
  email: '',
  password: '',
})

let baseURL = ref()
if (import.meta.env.MODE === 'production') {
  baseURL.value = 'https://chatwall-backend.onrender.com/users/google'
} else {
  baseURL.value = 'http://localhost:3000/users/google'
}

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
    const { data } = await signInUser(signInField.value)
    document.cookie = `Token=${data.user.token}`
    showAlert(`歡迎回來${data.user.name}`, 'success', 2000)
    setTimeout(() => {
      router.push({ path: '/index' })
    }, 2000)
  } catch (error) {
    console.error(error)
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="row shadow rounded p-md-4 w-75 h-75 login-box border border-3 border-dark">
        <div class="relative d-md-flex justify-content-center">
          <div class="text-center absolute-cus">
            <h1 class="navbar-header">ChatWall</h1>
          </div>
          <form style="height: 177px; width: 100%; max-width: 350px" class="align-content-center">
            <div>
              <div class="my-4 mx-md-4">
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  v-model="signInField.email"
                  required
                  placeholder="請輸入email"
                />
              </div>
              <div class="mb-2 mx-md-4 relative">
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
            </div>
          </form>
          <div>
            <div class="text-center mt-1 mb-3">
              <input class="btn btn-success w-75 mb-3" type="button" @click="signIn" value="登入" />
              <a class="btn btn-primary google-login-btn w-75 mt-2 mb-3" :href="baseURL">
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Icon"
                />
                Sign in with Google
              </a>
              <RouterLink class="btn btn-primary w-75 mt-2 mb-3" to="/register">註冊</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scope>
.google-login-btn img {
  width: 20px;
  height: 20px;
}
</style>
