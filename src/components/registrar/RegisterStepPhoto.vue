<template>
  <div class="step-view">
    <div class="step-header">
      <button class="back-btn" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>
      <div>
        <div class="step-title-row">
          <h2>Registrar Item</h2>
          <span class="badge" :class="type === 'lost' ? 'badge-lost' : 'badge-found'">
            {{ type === 'lost' ? 'Perdido' : 'Encontrado' }}
          </span>
        </div>
        <p class="step-sub">Passo 1 de 3 — Foto</p>
      </div>
    </div>

    <div class="stepper">
      <div class="step active">1</div>
      <div class="step-line"></div>
      <div class="step">2</div>
      <div class="step-line"></div>
      <div class="step">3</div>
    </div>

    <div class="card">
      <h3>Foto do Item</h3>
      <p class="card-sub">Adicione uma foto para facilitar a identificação</p>

      <div
        class="upload-area"
        :class="{ 'has-image': previewUrl, 'dragging': isDragging }"
        @click="triggerUpload"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input ref="fileInput" type="file" accept="image/png,image/jpeg" class="hidden-input" @change="handleFile" />
        <template v-if="!previewUrl">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          <span class="upload-label">Clique para enviar uma foto</span>
          <span class="upload-hint">PNG, JPG até 5MB</span>
        </template>
        <template v-else>
          <img :src="previewUrl" alt="Preview" class="preview-img" />
          <button class="remove-btn" @click.stop="removeImage">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </template>
      </div>
    </div>

    <div class="step-footer">
      <button class="btn-secondary" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Voltar
      </button>
      <button class="btn-primary" @click="$emit('next', { photo: previewUrl })">
        Próximo
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ type: 'lost' | 'found' }>()
defineEmits<{ back: []; next: [data: { photo: string | null }] }>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)

function triggerUpload() {
  fileInput.value?.click()
}

function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) processFile(file)
}

function processFile(file: File) {
  if (file.size > 5 * 1024 * 1024) return alert('Arquivo muito grande. Máximo 5MB.')
  const reader = new FileReader()
  reader.onload = (e) => { previewUrl.value = e.target?.result as string }
  reader.readAsDataURL(file)
}

function removeImage() {
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.step-view {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4a5568;
  padding: 0.25rem;
  margin-top: 0.25rem;
}

.step-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-title-row h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.badge {
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-lost { background: #e53e3e; color: #fff; }
.badge-found { background: #38a169; color: #fff; }

.step-sub {
  font-size: 0.85rem;
  color: #718096;
  margin: 0.25rem 0 0;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 0;
}

.step {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #a0aec0;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step.active {
  background: #3b82f6;
  color: #fff;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }
}

.card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.card-sub {
  font-size: 0.875rem;
  color: #718096;
  margin: 0 0 0.75rem;
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 0.75rem;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .upload-area {
    min-height: 180px;
  }
}

.upload-area:hover, .upload-area.dragging {
  border-color: #3b82f6;
  background: #ebf8ff;
}

.upload-area.has-image {
  border-style: solid;
  border-color: #e2e8f0;
  padding: 0;
}

.hidden-input {
  display: none;
}

.upload-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.upload-hint {
  font-size: 0.8rem;
  color: #a0aec0;
}

.preview-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 0.6rem;
}

@media (max-width: 768px) {
  .preview-img {
    height: 180px;
  }
}

.remove-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #1a202c;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.step-footer {
  display: flex;
  justify-content: space-between;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #4a5568;
  cursor: pointer;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover { background: #2563eb; }
</style>