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

    // 👤 Cadastro de usuário
    {
      path: '/register',
      name: 'register-user',
      component: () => import('@/views/RegisterUserView.vue'),
    },

    // 📦 Registrar item
    {
      path: '/registrar-item',
      name: 'registrar',
      component: () => import('@/views/RegisterItensView.vue'),
    },

    // 🔍 Explorar
    {
      path: '/explorar',
      name: 'explorar',
      component: () => import('@/views/ExplorarView.vue'),
    },

    // 📋 Meus itens
    {
      path: '/meus-itens',
      name: 'meus-itens',
      component: () => import('@/views/MeusItensView.vue'),
    },

    // 🔎 Detalhe do item (ESSENCIAL pro que você quer)
    {
      path: '/item/:id',
      name: 'item-detail',
      component: () => import('@/views/ItemDetailView.vue'),
    },
  ],
})

export default router