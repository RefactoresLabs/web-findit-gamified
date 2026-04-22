<template>
  <div class="selection-view">
    <div class="selection-header">
      <h1>Registrar Item</h1>
      <p>Escolha o tipo de registro</p>
    </div>

    <div class="selection-cards">
      <!-- PERDI -->
      <div class="card">
        <div class="icon-box lost">
          <i class="pi pi-exclamation-triangle"></i>
        </div>

        <h3>Perdi algo</h3>
        <p>Registre um item que você perdeu no campus para que outros possam ajudá-lo a encontrar.</p>

        <button class="btn lost" @click="$emit('select', 'lost')">
          <i class="pi pi-plus"></i>
          Registrar Perda
        </button>
      </div>

      <!-- ENCONTREI -->
      <div class="card">
        <div class="icon-box found">
          <i class="pi pi-eye"></i>
        </div>

        <h3>Encontrei algo</h3>
        <p>Registre um item que você encontrou para ajudar o dono a recuperá-lo.</p>

        <button class="btn found" @click="$emit('select', 'found')">
          <i class="pi pi-plus"></i>
          Registrar Achado
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  select: [type: 'lost' | 'found']
}>()
</script>

<style scoped>
.selection-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.selection-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.selection-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.selection-header p {
  color: #6b7280;
}

/* GRID */
.selection-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* CARD */
.card {
  background: #f9fafb;
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* ICON BOX */
.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

/* COLORS */
.icon-box.lost {
  background: #fee2e2;
  color: #ef4444;
}

.icon-box.found {
  background: #d1fae5;
  color: #10b981;
}

/* TEXT */
.card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* BUTTON */
.btn {
  width: 100%;
  padding: 0.6rem;
  border-radius: 10px;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.2s;
}

/* BUTTON COLORS */
.btn.lost {
  border-color: #ef4444;
  color: #ef4444;
  background: transparent;
}

.btn.lost:hover {
  background: #fee2e2;
}

.btn.found {
  border-color: #10b981;
  color: #10b981;
  background: transparent;
}

.btn.found:hover {
  background: #d1fae5;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .selection-cards {
    grid-template-columns: 1fr;
  }
}
</style>