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
        <!-- PRÉDIO -->
        <div class="field">
          <label>Prédio <span class="required">*</span></label>
          <select v-model="form.predio">
            <option value="">Selecione</option>
            <option value="UNDB">UNDB</option>
          </select>
        </div>

        <!-- MAPA -->
        <div class="field">
          <label>Marque no mapa <span class="required">*</span></label>
          <div id="map" class="map"></div>

          <small v-if="form.lat !== null && form.lng !== null">
            📍 {{ form.lat.toFixed(5) }}, {{ form.lng.toFixed(5) }}
          </small>
        </div>

        <!-- DESCRIÇÃO -->
        <div class="field">
          <label>Descrição do local</label>
          <input
            v-model="form.descricao"
            type="text"
            placeholder="Ex: Sala 204, perto da escada..."
          />
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
import { reactive, computed, onMounted, watch } from 'vue'
import L from 'leaflet'

defineProps<{ type: 'lost' | 'found' }>()

type LocationData = {
  predio: string
  descricao: string
  datetime: string
  lat: number | null
  lng: number | null
}

const emit = defineEmits<{
  back: []
  submit: [data: LocationData]
}>()

const form = reactive({
  predio: '',
  descricao: '',
  datetime: '',
  lat: null as number | null,
  lng: null as number | null
})

let map: L.Map
let marker: L.Marker | null = null

// 🔥 FUNÇÃO USANDO ENV
async function buscarCoordenadas(local: string) {
  const API_URL = import.meta.env.VITE_GEOCODING_API_URL
  const FORMAT = import.meta.env.VITE_GEOCODING_FORMAT
  const CITY = import.meta.env.VITE_GEOCODING_CITY
  const COUNTRY = import.meta.env.VITE_GEOCODING_COUNTRY

  const query = `${local} ${CITY} ${COUNTRY}`

  const response = await fetch(
    `${API_URL}?q=${encodeURIComponent(query)}&format=${FORMAT}`
  )

  const data = await response.json()

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    }
  }

  return null
}

onMounted(() => {
  map = L.map('map').setView([-2.5307, -44.3068], 17)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
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

// 🔥 WATCH COM API
watch(() => form.predio, async (novoPredio) => {
  if (!map || !novoPredio) return

  const coords = await buscarCoordenadas(novoPredio)

  if (!coords) return

  const { lat, lng } = coords

  map.setView([lat, lng], 18)

  form.lat = lat
  form.lng = lng

  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng]).addTo(map)
  }
})

const isValid = computed(() => {
  return (
    form.predio !== '' &&
    form.datetime !== '' &&
    form.lat !== null &&
    form.lng !== null
  )
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