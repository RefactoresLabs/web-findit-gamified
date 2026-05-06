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
        <p class="step-sub">Passo 2 de 3 — Detalhes</p>
      </div>
    </div>

    <div class="stepper">
      <div class="step done">✓</div>
      <div class="step-line active-line"></div>
      <div class="step active">2</div>
      <div class="step-line"></div>
      <div class="step">3</div>
    </div>

    <div class="card">
      <h3>Detalhes do Item</h3>
      <p class="card-sub">Preencha as informações sobre o item</p>

      <div class="form">
        <div class="field">
          <label>Nome</label>
          <input type="text" placeholder="Seu nome completo" disabled :value="userName" />
        </div>

        <div class="field">
          <label>E-mail</label>
          <input type="email" placeholder="Seu e-mail" disabled :value="userEmail" />
        </div>

        <div class="field">
          <label>Nome do Item <span class="required">*</span></label>
          <input v-model="form.itemName" type="text" placeholder="Ex: Carteira preta, Óculos de sol..." />
        </div>

        <div class="field">
          <label>Categoria <span class="required">*</span></label>
          <select v-model.number="form.category_id">
            <option value="0" disabled>Selecione uma categoria</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>Descrição <span class="required">*</span></label>
          <textarea
            v-model="form.description"
            placeholder="Descreva o item brevemente: cor, marca, características..."
            rows="4"
          />
        </div>
      </div>
    </div>

    <div class="step-footer">
      <button class="btn-secondary" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Voltar
      </button>
      <button class="btn-primary" :disabled="!isValid" @click="$emit('next', form)">
        Próximo
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { categories } from '@/data/static'

const props = defineProps<{
  type: 'lost' | 'found'
  userName?: string
  userEmail?: string
}>()

defineEmits<{ back: []; next: [data: typeof form] }>()

const form = reactive({
  name: props.userName ?? '',
  email: props.userEmail ?? '',
  itemName: '',
  category_id: 0,
  description: '',
})

const isValid = computed(() =>
  form.itemName.trim() !== '' &&
  form.category_id > 0 &&
  form.description.trim() !== '',
)
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

.step.active { background: #3b82f6; color: #fff; }
.step.done { background: #3b82f6; color: #fff; font-size: 0.75rem; }

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
}

.step-line.active-line { background: #3b82f6; }

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

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form {
    gap: 0.75rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d3748;
}

.required { color: #e53e3e; }

.field input,
.field select,
.field textarea {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #2d3748;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
  resize: vertical;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #3b82f6;
}

.field input:disabled {
  background: #f7fafc;
  color: #718096;
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

@media (max-width: 768px) {
  .btn-secondary {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
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

@media (max-width: 768px) {
  .btn-primary {
    padding: 0.6rem 1.4rem;
    font-size: 0.85rem;
  }
}

.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }
</style>