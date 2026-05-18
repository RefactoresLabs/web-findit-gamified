<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useNegotiations } from '@/composables/useNegotiations'

const router = useRouter()
const { createdNegotiations, receivedNegotiations, loading, error, fetchNegotiations } =
  useNegotiations()

type TabType = 'criadas' | 'recebidas'
type RouteKey = 'explorar' | 'registrar' | 'meus-itens' | 'negociacoes'

const activeTab = ref<TabType>('criadas')

onMounted(() => {
  fetchNegotiations()
})

const currentNegotiations = computed(() =>
  activeTab.value === 'criadas' ? createdNegotiations.value : receivedNegotiations.value,
)

const routesMap: Record<RouteKey, { name: RouteKey }> = {
  explorar: { name: 'explorar' },
  registrar: { name: 'registrar' },
  'meus-itens': { name: 'meus-itens' },
  negociacoes: { name: 'negociacoes' },
}

function handleNavigate(item: string) {
  if (item in routesMap) {
    router.push(routesMap[item as RouteKey])
  }
}

function handleLogout() {
  window.location.href = '/'
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    Pendente: 'status-pendente',
    Aceita: 'status-aceita',
    Rejeitada: 'status-rejeitada',
    Finalizada: 'status-finalizada',
  }
  return map[status] ?? ''
}
</script>

<template>
  <div class="negociacoes-layout">
    <AppSidebar active-item="negociacoes" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="negociacoes-main">
      <div class="page-header">
        <h1 class="page-title">Minhas Negociações</h1>
        <p class="page-sub">Gerencie suas negociações de recuperação</p>
      </div>

      <div class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'criadas' }"
          @click="activeTab = 'criadas'"
        >
          Criadas ({{ createdNegotiations.length }})
        </button>

        <button
          class="tab"
          :class="{ active: activeTab === 'recebidas' }"
          @click="activeTab = 'recebidas'"
        >
          Recebidas ({{ receivedNegotiations.length }})
        </button>
      </div>

      <div v-if="loading" class="loading-state" data-testid="loading-indicator">
        <i class="pi pi-spin pi-spinner" />
        <p>Carregando negociações...</p>
      </div>

      <div v-else-if="error" class="error-state" data-testid="error-message">
        <i class="pi pi-exclamation-circle" />
        <p>{{ error }}</p>
        <button class="btn-retry" @click="fetchNegotiations()">Tentar novamente</button>
      </div>

      <div v-else class="negotiations-list">
        <div
          v-for="neg in currentNegotiations"
          :key="neg.id"
          class="negotiation-card"
          @click="router.push({ name: 'negociacao-detalhe', params: { id: neg.id }, query: { role: activeTab === 'criadas' ? 'criada' : 'recebida' } })"
        >
          <div class="neg-icon">
            <i class="pi pi-handshake"></i>
          </div>

          <div class="neg-info">
            <span class="neg-item-name">{{ neg.itemName }}</span>
            <span class="neg-user">
              <i class="pi pi-user"></i>
              {{ neg.userName }}
            </span>
            <span class="status-badge" :class="statusClass(neg.status)">
              {{ neg.status }}
            </span>
          </div>

          <i class="pi pi-chevron-right neg-arrow"></i>
        </div>

        <div v-if="currentNegotiations.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>Nenhuma negociação encontrada.</p>
        </div>
      </div>

      <button
        data-testid="fab-create"
        class="fab-create"
        @click="router.push({ name: 'selecionar-item' })"
      >
        <i class="pi pi-plus"></i>
      </button>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.negociacoes-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.negociacoes-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}

.page-sub {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tab {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.15s;
}

.tab.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
  font-weight: 600;
}

.negotiations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.negotiation-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}

.negotiation-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  transform: translateY(-1px);
}

.neg-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.625rem;
  background: #ede9fe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.neg-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.neg-item-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.neg-user {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.neg-user i {
  font-size: 0.75rem;
}

.status-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pendente {
  background: #fef3c7;
  color: #92400e;
}

.status-aceita {
  background: #d1fae5;
  color: #065f46;
}

.status-rejeitada {
  background: #fee2e2;
  color: #991b1b;
}

.status-finalizada {
  background: #dbeafe;
  color: #1e40af;
}

.neg-arrow {
  color: #9ca3af;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.fab-create {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: background 0.15s, transform 0.15s;
}

.fab-create:hover {
  background: #4338ca;
  transform: scale(1.05);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6b7280;
  gap: 0.75rem;
}

.loading-state i,
.error-state i {
  font-size: 2rem;
}

.loading-state p,
.error-state p {
  margin: 0;
  font-size: 0.9375rem;
}

.error-state {
  color: #ef4444;
}

.btn-retry {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: inherit;
}

.btn-retry:hover {
  background: #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-state i {
  font-size: 2.5rem;
}

.empty-state p {
  font-size: 0.9rem;
  margin: 0;
}
</style>
