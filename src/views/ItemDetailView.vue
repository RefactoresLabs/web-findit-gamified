<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useItemDetail } from '@/composables/useItemDetail'
import type { RouteLocationRaw } from 'vue-router'

type RouteKey = 'explorar' | 'registrar' | 'meus-itens' | 'negociacoes'

const route = useRoute()
const router = useRouter()
const { item, loading, error, fetchItem } = useItemDetail()

onMounted(() => {
  const id = Number(route.params.id)
  const type = (route.query.type as 'perdido' | 'encontrado') || 'perdido'
  fetchItem(id, type)
})

const routesMap: Record<RouteKey, RouteLocationRaw> = {
  explorar: { name: 'explorar' },
  registrar: { name: 'registrar' },
  'meus-itens': { name: 'meus-itens' },
  negociacoes: { name: 'negociacoes' },
}

function handleNavigate(itemKey: string) {
  if (routesMap[itemKey as RouteKey]) {
    router.push(routesMap[itemKey as RouteKey])
  }
}

function handleLogout() {
  window.location.href = '/'
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="detail-layout">
    <AppSidebar
      active-item="meus-itens"
      @navigate="handleNavigate"
      @logout="handleLogout"
    />

    <main class="detail-main">
      <div class="page-header">
        <button class="back-btn" data-testid="back-btn" @click="goBack">
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h1 class="page-title">Detalhes do Item</h1>
          <p class="page-sub">Informações completas</p>
        </div>
      </div>

      <div v-if="loading" class="loading-state" data-testid="loading-indicator">
        <i class="pi pi-spin pi-spinner" />
        <p>Carregando detalhes...</p>
      </div>

      <div v-else-if="error" class="error-state" data-testid="error-message">
        <i class="pi pi-exclamation-circle" />
        <p>{{ error }}</p>
      </div>

      <div v-else-if="item" class="detail-card">
        <div class="detail-image">
          <img v-if="item.imageUrls.length > 0" :src="item.imageUrls[0]" data-testid="detail-image" />
          <div v-else class="image-placeholder" data-testid="detail-image-placeholder">
            <i class="pi pi-image"></i>
          </div>
        </div>

        <div class="detail-info">
          <span
            class="item-badge"
            :class="item.type === 'perdido' ? 'badge-lost' : 'badge-found'"
          >
            {{ item.type === 'perdido' ? 'Perdido' : 'Encontrado' }}
          </span>

          <h2 class="detail-title" data-testid="detail-title">{{ item.name }}</h2>

          <p class="detail-description" data-testid="detail-description">
            {{ item.description }}
          </p>

          <div class="detail-location" data-testid="detail-location">
            <i class="pi pi-map-marker"></i>
            {{ item.locationName }} · {{ item.buildingName }}
          </div>

          <div v-if="item.leftLocationName" class="detail-left-location" data-testid="detail-left-location">
            <i class="pi pi-flag"></i>
            Deixado em: {{ item.leftLocationName }} · {{ item.leftBuildingName }}
          </div>

          <hr class="detail-separator" />

          <div class="detail-user">
            <h3>Reportado por</h3>
            <p data-testid="detail-user-name">
              <i class="pi pi-user" />
              {{ item.userName }}
            </p>
            <p data-testid="detail-user-email">
              <i class="pi pi-envelope" />
              {{ item.userEmail }}
            </p>
            <p data-testid="detail-user-phone">
              <i class="pi pi-phone" />
              {{ item.userPhone }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.detail-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'Inter', sans-serif;
}

.detail-main {
  flex: 1;
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

.back-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  padding: 0.5rem;
  cursor: pointer;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.page-sub {
  font-size: 0.85rem;
  color: #6b7280;
}

.detail-card {
  display: flex;
  gap: 2rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.detail-image {
  width: 300px;
  height: 300px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #d1d5db;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.detail-description {
  font-size: 0.9rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.6;
}

.detail-location {
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-left-location {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.85rem;
  color: #6b7280;
  padding: 0.75rem;
  background: #f0fdf4;
  border-radius: 0.5rem;
  border: 1px solid #bbf7d0;
}

.detail-separator {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}

.detail-user h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem;
}

.detail-user p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0 0 0.4rem;
}

.item-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-lost {
  background: #ef4444;
  color: #fff;
}

.badge-found {
  background: #22c55e;
  color: #fff;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
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

@media (max-width: 768px) {
  .detail-main {
    padding: 1.25rem;
  }

  .detail-card {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem;
  }

  .detail-image {
    width: 100%;
    height: 220px;
  }
}
</style>
