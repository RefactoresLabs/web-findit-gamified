<script setup lang="ts">
import { onMounted } from 'vue'
import { useItemDetail } from '@/composables/useItemDetail'

const props = defineProps<{
  itemId: number
  itemType: 'perdido' | 'encontrado'
}>()
const emit = defineEmits<{ back: [] }>()

const { item, loading, error, fetchItem } = useItemDetail()

onMounted(() => {
  fetchItem(props.itemId, props.itemType)
})
</script>

<template>
  <div class="item-detail">
    <button class="btn-voltar" data-testid="btn-voltar" @click="emit('back')">
      <i class="pi pi-arrow-left" />
      Voltar
    </button>

    <div v-if="loading" class="loading-state" data-testid="loading-indicator">
      <i class="pi pi-spin pi-spinner" />
      <p>Carregando detalhes...</p>
    </div>

    <div v-else-if="error" class="error-state" data-testid="error-message">
      <i class="pi pi-exclamation-circle" />
      <p>{{ error }}</p>
    </div>

    <template v-else-if="item">
      <img
        v-if="item.imageUrls.length > 0"
        class="detail-foto"
        data-testid="detail-foto"
        :src="item.imageUrls[0]"
        :alt="item.name"
      />
      <div v-else class="detail-foto-placeholder" data-testid="detail-foto-placeholder">
        <i class="pi pi-image" />
      </div>

      <h1 class="detail-nome" data-testid="detail-nome">{{ item.name }}</h1>

      <p class="detail-descricao" data-testid="detail-descricao">{{ item.description }}</p>

      <div class="detail-meta">
        <span data-testid="detail-local">
          <i class="pi pi-map-marker" />
          {{ item.locationName }} · {{ item.buildingName }}
        </span>
        <span data-testid="detail-categoria">
          <i class="pi pi-tag" />
          {{ item.categoryName }}
        </span>
      </div>

      <div v-if="item.leftLocationName" class="detail-left-location" data-testid="detail-left-location">
        <i class="pi pi-flag" />
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
    </template>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.item-detail {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-voltar:hover {
  background: #f3f4f6;
}

.detail-foto {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-foto-placeholder {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  color: #d1d5db;
  font-size: 3rem;
}

.detail-nome {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.75rem;
}

.detail-descricao {
  font-size: 1rem;
  color: #4b5563;
  margin: 0 0 1.25rem;
  line-height: 1.6;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.detail-left-location {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border-radius: 0.5rem;
  border: 1px solid #bbf7d0;
}

.detail-separator {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0;
}

.detail-user h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem;
}

.detail-user p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0 0 0.5rem;
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
</style>
