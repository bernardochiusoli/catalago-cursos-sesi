import { describe, expect, it } from 'vitest'
import { formatarData, pluralizarCursos } from './formatar'
import { Texto } from './texto'

describe('formatarData', () => {
  it('converte ISO para dd/mm/aaaa sem perder um dia por causa do fuso', () => {
    expect(formatarData('2027-01-05')).toBe('05/01/2027')
  })
  it('retorna null quando não há data', () => {
    expect(formatarData(null)).toBeNull()
  })
})

describe('pluralizarCursos', () => {
  it.each([
    [0, 'Nenhum curso encontrado'],
    [1, '1 curso encontrado'],
    [9, '9 cursos encontrados'],
  ])('%i -> %s', (total, esperado) => {
    expect(pluralizarCursos(total)).toBe(esperado)
  })
})

describe('Texto.normalizar', () => {
  it('remove acentos, caixa e espaços extras (mesma regra do back-end)', () => {
    expect(Texto.normalizar('  CIÊNCIAS   da Natureza ')).toBe('ciencias da natureza')
  })
})
