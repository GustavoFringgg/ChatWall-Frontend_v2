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
    },
    clearUserInfo() {
      this.username = ''
      this.userid = null
      this.token = ''
      this.photo = ''
    },
  },
})
