<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAlert } from '@/Composables/useAlert'
import axios from 'axios'
const { showAlert } = useAlert()
const img = ref(
  'https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2FiStock-1987991143.jpg?alt=media&token=72d3cb3f-f061-47a9-b927-8fb6564a9e94',
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
      <div class="row shadow rounded p-5 bg-light w-75 h-75 yellow-box">
        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <!-- 左側圖像 -->
        </div>
        <div class="col-md-6 d-flex flex-column">
          <!-- 登入表單 -->
          <div class="text-center">
            <h1 class="text-primary fw-bold">ChatWall</h1>
            <p class="text-secondary">聊天、交朋友</p>
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

<style scope>
.yellow-box {
  background-image: url('https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2Ftest123.png?alt=media&token=7093fa0c-f84d-4a57-a1bc-671d7f32c3d4');

  /* background-image: url('https://firebasestorage.googleapis.com/v0/b/metawall-a2771.appspot.com/o/local%2FiStock-1987991143.jpg?alt=media&token=72d3cb3f-f061-47a9-b927-8fb6564a9e94'); */
  background-size: cover; /* 確保圖片完全覆蓋 */
  background-position: center; /* 居中對齊 */
  width: 100%;
  height: 100%;
}
</style>
