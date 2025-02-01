import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
const userStore = useUserStore()
const baseURL = 'http://localhost:3000'

export const getMessages = (query) => {
  console.log('query', query)
  return axios.get(`${baseURL}/api/messages`, { params: query })
}

//signCheck
export const verifyToken = async (token) => {
  return await axios.get(`${baseURL}/users/checkout`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//MyLikeListView
export const fetchUserLikeList = async () => {
  const { data } = await axios.get(`${baseURL}/users/getLikeList`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })
  return data
}

export const unlikePost = async (postId) => {
  return axios.delete(`${baseURL}/posts/${postId}/unlikes`, {
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })
}

//LoginView
export const signInUser = async (signInData) => {
  const { data } = await axios.post(`${baseURL}/auth/sign_in`, signInData)
  return data
}
