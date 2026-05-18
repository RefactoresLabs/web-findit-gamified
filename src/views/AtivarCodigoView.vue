<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { apiClient } from '@/services/api'

const route = useRoute()
const router = useRouter()
const code = ref('')
const codeError = ref<string | null>(null)
const submitting = ref(false)

const claimId = route.params.id as string

function onCodeInput(event: Event) {
  const target = event.target as HTMLInputElement
  code.value = target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 10).toUpperCase()
  target.value = code.value
}

async function handleConfirm() {
  if (code.value.length !== 10 || submitting.value) return
  submitting.value = true
  codeError.value = null
  try {
    await apiClient.patch(`/claims/${claimId}/complete-retrieval`, {
      retrieval_code: code.value,
    })
    router.push({ name: 'codigo-ativado', params: { id: claimId } })
  } catch (e) {
    codeError.value = e instanceof Error ? e.message : 'Erro ao ativar código'
  } finally {
    submitting.value = false
  }
}

type RouteKey = 'explorar' | 'registrar' | 'meus-itens' | 'negociacoes'
const routesMap: Record<RouteKey, { name: RouteKey }> = {
  explorar: { name: 'explorar' },
  registrar: { name: 'registrar' },
  'meus-itens': { name: 'meus-itens' },
  negociacoes: { name: 'negociacoes' },
}

function handleNavigate(item: string) {
  if (item in routesMap) router.push(routesMap[item as RouteKey])
}

function handleLogout() {
  window.location.href = '/'
}
</script>

<template>
  <div class="ativar-layout">
    <AppSidebar active-item="negociacoes" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="ativar-main">
      <div class="page-header">
        <button data-testid="btn-back" class="btn-back" @click="router.back()">
          <i class="pi pi-arrow-left"></i>
          Voltar
        </button>
        <h1 class="page-title">Ativação de Código</h1>
      </div>

      <div class="code-card">
        <div class="code-icon">
          <i class="pi pi-key"></i>
        </div>

        <p class="code-instruction">
          Digite o código de recuperação de 10 dígitos para finalizar a negociação.
        </p>

        <input
          data-testid="code-input"
          class="code-input"
          type="text"
          maxlength="10"
          placeholder="XXXXXXXXXX"
          :value="code"
          @input="onCodeInput"
        />

        <div v-if="codeError" class="code-error" data-testid="code-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ codeError }}</span>
        </div>

        <button
          data-testid="btn-confirm"
          class="btn-confirm"
          :disabled="code.length !== 10 || submitting"
          @click="handleConfirm"
        >
          <i class="pi pi-check-circle"></i>
          {{ submitting ? 'Verificando...' : 'Confirmar Código' }}
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.ativar-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.ativar-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
}

.btn-back:hover {
  background: #f3f4f6;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.code-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2.5rem;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.code-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ede9fe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-size: 1.75rem;
}

.code-instruction {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.code-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.625rem;
  font-size: 1.5rem;
  font-family: 'Courier New', monospace;
  text-align: center;
  letter-spacing: 0.25em;
  outline: none;
  transition: border-color 0.15s;
}

.code-input:focus {
  border-color: #4f46e5;
}

.code-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  width: 100%;
}

.btn-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.625rem;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-confirm:hover:not(:disabled) {
  background: #4338ca;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
