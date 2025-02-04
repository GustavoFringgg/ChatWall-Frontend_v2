import { createRouter } from 'vue-router'
import HomeView from '../views/LoginView.vue'
import { createWebHashHistory } from 'vue-router'
import { validateToken } from '@/apis'
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
      await validateToken(token)
    } catch (error) {
      document.cookie = 'Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;' // 清除過期 Token
      return next({ path: '/' })
    }
  }
  console.log('beforeEach觸發')
  next()
})
export default router
