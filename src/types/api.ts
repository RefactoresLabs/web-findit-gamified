export interface Category {
  id: number
  name: string
}

export interface Localization {
  cep: string
  neighborhood: string
  street: string
}

export interface Building {
  id: number
  name: string
  localization: Localization
  lat: number
  lng: number
}

export interface BuildingSpace {
  id: number
  name: string
}

export interface ItemImage {
  url: string
}

export interface ItemUserSummary {
  name: string
}

export interface ItemUserDetail {
  name: string
  email: string
  phone: string
}

export interface CategorySummary {
  name: string
}

export interface BuildingSpaceSummary {
  name: string
}

export interface BuildingSpaceDetail {
  name: string
  building: {
    name: string
    localization: Localization
  }
}

export interface LostItemSummary {
  id: number
  name: string
  user: ItemUserSummary
  category: CategorySummary
  lost_building_space: BuildingSpaceSummary
  image: ItemImage
}

export interface LostItemDetail {
  id: number
  name: string
  description: string
  user: ItemUserDetail
  category: CategorySummary
  lost_building_space: BuildingSpaceDetail
  images: ItemImage[]
}

export interface FoundItemSummary {
  id: number
  name: string
  user: ItemUserSummary
  category: CategorySummary
  found_building_space: BuildingSpaceSummary
  image: ItemImage
}

export interface FoundItemDetail {
  id: number
  name: string
  description: string
  user: ItemUserDetail
  category: CategorySummary
  found_building_space: BuildingSpaceDetail
  left_building_space: BuildingSpaceDetail
  item_image_urls: string[]
}

export interface RegisterUserRequest {
  name: string
  email: string
  password: string
  confirm_password: string
  phone: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface CreateLostItemRequest {
  name: string
  description: string
  category_id: number
  lost_building_space_id: number
  image_urls?: string[]
}

export interface CreateFoundItemRequest {
  name: string
  description: string
  category_id: number
  found_building_space_id: number
  left_building_space_id: number
  image_urls?: string[]
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

export interface UploadResponse {
  url: string
}
