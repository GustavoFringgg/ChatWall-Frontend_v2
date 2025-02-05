import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
// const baseURL = 'http://localhost:3000'
const baseURL = 'https://chatwall-backend.onrender.com'
export const getMessages = (query) => {
  console.log('query', query)
  return axios.get(`${baseURL}/api/messages`, { params: query })
}

//後端的tokenCheck(不會過資料庫)
export const validateToken = (token) => {
  return axios.get(`${baseURL}/auth/validate-token`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

//首次登入的tokenCheck(會過資料庫)
export const verifyToken = (token) => {
  return axios.get(`${baseURL}/users/checkout`, {
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

export const unlikePost = (postId, token) => {
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
  return data
}

//ProfileView
export const updatePassword = (passwordtData, token) => {
  return axios.patch(`${baseURL}/users/updatePassword`, passwordtData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const updateUserData = (userInfo, token) => {
  return axios.patch(`${baseURL}/users/profile/`, userInfo, {
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
export const postPostData = (postData, token) => {
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

export const fetchMemberOnePost = async (postId, token) => {
  const { data } = await axios.get(`${baseURL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export const followMember = (userId, token) => {
  return axios.post(
    `${baseURL}/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}

//取消追蹤Member
export const unFollowMember = (userId, token) => {
  return axios.delete(`${baseURL}/users/${userId}/unfollow`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

//取得Member資料
export const fetchMemberData = async (userId, token) => {
  const data = await axios.get(`${baseURL}/users/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

//取得Member所有貼文
export const fetchMemberPost = async (timeSort = 'desc', keyword, userId, token) => {
  const data = await axios.get(`${baseURL}/posts/${userId}/user`, {
    params: { timeSort, keyword },
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

//刪除Member貼文
export const deleteMemberPost = (postId, token) => {
  return axios.delete(`${baseURL}/posts/${postId}/post`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

//MyFollowListView
export const fetchFollowList = async (token) => {
  const { data } = await axios.get(`${baseURL}/users/getFollowingList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

//index.vue
export const fetchAllPost = async (timeSort = 'desc', keyword, token) => {
  const data = await axios.get(`${baseURL}/posts/`, {
    params: { timeSort, keyword },
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

//PostCard
export const likeMemberPost = (postId, token) => {
  return axios.post(
    `${baseURL}/posts/${postId}/likes`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export const unLikeMemberPost = (postId, token) => {
  return axios.delete(`${baseURL}/posts/${postId}/unlikes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
