import { createRouter } from 'vue-router'
import HomeView from '../views/LoginView.vue'
import { createWebHashHistory } from 'vue-router'
import axios from 'axios'
const baseURL = 'http://localhost:3000'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/index',
      component: () => import('../views/IndexView.vue'),
    },
    {
      path: '/userpost',
      component: () => import('../views/PostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mypost',
      component: () => import('../views/MyPostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/callback',
      component: () => import('../views/AuthCallback.vue'),
    },
    {
      path: '/otherpost/:id',
      component: () => import('../views/OtherPostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/myfollowlist',
      component: () => import('../views/MyFollowListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mylikelist',
      component: () => import('../views/MyLikeListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/certainpost/:id',
      component: () => import('../views/CertainPostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/errorView/404PageView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)Token\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  if (!token && to.meta.requiresAuth) {
    return next({ path: '/' })
  }
  if (token && to.meta.requiresAuth) {
    try {
      // 可選擇請求後端檢查 Token 是否有效
      await axios.get(`${baseURL}/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      document.cookie = 'Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;' // 清除過期 Token
      return next({ path: '/' }) // Token 過期，強制登出
    }
  }

  next()
})
export default router
