import { unFollowMember, followMember } from '@/apis'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
import { useAlert } from './useAlert'
const { showAlert } = useAlert()

export function useToggleFollow() {
  const isFollowing = ref(false)
  const followersCount = ref(0)

  const toggleFollow = async (userId) => {
    isFollowing.value = !isFollowing.value
    try {
      if (isFollowing.value) {
        await followMember(userId, userStore.token)
        followersCount.value += 1
        userStore.following.length += 1
        showAlert('已追蹤~~', 'success', 1500)
      } else {
        await unFollowMember(userId, userStore.token)
        followersCount.value -= 1
        userStore.following.length -= 1
        showAlert('已取消追蹤~~', 'success', 1500)
      }
    } catch (error) {
      showAlert(`${error.response.data.message}`, 'error', 2000)
    }
  }

  return { toggleFollow, isFollowing, followersCount }
}
