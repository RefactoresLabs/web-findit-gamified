<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useItems } from '@/composables/useItems'
import SearchBar from '@/components/ui/SearchBar.vue'
import TabFilter from '@/components/ui/TabFilter.vue'
import ItemCard from '@/components/ui/ItemCard.vue'

const emit = defineEmits<{
  showDetail: [id: number, type: 'perdido' | 'encontrado']
  showMap: []
}>()

const { lostItems, foundItems, loading, error, fetchItems } = useItems()
const searchQuery = ref('')
const activeTab = ref('perdido')

onMounted(() => {
  fetchItems()
})

const currentItems = computed(() =>
  activeTab.value === 'perdido' ? lostItems.value : foundItems.value,
)

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return currentItems.value.filter(
    (i) =>
      !query || i.name.toLowerCase().includes(query) || i.locationName.toLowerCase().includes(query),
  )
})

const tabs = computed(() => [
  { key: 'perdido', label: 'Itens Perdidos', count: lostItems.value.length },
  { key: 'encontrado', label: 'Itens Encontrados', count: foundItems.value.length },
])
</script>

<template>
  <div class="explorar-feed">
    <header class="feed-header">
      <h1 class="feed-title" data-testid="feed-title">Explorar Itens</h1>
      <p class="feed-subtitle" data-testid="feed-subtitle">
        Encontre ou registre itens perdidos no campus
      </p>
    </header>

    <div class="feed-controls">
      <SearchBar v-model="searchQuery" />
      <div class="view-buttons">
        <button class="btn-view active" data-testid="btn-feed">Feed</button>
        <button class="btn-view" data-testid="btn-map" @click="emit('showMap')">Mapa</button>
      </div>
    </div>

    <TabFilter v-model="activeTab" :tabs="tabs" />

    <div v-if="loading" class="loading-state" data-testid="loading-indicator">
      <i class="pi pi-spin pi-spinner" />
      <p>Carregando itens...</p>
    </div>

    <div v-else-if="error" class="error-state" data-testid="error-message">
      <i class="pi pi-exclamation-circle" />
      <p>{{ error }}</p>
      <button class="btn-retry" @click="fetchItems()">Tentar novamente</button>
    </div>

    <div v-else class="items-grid" data-testid="items-grid">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @select="emit('showDetail', $event, activeTab as 'perdido' | 'encontrado')"
      />
    </div>
  </div>
</template>

<style scoped>
.explorar-feed {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feed-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.feed-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.feed-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.feed-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.view-buttons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-view {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.btn-view.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #ffffff;
}

.btn-view:hover:not(.active) {
  border-color: #9ca3af;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
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

@media (max-width: 1024px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
