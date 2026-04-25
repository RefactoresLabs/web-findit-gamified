<script setup lang="ts">
defineProps<{ categoria: string }>()
</script>

<template>
  <span class="category-chip" data-testid="category-chip">{{ categoria }}</span>
</template>

<style scoped>
.category-chip {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #ede9fe;
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
