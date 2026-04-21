import { ref } from 'vue'

const currentUser = ref({
  nome: 'Maria Silva',
  email: 'aluno@universidade.com',
})

export function useAuth() {
  return { currentUser }
}
