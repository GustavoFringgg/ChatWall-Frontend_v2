<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert'
import axios from 'axios'
const { showAlert } = useAlert()
const img = ref(
  'https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2Fimg.svg?alt=media&token=0cd7e380-7158-4632-9b3c-3f5766bc954c',
)
const localurl = 'http://localhost:3000'
const router = useRouter()
const sigInToken = ref('')
const signInField = ref({
  email: '',
  password: '',
})

const signIn = async () => {
  try {
    const resdata = await axios.post(`${localurl}/auth/sign_In`, signInField.value)
    sigInToken.value = resdata.data.data.user.token
    document.cookie = `Token=${resdata.data.data.user.token}` //儲存cookie
    showAlert(`歡迎回來${resdata.data.data.user.name}`, 'success')
    setTimeout(() => {
      router.push({ path: '/index' })
    }, 1000)
  } catch (error) {
    console.log(error)
    showAlert(`${error.response.data.message}`, 'error')
  }
}

const signInFromGoogle = async () => {
  try {
    const resdata = await axios.get(`${localurl}/googleClient/callback`)

    sigInToken.value = resdata.data.data.user.token
    document.cookie = `Token=${resdata.data.data.user.token}` //儲存cookie
    showAlert(`歡迎回來${resdata.data.data.user.name}`, 'success')
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
      <div class="row shadow rounded p-5 bg-light border border-3 border-dark w-75 h-75">
        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <!-- 左側圖像 -->
          <img :src="img" alt="MetaWall Illustration" class="img-fluid" />
        </div>
        <div class="col-md-6 d-flex flex-column">
          <!-- 登入表單 -->
          <div class="text-center">
            <h1 class="text-primary fw-bold">MetaWall</h1>
            <p class="text-secondary">元宇宙展開全新社交圈</p>
          </div>
          <form @submit.prevent="handleLogin">
            <div class="mb-3 mt-auto">
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="signInField.email"
                required
                placeholder="請輸入email"
              />
            </div>
            <div class="mb-3">
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="signInField.password"
                required
                placeholder="請輸入密碼"
              />
            </div>
          </form>
          <div class="text-center mt-5 mb-5">
            <input
              class="btn btn-primary w-75 mt-2 mb-3"
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
