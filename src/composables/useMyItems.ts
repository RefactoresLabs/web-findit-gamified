import { ref } from 'vue'
import { apiClient, ApiError } from '@/services/api'
import type { LostItemSummary, FoundItemSummary } from '@/types/api'
import type { FeedItem } from '@/types/item'

function normalizeMyLostItem(item: LostItemSummary & { found_building_space?: { name: string } }): FeedItem {
  return {
    id: item.id,
    name: item.name,
    userName: item.user.name,
    categoryName: item.category.name,
    locationName: item.lost_building_space?.name ?? item.found_building_space?.name ?? '',
    imageUrl: item.image?.url ?? '',
    type: 'perdido',
  }
}

function normalizeFoundItem(item: FoundItemSummary): FeedItem {
  return {
    id: item.id,
    name: item.name,
    userName: item.user.name,
    categoryName: item.category.name,
    locationName: item.found_building_space.name,
    imageUrl: item.image?.url ?? '',
    type: 'encontrado',
  }
}

const myLostItems = ref<FeedItem[]>([])
const myFoundItems = ref<FeedItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useMyItems() {
  async function fetchMyItems() {
    loading.value = true
    error.value = null
    try {
      const [lostRes, foundRes] = await Promise.all([
        apiClient.get<LostItemSummary[]>('/my-lost-items'),
        apiClient.get<FoundItemSummary[]>('/my-found-items'),
      ])
      myLostItems.value = lostRes.map(normalizeMyLostItem)
      myFoundItems.value = foundRes.map(normalizeFoundItem)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erro ao carregar itens'
    } finally {
      loading.value = false
    }
  }

  return { myLostItems, myFoundItems, loading, error, fetchMyItems }
}
