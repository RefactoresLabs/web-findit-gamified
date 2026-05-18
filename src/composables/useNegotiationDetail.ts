import { ref } from 'vue'
import { apiClient, ApiError } from '@/services/api'
import type { ClaimDetail } from '@/types/api'
import { useNegotiations } from '@/composables/useNegotiations'

export interface NegotiationDetail {
  id: number
  status: string
  claimantName: string
  claimantPhone: string
  itemId: number
  itemName: string
  itemOwnerName: string
  itemOwnerPhone: string
  createdAt: string
  retrievalCode: string
}

function normalizeClaimDetail(claim: ClaimDetail): NegotiationDetail {
  return {
    id: claim.id,
    status: claim.status.name,
    claimantName: claim.claimant_user_account.name,
    claimantPhone: claim.claimant_user_account.phone,
    itemId: claim.associated_found_item.id,
    itemName: claim.associated_found_item.name,
    itemOwnerName: claim.associated_found_item.user?.name ?? '',
    itemOwnerPhone: claim.associated_found_item.user?.phone ?? '',
    createdAt: claim.created_at,
    retrievalCode: claim.retrieval_code,
  }
}

export function useNegotiationDetail() {
  const detail = ref<NegotiationDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { isMockNegotiation, getMockNegotiation, updateNegotiationStatus } = useNegotiations()

  async function fetchDetail(id: number) {
    loading.value = true
    error.value = null
    try {
      if (isMockNegotiation(id)) {
        const mock = getMockNegotiation(id)
        if (mock) {
          detail.value = {
            id: mock.id,
            status: mock.status,
            claimantName: mock.userName || 'Você',
            claimantPhone: '',
            itemId: mock.itemId,
            itemName: mock.itemName,
            itemOwnerName: '',
            itemOwnerPhone: '',
            createdAt: mock.createdAt,
            retrievalCode: '',
          }
        } else {
          error.value = 'Negociação não encontrada'
        }
      } else {
        const res = await apiClient.get<ClaimDetail>(`/claim/${id}`)
        detail.value = normalizeClaimDetail(res)
      }
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erro ao carregar negociação'
    } finally {
      loading.value = false
    }
  }

  async function acceptClaim(id: number) {
    error.value = null
    try {
      if (isMockNegotiation(id)) {
        updateNegotiationStatus(id, 'Aceita')
      } else {
        await apiClient.patch(`/claims/${id}/accept`)
        updateNegotiationStatus(id, 'Aceita')
      }
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erro ao aceitar negociação'
    }
  }

  async function rejectClaim(id: number) {
    error.value = null
    try {
      if (isMockNegotiation(id)) {
        updateNegotiationStatus(id, 'Rejeitada')
      } else {
        await apiClient.patch(`/claims/${id}/reject`)
        updateNegotiationStatus(id, 'Rejeitada')
      }
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erro ao rejeitar negociação'
    }
  }

  return { detail, loading, error, fetchDetail, acceptClaim, rejectClaim }
}
