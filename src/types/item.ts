export interface Item {
  id: number
  nome: string
  descricao: string
  local: string
  data: string
  categoria: string
  tipo: 'perdido' | 'encontrado'
  foto: string
  reportadoPor: string
  status: string
  lat: number
  lng: number
}
