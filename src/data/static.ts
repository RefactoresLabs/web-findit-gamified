import type { Category, Building, BuildingSpace } from '@/types/api'

export const categories: Category[] = [
  { id: 1, name: 'Material Escolar' },
  { id: 2, name: 'Acessório Pessoal' },
  { id: 3, name: 'Documento' },
]

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Centro Universitário UNDB',
    localization: {
      cep: '65075441',
      neighborhood: 'Jardim Renascença',
      street: 'Coronel Colares Moreira',
    },
    lat: -2.49953,
    lng: -44.28672,
  },
]

export const buildingSpaces: BuildingSpace[] = [
  { id: 1, name: 'Sala 206' },
  { id: 2, name: 'Refeitório' },
  { id: 3, name: 'Recepção' },
]
