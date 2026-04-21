<script setup lang="ts">
const emit = defineEmits<{ back: [] }>()

const GMAPS_EMBED_URL =
  'https://maps.google.com/maps?q=UNDB+Campus+Renascenca+Sao+Luis+MA&z=17&output=embed'
</script>

<template>
  <div class="map-wrapper">
    <div class="map-header">
      <button data-testid="btn-feed" class="btn-feed" @click="emit('back')">← Feed</button>
    </div>
    <div data-testid="mapa-container" class="mapa-container">
      <iframe
        :src="GMAPS_EMBED_URL"
        class="mapa-iframe"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</template>

<style scoped>
.map-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.btn-feed {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  padding: 0;
}

.btn-feed:hover {
  color: #111827;
}

.mapa-container {
  flex: 1;
  min-height: 400px;
}

.mapa-iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: none;
}
</style>
