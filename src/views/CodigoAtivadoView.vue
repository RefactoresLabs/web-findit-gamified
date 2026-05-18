<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const router = useRouter()

type RouteKey = 'explorar' | 'registrar' | 'meus-itens' | 'negociacoes'
const routesMap: Record<RouteKey, { name: RouteKey }> = {
  explorar: { name: 'explorar' },
  registrar: { name: 'registrar' },
  'meus-itens': { name: 'meus-itens' },
  negociacoes: { name: 'negociacoes' },
}

function handleNavigate(item: string) {
  if (item in routesMap) router.push(routesMap[item as RouteKey])
}

function handleLogout() {
  window.location.href = '/'
}
</script>

<template>
  <div class="confirmacao-layout">
    <AppSidebar active-item="negociacoes" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="confirmacao-main">
      <div class="success-card">
        <div class="success-icon">
          <i class="pi pi-check-circle"></i>
        </div>

        <h1 data-testid="success-message" class="success-title">Código ativado com sucesso!</h1>

        <p class="success-description">
          A negociação foi finalizada. O item foi devolvido ao seu dono.
        </p>

        <button
          data-testid="btn-go-negotiations"
          class="btn-go"
          @click="router.push({ name: 'negociacoes' })"
        >
          <i class="pi pi-arrow-left"></i>
          Voltar para Negociações
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.confirmacao-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.confirmacao-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.success-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 3rem;
  max-width: 440px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 2.5rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.success-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.btn-go {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border-radius: 0.625rem;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  margin-top: 0.5rem;
}

.btn-go:hover {
  background: #4338ca;
}
</style>
