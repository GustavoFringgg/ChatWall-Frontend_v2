import { createRouter } from 'vue-router'
import HomeView from '../views/LoginView.vue'
import { createWebHashHistory } from 'vue-router'

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
    },
    {
      path: '/pinia',
      component: () => import('../views/PINIA.vue'),
    },
    {
      path: '/update',
      component: () => import('../views/update.vue'),
    },
  ],
})
export default router
