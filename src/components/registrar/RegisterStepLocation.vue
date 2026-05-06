<template>
  <div class="step-view">
    <!-- HEADER -->
    <div class="step-header">
      <button class="back-btn" @click="$emit('back')">←</button>

      <div>
        <div class="step-title-row">
          <h2>Registrar Item</h2>
          <span class="badge" :class="type === 'lost' ? 'badge-lost' : 'badge-found'">
            {{ type === 'lost' ? 'Perdido' : 'Encontrado' }}
          </span>
        </div>
        <p class="step-sub">Passo 3 de 3 — Localização</p>
      </div>
    </div>

    <!-- STEPPER -->
    <div class="stepper">
      <div class="step done">✓</div>
      <div class="step-line active-line"></div>
      <div class="step done">✓</div>
      <div class="step-line active-line"></div>
      <div class="step active">3</div>
    </div>

    <!-- CARD -->
    <div class="card">
      <h3>{{ type === 'lost' ? 'Onde foi perdido?' : 'Onde foi encontrado?' }}</h3>
      <p class="card-sub">Informe o local para facilitar a recuperação</p>

      <div class="form">
        <div class="field">
          <label>Prédio <span class="required">*</span></label>
          <select v-model.number="form.building_id">
            <option value="0" disabled>Selecione o prédio</option>
            <option v-for="b in buildings" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>Local <span class="required">*</span></label>
          <select v-model.number="form.building_space_id">
            <option value="0" disabled>Selecione o local</option>
            <option v-for="space in buildingSpaces" :key="space.id" :value="space.id">
              {{ space.name }}
            </option>
          </select>
        </div>

        <div v-if="type === 'found'" class="field">
          <label>Onde o item foi deixado <span class="required">*</span></label>
          <select v-model.number="form.left_building_space_id">
            <option value="0" disabled>Selecione o local</option>
            <option v-for="space in buildingSpaces" :key="space.id" :value="space.id">
              {{ space.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>Marque no mapa <span class="required">*</span></label>
          <div id="map" class="map"></div>

          <small v-if="form.lat !== null && form.lng !== null">
            {{ form.lat.toFixed(5) }}, {{ form.lng.toFixed(5) }}
          </small>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="step-footer">
      <button class="btn-secondary" @click="$emit('back')">
        Voltar
      </button>

      <button class="btn-primary" :disabled="!isValid" @click="handleSubmit">
        Finalizar Registro
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted } from 'vue'
import L from 'leaflet'
import { buildings, buildingSpaces } from '@/data/static'

const props = defineProps<{ type: 'lost' | 'found' }>()

type LocationData = {
  building_space_id: number
  left_building_space_id: number
  lat: number | null
  lng: number | null
}

const emit = defineEmits<{
  back: []
  submit: [data: LocationData]
}>()

const form = reactive({
  building_id: 0,
  building_space_id: 0,
  left_building_space_id: 0,
  lat: null as number | null,
  lng: null as number | null,
})

let map: L.Map
let marker: L.Marker | null = null

onMounted(() => {
  map = L.map('map').setView([-2.50, -44.29], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)

  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    form.lat = lat
    form.lng = lng
    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(map)
    }
  })
})

watch(() => form.building_id, (id) => {
  const building = buildings.find(b => b.id === id)
  if (!building) return
  const latlng: L.LatLngExpression = [building.lat, building.lng]
  map.flyTo(latlng, 17)
  form.lat = building.lat
  form.lng = building.lng
  if (marker) {
    marker.setLatLng(latlng)
  } else {
    marker = L.marker(latlng).addTo(map)
  }
})

const isValid = computed(() => {
  if (form.building_id === 0) return false
  if (form.building_space_id === 0) return false
  if (form.lat === null || form.lng === null) return false
  if (props.type === 'found' && form.left_building_space_id === 0) return false
  return true
})

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', form)
}
</script>

<style scoped>
.step-view {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-header {
  display: flex;
  gap: 1rem;
}

.step-title-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge {
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.badge-lost {
  background: #ef4444;
  color: white;
}

.badge-found {
  background: #10b981;
  color: white;
}

.stepper {
  display: flex;
  align-items: center;
}

.step {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step.active,
.step.done {
  background: #3b82f6;
  color: white;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
}

.active-line {
  background: #3b82f6;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

input, select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.map {
  height: 250px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.step-footer {
  display: flex;
  justify-content: space-between;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  border: none;
}

.btn-primary:disabled {
  background: #93c5fd;
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
}
</style>
