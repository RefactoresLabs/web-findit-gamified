<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useNegotiationDetail } from '@/composables/useNegotiationDetail'

const route = useRoute()
const router = useRouter()
const { detail, loading, error, fetchDetail, acceptClaim, rejectClaim } = useNegotiationDetail()

const claimId = computed(() => Number(route.params.id))
const role = computed(() => (route.query.role as string) || 'criada')
const isReceived = computed(() => role.value === 'recebida')

const showAcceptReject = computed(
  () => isReceived.value && detail.value?.status === 'Pendente',
)
const showComplete = computed(
  () => isReceived.value && detail.value?.status === 'Aceita',
)

onMounted(() => {
  fetchDetail(claimId.value)
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    Pendente: 'status-pendente',
    Aceita: 'status-aceita',
    Rejeitada: 'status-rejeitada',
    Finalizada: 'status-finalizada',
  }
  return map[status] ?? ''
}

async function handleAccept() {
  await acceptClaim(claimId.value)
  await fetchDetail(claimId.value)
}

async function handleReject() {
  await rejectClaim(claimId.value)
  await fetchDetail(claimId.value)
}

function handleComplete() {
  router.push({ name: 'ativar-codigo', params: { id: detail.value!.id } })
}

function goToItem() {
  router.push({ path: `/item/${detail.value!.itemId}`, query: { type: 'encontrado' } })
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
  <div class="detail-layout">
    <AppSidebar active-item="negociacoes" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="detail-main">
      <div class="page-header">
        <button data-testid="btn-back" class="btn-back" @click="router.back()">
          <i class="pi pi-arrow-left"></i>
          Voltar
        </button>
        <h1 class="page-title">Detalhes da Negociação</h1>
      </div>

      <div v-if="loading" class="loading-state" data-testid="loading-indicator">
        <i class="pi pi-spin pi-spinner" />
        <p>Carregando detalhes...</p>
      </div>

      <div v-else-if="error" class="error-state" data-testid="error-message">
        <i class="pi pi-exclamation-circle" />
        <p>{{ error }}</p>
      </div>

      <div v-else-if="detail" class="detail-content">
        <div class="detail-card">
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="status-badge" :class="statusClass(detail.status)">
              {{ detail.status }}
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Item encontrado</span>
            <a data-testid="item-link" class="item-link" @click="goToItem">
              {{ detail.itemName }}
              <i class="pi pi-external-link"></i>
            </a>
          </div>

          <div class="detail-row">
            <span class="detail-label">Dono do item</span>
            <span class="detail-value">{{ detail.itemOwnerName }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Telefone do dono</span>
            <span class="detail-value">{{ detail.itemOwnerPhone }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Criado em</span>
            <span class="detail-value">{{ formatDate(detail.createdAt) }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Solicitante</span>
            <span class="detail-value">{{ detail.claimantName }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Telefone do solicitante</span>
            <span class="detail-value">{{ detail.claimantPhone }}</span>
          </div>

          <div v-if="detail.retrievalCode" class="detail-row">
            <span class="detail-label">Código de recuperação</span>
            <span class="detail-value code-value">{{ detail.retrievalCode }}</span>
          </div>
        </div>

        <div class="actions">
          <template v-if="showAcceptReject">
            <button data-testid="btn-accept" class="btn btn-accept" @click="handleAccept">
              <i class="pi pi-check"></i>
              Aceitar
            </button>
            <button data-testid="btn-reject" class="btn btn-reject" @click="handleReject">
              <i class="pi pi-times"></i>
              Rejeitar
            </button>
          </template>

          <button
            v-if="showComplete"
            data-testid="btn-complete"
            class="btn btn-complete"
            @click="handleComplete"
          >
            <i class="pi pi-check-circle"></i>
            Completar Negociação
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.detail-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.detail-main {
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

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
}

.detail-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.code-value {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.item-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.item-link:hover {
  text-decoration: underline;
}

.item-link i {
  font-size: 0.75rem;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pendente {
  background: #fef3c7;
  color: #92400e;
}

.status-aceita {
  background: #d1fae5;
  color: #065f46;
}

.status-rejeitada {
  background: #fee2e2;
  color: #991b1b;
}

.status-finalizada {
  background: #dbeafe;
  color: #1e40af;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border-radius: 0.625rem;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.15s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-accept {
  background: #22c55e;
  color: #fff;
}

.btn-accept:hover {
  background: #16a34a;
}

.btn-reject {
  background: #ef4444;
  color: #fff;
}

.btn-reject:hover {
  background: #dc2626;
}

.btn-complete {
  background: #4f46e5;
  color: #fff;
}

.btn-complete:hover {
  background: #4338ca;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6b7280;
  gap: 0.75rem;
}

.loading-state i,
.error-state i {
  font-size: 2rem;
}

.loading-state p,
.error-state p {
  margin: 0;
  font-size: 0.9375rem;
}

.error-state {
  color: #ef4444;
}
</style>
