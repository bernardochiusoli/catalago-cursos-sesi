import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { CursoResumo } from '../api/tipos'
import { Acordeao } from './Acordeao'
import { CardCurso } from './CardCurso'
import { EstadoErro } from './Estados'

const curso: CursoResumo = {
  slug: 'quimica-e-sustentabilidade',
  nomeCompleto: 'Química e Sustentabilidade',
  nomeBreve: 'QUI-SUS',
  resumo: 'Estudo das reações químicas envolvidas na tinturaria.',
  categoria: { slug: 'ciencias-da-natureza', nome: 'Ciências da Natureza', icone: '/x.svg' },
  modalidade: { valor: 'Online', rotulo: 'Online' },
  status: { valor: 'InscricoesAbertas', rotulo: 'Inscrições abertas' },
  cargaHorariaHoras: 36,
  publicoAlvo: 'Técnicos',
  imagemUrl: '/img.webp',
  imagemAlt: 'Máquina têxtil',
  dataDisponibilizacao: null,
}

describe('CardCurso', () => {
  it('tem um único link, com o nome do curso, apontando para o detalhe', () => {
    render(<CardCurso curso={curso} detalhado />, { wrapper: MemoryRouter })
    const link = screen.getByRole('link')
    expect(link).toHaveAccessibleName('Química e Sustentabilidade')
    expect(link).toHaveAttribute('href', '/cursos/quimica-e-sustentabilidade')
    expect(screen.getByText('Inscrições abertas')).toBeInTheDocument()
    expect(screen.getByText('36 h')).toBeInTheDocument()
  })
})

describe('EstadoErro', () => {
  it('anuncia o erro e permite tentar novamente', async () => {
    const tentar = vi.fn()
    render(<EstadoErro mensagem="Falhou" aoTentarNovamente={tentar} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou')
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(tentar).toHaveBeenCalledOnce()
  })
})

describe('Acordeao', () => {
  it('abre e fecha o painel alterando aria-expanded', async () => {
    render(<Acordeao itens={[{ titulo: 'Módulos', conteudo: <p>Conteúdo</p> }]} />)
    const botao = screen.getByRole('button', { name: 'Módulos' })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Conteúdo')).not.toBeVisible()
    await userEvent.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Conteúdo')).toBeVisible()
  })
})
