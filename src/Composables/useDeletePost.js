import { ref } from 'vue'
import { deleteMemberPost } from '@/apis'
import { useUserStore } from '@/stores/userStore'
import { useAlert } from './useAlert'

const userStore = useUserStore()
const { showAlert } = useAlert()

export function useDeletePost() {
  const getUserPost = ref([])
  const deletePost = async (postId) => {
    try {
      await deleteMemberPost(postId, userStore.token)
      getUserPost.value = getUserPost.value.filter((post) => post._id !== postId)
    } catch (error) {
      showAlert(`${error.response.data.message}`, 'error', 2000)
    }
  }

  return { deletePost, getUserPost }
}
