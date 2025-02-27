import { fetchUserLikeList, fetchFollowList } from '@/apis'
import { ref } from 'vue'
import dayjs from 'dayjs'

export function useGetUserList() {
  const userLikeListData = ref([])
  const getUserFollowListData = ref([])

  const getUserLikeList = async (token) => {
    const data = await fetchUserLikeList(token)
    userLikeListData.value = data.data.map((list) => ({
      ...list,
      formattedDate: dayjs(list.createdAt).format('YYYY-MM-DD HH:mm'),
    }))
  }

  const getUserFollowList = async (token) => {
    const data = await fetchFollowList(token)
    getUserFollowListData.value = data.data.map((list) => ({
      ...list,
      formattedDate: dayjs(list.createdAt).format('YYYY-MM-DD HH:mm'),
    }))
  }

  return { getUserLikeList, userLikeListData, getUserFollowList, getUserFollowListData }
}
