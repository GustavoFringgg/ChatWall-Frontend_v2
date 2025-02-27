import { ref } from 'vue'
import { deleteMemberPost } from '@/apis'
import { useUserStore } from '@/stores/userStore'
import { useAlert } from './useAlert'

export function useDeletePost() {
  const userStore = useUserStore()
  const { showAlert } = useAlert()
  const getUserPost = ref([])
  const deletePost = async (postId) => {
    try {
      await deleteMemberPost(postId, userStore.token)
      getUserPost.value = getUserPost.value.filter((post) => post._id !== postId)
    } catch (error) {
      showAlert('此貼文可能被刪除囉，請重新整理', 'error', 2000)
    }
  }

  return { deletePost, getUserPost }
}
