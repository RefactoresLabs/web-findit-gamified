import { ref } from 'vue'
import { apiClient, BASE_URL } from '@/services/api'
import type { CreateLostItemRequest, CreateFoundItemRequest, UploadResponse } from '@/types/api'

export function useRegisterItem() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function uploadImage(file: File): Promise<string> {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      const data = await apiClient.upload<UploadResponse>('/upload', formData)
      const url = data.url.startsWith('/') ? data.url : `/${data.url}`
      return `${BASE_URL}${url}`
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer upload'
      error.value = msg
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createLostItem(data: CreateLostItemRequest): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await apiClient.post('/lost-items', data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao registrar item'
      error.value = msg
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createFoundItem(data: CreateFoundItemRequest): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await apiClient.post('/found-items', data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao registrar item'
      error.value = msg
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, uploadImage, createLostItem, createFoundItem }
}
