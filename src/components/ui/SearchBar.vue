<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="search-bar">
    <i class="pi pi-search search-icon" />
    <input
      :value="modelValue"
      type="text"
      placeholder="Buscar por nome ou local..."
      class="search-input"
      data-testid="search-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.875rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.search-input:focus {
  border-color: #4f46e5;
}

.search-input::placeholder {
  color: #9ca3af;
}
</style>
