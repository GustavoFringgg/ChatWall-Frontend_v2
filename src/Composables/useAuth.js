// Composables/useAuth.js
import { ref } from 'vue'
import { verifyToken } from '@/apis'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useformatTime } from './useformatTime'
import { useAlert } from './useAlert'

export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()
  const { formatTime } = useformatTime()
  const { showAlert } = useAlert()
  const signInToken = ref('')
  const getUserData = ref(null)

  const signCheck = async () => {
    signInToken.value = document.cookie.replace(
      /(?:(?:^|.*;\s*)Token\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    )
    if (!signInToken.value) {
      router.push({ path: '/' })
      showAlert(`請登入`, 'error', 1500)
      return
    }
    try {
      const res = await verifyToken(signInToken.value)
      getUserData.value = res.data
      getUserData.value.user.formatTime = formatTime(res.data.user.createdAt)
      userStore.setUserInfo(getUserData.value.user, signInToken.value)
    } catch (error) {
      showAlert(`${error}`, 'error')
      router.push({ path: '/' })
    }
  }

  return { signCheck }
}
