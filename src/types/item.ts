export interface FeedItem {
  id: number
  name: string
  userName: string
  categoryName: string
  locationName: string
  imageUrl: string
  type: 'perdido' | 'encontrado'
}

export interface ItemDetail {
  id: number
  name: string
  description: string
  userName: string
  userEmail: string
  userPhone: string
  categoryName: string
  locationName: string
  buildingName: string
  buildingCep: string
  buildingNeighborhood: string
  buildingStreet: string
  leftLocationName: string | null
  leftBuildingName: string | null
  imageUrls: string[]
  type: 'perdido' | 'encontrado'
}
