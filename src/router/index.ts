import { createRouter, createWebHistory } from 'vue-router'
import { getAuthToken } from '@/services/api'
import LoginView from '@/views/LoginView.vue'

const publicRoutes = ['login', 'register-user']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register-user',
      component: () => import('@/views/RegisterUserView.vue'),
    },
    {
      path: '/registrar-item',
      name: 'registrar',
      component: () => import('@/views/RegisterItensView.vue'),
    },
    {
      path: '/explorar',
      name: 'explorar',
      component: () => import('@/views/ExplorarView.vue'),
    },
    {
      path: '/meus-itens',
      name: 'meus-itens',
      component: () => import('@/views/MeusItensView.vue'),
    },
    {
      path: '/item/:id',
      name: 'item-detail',
      component: () => import('@/views/ItemDetailView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const token = getAuthToken()
  if (!token && !publicRoutes.includes(to.name as string)) {
    return { name: 'login' }
  }
})

export default router
