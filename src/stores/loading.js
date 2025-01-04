import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  const setLoading = (status) => {
    isLoading.value = status
  }
  return { isLoading, setLoading }
})
