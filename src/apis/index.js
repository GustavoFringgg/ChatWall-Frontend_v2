import axios from 'axios'
let baseURL
if (import.meta.env.MODE === 'production') {
  baseURL = 'https://chatwall-backend.onrender.com'
} else {
  baseURL = 'http://localhost:3000'
}

//     --socket.io--     //
//取得聊天室聊天訊息
export const getMessages = (token) => {
  return axios.get(`${baseURL}/api/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

//     --auth--     //
//後端的tokenCheck(不會過資料庫)
export const validateToken = (token) => {
  return axios.get(`${baseURL}/auth/checkout-token`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

//首次登入的tokenCheck(會過資料庫取得使用者資料)
export const verifyToken = (token) => {
  return axios.get(`${baseURL}/auth/checkout-userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//登入
export const signInUser = async (signInData) => {
  const { data } = await axios.post(`${baseURL}/auth/sign_in`, signInData)
  return data
}

//註冊
export const signUpUser = async (signUpData) => {
  const { data } = await axios.post(`${baseURL}/auth/sign_up`, signUpData)
  return data
}

//     --user--     //
//取得使用者按讚清單
export const fetchUserLikeList = async (token) => {
  const { data } = await axios.get(`${baseURL}/users/getLikeList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

//更新密碼
export const updatePassword = (passwordtData, token) => {
  return axios.patch(`${baseURL}/users/updatePassword`, passwordtData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//更新個人訊息
export const updateUserData = (userInfo, token) => {
  return axios.patch(`${baseURL}/users/profile/`, userInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//追蹤Member
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

//取得使用者追蹤清單
export const fetchFollowList = async (token) => {
  const { data } = await axios.get(`${baseURL}/users/getFollowingList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

//     --upload--     //
//上傳使用者照片
export const uploadPhoto = async (formData, token) => {
  const { data } = await axios.post(`${baseURL}/upload/file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

//     --posts--     //
//貼文
export const postPostData = (postData, token) => {
  return axios.post(`${baseURL}/posts/`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//留言
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

//取得Member單一貼文
export const fetchMemberOnePost = async (postId, token) => {
  const { data } = await axios.get(`${baseURL}/posts/${postId}`, {
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

//取得所有貼文
export const fetchAllPost = async (timeSort = 'desc', keyword, token) => {
  const data = await axios.get(`${baseURL}/posts/`, {
    params: { timeSort, keyword },
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

//按Member貼文讚
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

//取消Member貼文讚
export const unLikeMemberPost = (postId, token) => {
  return axios.delete(`${baseURL}/posts/${postId}/unlikes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

//更新貼文
export const updateMemberPost = (postId, newContent, token) => {
  const contenInfo = {
    newContent,
  }
  return axios.patch(`${baseURL}/posts/${postId}`, contenInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
