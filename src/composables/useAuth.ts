import { computed, ref } from 'vue'
import { apiClient, setAuthToken, getAuthToken, clearAuthToken } from '@/services/api'
import type { LoginResponse, RegisterUserRequest } from '@/types/api'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1]
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

const token = ref<string | null>(getAuthToken())

const isAuthenticated = computed(() => token.value !== null)

const userEmail = computed(() => {
  if (!token.value) return null
  const payload = decodeJwtPayload(token.value)
  return (payload?.email as string) ?? null
})

const userName = computed(() => {
  if (!token.value) return null
  const payload = decodeJwtPayload(token.value)
  return (payload?.name as string) ?? null
})

export function useAuth() {
  async function login(email: string, password: string): Promise<void> {
    const data = await apiClient.post<LoginResponse>('/login', { email, password })
    setAuthToken(data.token)
    token.value = data.token
  }

  async function register(userData: RegisterUserRequest): Promise<void> {
    await apiClient.post('/users', userData)
  }

  function logout(): void {
    clearAuthToken()
    token.value = null
  }

  return {
    isAuthenticated,
    userEmail,
    userName,
    login,
    register,
    logout,
  }
}
