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
  return await axios.delete(`${baseURL}/posts/${postId}/unlikes`, {
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
  return data
}

//ProfileView
export const updatePassword = async (passwordtData, token) => {
  return await axios.patch(`${baseURL}/users/updatePassword`, passwordtData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const updateUserData = async (userInfo, token) => {
  return await axios.patch(`${baseURL}/users/profile/`, userInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateUserPhoto = async (formData, token) => {
  const { data } = await axios.post(`${baseURL}/upload/file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
