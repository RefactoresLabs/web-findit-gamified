import { ref } from 'vue'
import { apiClient, ApiError } from '@/services/api'
import type { LostItemDetail, FoundItemDetail } from '@/types/api'
import type { ItemDetail } from '@/types/item'

function normalizeLostDetail(data: LostItemDetail): ItemDetail {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    userName: data.user.name,
    userEmail: data.user.email,
    userPhone: data.user.phone,
    categoryName: data.category.name,
    locationName: data.lost_building_space.name,
    buildingName: data.lost_building_space.building.name,
    buildingCep: data.lost_building_space.building.localization.cep,
    buildingNeighborhood: data.lost_building_space.building.localization.neighborhood,
    buildingStreet: data.lost_building_space.building.localization.street,
    leftLocationName: null,
    leftBuildingName: null,
    imageUrls: data.images.map((img) => img.url),
    type: 'perdido',
  }
}

function normalizeFoundDetail(data: FoundItemDetail): ItemDetail {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    userName: data.user.name,
    userEmail: data.user.email,
    userPhone: data.user.phone,
    categoryName: data.category.name,
    locationName: data.found_building_space.name,
    buildingName: data.found_building_space.building.name,
    buildingCep: data.found_building_space.building.localization.cep,
    buildingNeighborhood: data.found_building_space.building.localization.neighborhood,
    buildingStreet: data.found_building_space.building.localization.street,
    leftLocationName: data.left_building_space.name,
    leftBuildingName: data.left_building_space.building.name,
    imageUrls: data.item_image_urls,
    type: 'encontrado',
  }
}

export function useItemDetail() {
  const item = ref<ItemDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItem(id: number, type: 'perdido' | 'encontrado') {
    loading.value = true
    error.value = null
    try {
      if (type === 'perdido') {
        const data = await apiClient.get<LostItemDetail>(`/lost-items/${id}`)
        item.value = normalizeLostDetail(data)
      } else {
        const data = await apiClient.get<FoundItemDetail>(`/found-items/${id}`)
        item.value = normalizeFoundDetail(data)
      }
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erro ao carregar item'
    } finally {
      loading.value = false
    }
  }

  return { item, loading, error, fetchItem }
}
