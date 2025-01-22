<template>
  <LoadingOverlay :is-loading="isLoading" />
  <div v-if="!isLoading"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const token = route.query.token
    document.cookie = `Token=${token}`
  } finally {
    router.push({ path: '/index' })
  }
})
</script>
