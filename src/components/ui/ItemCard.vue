<script setup lang="ts">
import type { FeedItem } from '@/types/item'
import CategoryChip from '@/components/ui/CategoryChip.vue'

defineProps<{ item: FeedItem }>()
defineEmits<{ select: [id: number] }>()
</script>

<template>
  <div class="item-card" data-testid="item-card" @click="$emit('select', item.id)">
    <img
      v-if="item.imageUrl"
      :src="item.imageUrl"
      :alt="item.name"
      class="item-card-image"
      data-testid="item-card-image"
    />
    <div v-else class="item-card-placeholder" data-testid="item-card-placeholder">
      <i class="pi pi-image" />
    </div>
    <div class="item-card-body">
      <p class="item-card-name" data-testid="item-card-name">{{ item.name }}</p>
      <p class="item-card-local" data-testid="item-card-local">
        <i class="pi pi-map-marker" />
        {{ item.locationName }}
      </p>
      <CategoryChip :categoria="item.categoryName" />
    </div>
  </div>
</template>

<style scoped>
.item-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.item-card-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #d1d5db;
  font-size: 2rem;
}

.item-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.item-card-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.item-card-local {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.item-card-local .pi {
  font-size: 0.75rem;
}
</style>
