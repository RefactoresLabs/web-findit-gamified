<script setup lang="ts">
defineProps<{
  tabs: { key: string; label: string; count: number }[]
  modelValue: string
}>()
defineEmits<{ 'update:modelValue': [key: string] }>()
</script>

<template>
  <div class="tab-filter">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :data-testid="`tab-${tab.key}`"
      :class="['tab-pill', { active: modelValue === tab.key }]"
      @click="$emit('update:modelValue', tab.key)"
    >
      {{ tab.label }} ({{ tab.count }})
    </button>
  </div>
</template>

<style scoped>
.tab-filter {
  display: flex;
  gap: 0.5rem;
}

.tab-pill {
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.tab-pill.active {
  border-color: #111827;
  color: #111827;
}

.tab-pill:hover:not(.active) {
  border-color: #9ca3af;
  color: #374151;
}
</style>
