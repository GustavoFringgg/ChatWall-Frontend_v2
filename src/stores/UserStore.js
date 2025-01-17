import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: '',
    userid: null,
    token: '',
    photo: '',
    formatTime: '',
    followers: [],
    following: [],
  }),
  actions: {
    setUserInfo(payload, usertoken) {
      this.username = payload.name
      this.userid = payload._id
      this.token = usertoken
      this.photo = payload.photo
      this.formatTime = payload.formatTime
      this.followers = payload.followers
      this.following = payload.following

      // 儲存到 localStorage
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          username: this.username,
          userid: this.userid,
          token: this.token,
          photo: this.photo,
          formatTime: this.formatTime,
          followers: this.followers,
          following: this.following,
        }),
      )
    },
    clearUserInfo() {
      this.username = ''
      this.userid = null
      this.token = ''
      this.photo = ''
      localStorage.removeItem('userInfo')
    },
    loadUserInfo() {
      const storedUser = localStorage.getItem('userInfo')
      if (storedUser) {
        const userInfo = JSON.parse(storedUser)
        this.username = userInfo.username
        this.userid = userInfo.userid
        this.token = userInfo.token
        this.photo = userInfo.photo
        this.formatTime = userInfo.formatTime
        this.followers = userInfo.followers
        this.following = userInfo.following
      }
    },
  },
})
