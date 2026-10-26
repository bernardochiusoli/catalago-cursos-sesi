/**
 * "2027-01-05" -> "05/01/2027".
 * Não usa new Date(): uma data sem horário é lida como meia-noite UTC e,
 * no fuso de Brasília, apareceria como o dia anterior.
 */
export function formatarData(iso: string | null): string | null {
  if (!iso) return null
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return null
  return `${dia}/${mes}/${ano}`
}

export function formatarCarga(horas: number): string {
  return `${horas} h`
}

export function pluralizarCursos(total: number): string {
  if (total === 0) return 'Nenhum curso encontrado'
  return total === 1 ? '1 curso encontrado' : `${total} cursos encontrados`
}
