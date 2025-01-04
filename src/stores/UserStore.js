import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: '',
    userid: null,
    token: '',
    photo: '',
  }),
  actions: {
    setUserInfo(payload, usertoken) {
      this.username = payload.name
      this.userid = payload._id
      this.token = usertoken
      this.photo = payload.photo

      // 儲存到 localStorage
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          username: this.username,
          userid: this.userid,
          token: this.token,
          photo: this.photo,
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
      }
    },
  },
})
