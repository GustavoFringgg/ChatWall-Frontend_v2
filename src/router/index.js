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
      path: '/mypost',
      component: () => import('../views/MyPostView.vue'),
    },
    {
      path: '/profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/otherpost/:id',
      component: () => import('../views/OtherPostView.vue'),
    },
    {
      path: '/myfollowlist',
      component: () => import('../views/MyFollowListView.vue'),
    },
    {
      path: '/mylikelist',
      component: () => import('../views/MyLikeListView.vue'),
    },
    {
      path: '/certainpost/:id',
      component: () => import('../views/CertainPostView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/errorView/404PageView.vue'),
    },
  ],
})
export default router
