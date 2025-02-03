import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
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
export const fetchUserLikeList = async (token) => {
  const { data } = await axios.get(`${baseURL}/users/getLikeList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const unlikePost = async (postId, token) => {
  return axios.delete(`${baseURL}/posts/${postId}/unlikes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//LoginView
export const signInUser = async (signInData) => {
  const { data } = await axios.post(`${baseURL}/auth/sign_in`, signInData)
  return data
}

//RegisterView
export const signUpUser = async (signUpData) => {
  const { data } = await axios.post(`${baseURL}/auth/sign_Up`, signUpData)
  console.log('RegisterViewerror', data)
  return data
}
