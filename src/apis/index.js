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

//PostView
export const postPostData = async (postData, token) => {
  return axios.post(`${baseURL}/posts/`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//OtherPostView
export const postCommentData = (postId, commenData, token) => {
  return axios.post(
    `${baseURL}/posts/${postId}/comment`,
    { comment: commenData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export const fetchUserPost = (postId, token) => {
  const { data } = axios.get(`${baseURL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data.message[0]
}

export const followUser = (userId, token) => {
  return axios.post(
    `${baseURL}/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}

export const unFollowUser = (userId, token) => {
  return axios.delete(`${baseURL}/users/${userId}/unfollow`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
