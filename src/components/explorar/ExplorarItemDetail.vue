<script setup lang="ts">
import { computed } from 'vue'
import { useItems } from '@/composables/useItems'
import CategoryChip from '@/components/ui/CategoryChip.vue'

const props = defineProps<{ itemId: number }>()
const emit = defineEmits<{ back: [] }>()

const { items } = useItems()
const item = computed(() => items.value.find((i) => i.id === props.itemId))
</script>

<template>
  <div class="item-detail" v-if="item">
    <button class="btn-voltar" data-testid="btn-voltar" @click="emit('back')">
      <i class="pi pi-arrow-left" />
      Voltar
    </button>

    <img
      class="detail-foto"
      data-testid="detail-foto"
      :src="item.foto"
      :alt="item.nome"
    />

    <h1 class="detail-nome" data-testid="detail-nome">{{ item.nome }}</h1>

    <p class="detail-descricao" data-testid="detail-descricao">{{ item.descricao }}</p>

    <div class="detail-meta">
      <span data-testid="detail-local">
        <i class="pi pi-map-marker" />
        {{ item.local }}
      </span>
      <span data-testid="detail-data">
        <i class="pi pi-calendar" />
        {{ item.data }}
      </span>
      <span data-testid="detail-reportado-por">
        <i class="pi pi-user" />
        {{ item.reportadoPor }}
      </span>
    </div>

    <CategoryChip :categoria="item.categoria" />

    <hr class="detail-separator" data-testid="detail-separator" />

    <p class="detail-status" data-testid="detail-status">{{ item.status }}</p>
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

.detail-separator {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0;
}

.detail-status {
  font-size: 0.9375rem;
  color: #374151;
  font-weight: 500;
}
</style>
