import { describe, it, expect } from 'vitest'
import { categories, buildings, buildingSpaces } from '@/data/static'
import type { Category, Building, BuildingSpace } from '@/types/api'

describe('Static Data: categories', () => {
  it('contém 3 categorias', () => {
    expect(categories).toHaveLength(3)
  })

  it('cada categoria tem id e name', () => {
    categories.forEach((cat: Category) => {
      expect(cat).toHaveProperty('id')
      expect(cat).toHaveProperty('name')
      expect(typeof cat.id).toBe('number')
      expect(typeof cat.name).toBe('string')
    })
  })

  it('contém Material Escolar, Acessório Pessoal e Documento', () => {
    const names = categories.map((c: Category) => c.name)
    expect(names).toContain('Material Escolar')
    expect(names).toContain('Acessório Pessoal')
    expect(names).toContain('Documento')
  })

  it('IDs são únicos', () => {
    const ids = categories.map((c: Category) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Static Data: buildings', () => {
  it('contém 1 prédio', () => {
    expect(buildings).toHaveLength(1)
  })

  it('cada prédio tem id, name e localization com cep/neighborhood/street', () => {
    buildings.forEach((b: Building) => {
      expect(b).toHaveProperty('id')
      expect(b).toHaveProperty('name')
      expect(b).toHaveProperty('localization')
      expect(b.localization).toHaveProperty('cep')
      expect(b.localization).toHaveProperty('neighborhood')
      expect(b.localization).toHaveProperty('street')
    })
  })

  it('contém Centro Universitário UNDB', () => {
    expect(buildings[0].name).toBe('Centro Universitário UNDB')
  })

  it('localização UNDB correta', () => {
    const undb = buildings[0]
    expect(undb.localization.cep).toBe('65075441')
    expect(undb.localization.neighborhood).toBe('Jardim Renascença')
    expect(undb.localization.street).toBe('Coronel Colares Moreira')
  })
})

describe('Static Data: buildingSpaces', () => {
  it('contém 3 espaços', () => {
    expect(buildingSpaces).toHaveLength(3)
  })

  it('cada espaço tem id e name', () => {
    buildingSpaces.forEach((s: BuildingSpace) => {
      expect(s).toHaveProperty('id')
      expect(s).toHaveProperty('name')
      expect(typeof s.id).toBe('number')
      expect(typeof s.name).toBe('string')
    })
  })

  it('contém Sala 206, Refeitório e Recepção', () => {
    const names = buildingSpaces.map((s: BuildingSpace) => s.name)
    expect(names).toContain('Sala 206')
    expect(names).toContain('Refeitório')
    expect(names).toContain('Recepção')
  })

  it('IDs são únicos', () => {
    const ids = buildingSpaces.map((s: BuildingSpace) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
