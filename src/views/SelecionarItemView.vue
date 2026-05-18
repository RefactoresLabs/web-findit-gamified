<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useItems } from '@/composables/useItems'
import { useNegotiations } from '@/composables/useNegotiations'
import { useAuth } from '@/composables/useAuth'
import { apiClient } from '@/services/api'

const router = useRouter()
const { foundItems, loading, error, fetchItems } = useItems()
const { addCreatedNegotiation } = useNegotiations()
const { userName } = useAuth()
const actionError = ref<string | null>(null)
const creating = ref(false)

onMounted(() => {
  fetchItems()
})

async function selectItem(itemId: number) {
  if (creating.value) return
  creating.value = true
  actionError.value = null
  try {
    await apiClient.post('/claims', { found_item_id: itemId })
    const item = foundItems.value.find(i => i.id === itemId)
    await addCreatedNegotiation(itemId, item?.name ?? '', userName.value ?? '')
    router.push({ name: 'negociacoes' })
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Erro ao criar negociação'
  } finally {
    creating.value = false
  }
}

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
  <div class="selecionar-layout">
    <AppSidebar active-item="negociacoes" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="selecionar-main">
      <div class="page-header">
        <button data-testid="btn-back" class="btn-back" @click="router.back()">
          <i class="pi pi-arrow-left"></i>
          Voltar
        </button>
        <div>
          <h1 class="page-title">Selecionar Item Encontrado</h1>
          <p class="page-sub">Selecione um item para criar uma negociação</p>
        </div>
      </div>

      <div v-if="actionError" class="action-error" data-testid="action-error">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ actionError }}</span>
      </div>

      <div v-if="loading" class="loading-state" data-testid="loading-indicator">
        <i class="pi pi-spin pi-spinner" />
        <p>Carregando itens...</p>
      </div>

      <div v-else-if="error" class="error-state" data-testid="error-message">
        <i class="pi pi-exclamation-circle" />
        <p>{{ error }}</p>
        <button class="btn-retry" @click="fetchItems()">Tentar novamente</button>
      </div>

      <div v-else class="items-grid">
        <div
          v-for="item in foundItems"
          :key="item.id"
          class="selectable-card"
          :class="{ disabled: creating }"
          @click="selectItem(item.id)"
        >
          <div class="card-thumb">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
            <div v-else class="thumb-placeholder">
              <i class="pi pi-image"></i>
            </div>
          </div>

          <div class="card-body">
            <span class="card-name">{{ item.name }}</span>
            <span class="card-location">
              <i class="pi pi-map-marker"></i>
              {{ item.locationName }}
            </span>
            <span class="card-category">{{ item.categoryName }}</span>
          </div>
        </div>

        <div v-if="foundItems.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>Nenhum item encontrado disponível.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.selecionar-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.selecionar-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
}

.btn-back:hover {
  background: #f3f4f6;
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

.action-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.selectable-card {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.selectable-card:hover {
  border-color: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.selectable-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.card-thumb {
  width: 100%;
  height: 180px;
  background: #f3f4f6;
  overflow: hidden;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  font-size: 2rem;
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.card-location {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-location i {
  font-size: 0.75rem;
}

.card-category {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #ede9fe;
  color: #4f46e5;
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
  grid-column: 1 / -1;
}

.empty-state i {
  font-size: 2.5rem;
}

.empty-state p {
  font-size: 0.9rem;
  margin: 0;
}
</style>
