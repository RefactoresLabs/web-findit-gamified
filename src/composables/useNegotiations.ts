import { ref } from 'vue'
import { apiClient, ApiError } from '@/services/api'
import type { ClaimSummary, ClaimDetail } from '@/types/api'
import type { NegotiationItem } from '@/types/item'

const STORAGE_KEY = 'mock_negotiations'
const MAX_ID_KEY = 'mock_last_max_claim_id'

function normalizeClaimSummary(claim: ClaimSummary): NegotiationItem {
  return {
    id: claim.id,
    itemId: claim.associated_found_item.id,
    itemName: claim.associated_found_item.name,
    status: claim.status.name,
    userName: claim.claimant_user_account.name,
    createdAt: claim.created_at,
  }
}

function loadFromStorage(): { created: NegotiationItem[]; received: NegotiationItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { created: [], received: [] }
    return JSON.parse(raw)
  } catch {
    return { created: [], received: [] }
  }
}

function saveToStorage(created: NegotiationItem[], received: NegotiationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ created, received }))
}

function getLastMaxClaimId(): number {
  return Number(localStorage.getItem(MAX_ID_KEY)) || 0
}

function setLastMaxClaimId(id: number) {
  localStorage.setItem(MAX_ID_KEY, String(id))
}

const stored = loadFromStorage()
const createdNegotiations = ref<NegotiationItem[]>(stored.created)
const receivedNegotiations = ref<NegotiationItem[]>(stored.received)
const loading = ref(false)
const error = ref<string | null>(null)

export function useNegotiations() {
  async function fetchNegotiations() {
    loading.value = true
    error.value = null
    try {
      // TODO: descomentar quando backend implementar GET /my-created-claims e GET /my-received-claims
      // const [createdRes, receivedRes] = await Promise.all([
      //   apiClient.get<ClaimSummary[]>('/my-created-claims'),
      //   apiClient.get<ClaimSummary[]>('/my-received-claims'),
      // ])
      // createdNegotiations.value = createdRes.map(normalizeClaimSummary)
      // receivedNegotiations.value = receivedRes.map(normalizeClaimSummary)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erro ao carregar negociações'
    } finally {
      loading.value = false
    }
  }

  async function discoverRealClaimId(foundItemId: number): Promise<number | null> {
    const startId = getLastMaxClaimId() + 1
    for (let id = startId; id < startId + 10; id++) {
      try {
        const claim = await apiClient.get<ClaimDetail>(`/claim/${id}`)
        setLastMaxClaimId(id)
        if (claim.associated_found_item.id === foundItemId && claim.status.name === 'Pendente') {
          return claim.id
        }
      } catch {
        break
      }
    }
    return null
  }

  async function addCreatedNegotiation(itemId: number, itemName: string, userName: string) {
    const realId = await discoverRealClaimId(itemId)

    const negotiation: NegotiationItem = {
      id: realId ?? Date.now(),
      itemId,
      itemName,
      status: 'Pendente',
      userName,
      createdAt: new Date().toISOString(),
    }
    createdNegotiations.value.push(negotiation)
    saveToStorage(createdNegotiations.value, receivedNegotiations.value)
  }

  function updateNegotiationStatus(id: number, status: string) {
    const item = createdNegotiations.value.find(n => n.id === id)
      ?? receivedNegotiations.value.find(n => n.id === id)
    if (item) {
      item.status = status
      saveToStorage(createdNegotiations.value, receivedNegotiations.value)
    }
  }

  function isMockNegotiation(id: number): boolean {
    return id > 1_000_000_000_000
  }

  function getMockNegotiation(id: number): NegotiationItem | undefined {
    return createdNegotiations.value.find(n => n.id === id)
      ?? receivedNegotiations.value.find(n => n.id === id)
  }

  return {
    createdNegotiations,
    receivedNegotiations,
    loading,
    error,
    fetchNegotiations,
    addCreatedNegotiation,
    updateNegotiationStatus,
    isMockNegotiation,
    getMockNegotiation,
  }
}
