import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

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
      name: 'register',
      component: () => import('@/components/registrar/RegisterView.vue'),
    },
    {
      path: '/explorar',
      name: 'explorar',
      component: () => import('@/views/ExplorarView.vue'),
    },
    {
      path: '/meus-itens',
      name: 'meus-itens',
      component: () => import('@/components/MeusIntes/MeusItensView.vue'),
    },
    
  ],
})

export default router
