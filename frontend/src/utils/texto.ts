// Mesma regra de normalização usada no back-end (Servicos/Texto.cs).
export const Texto = {
  normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
  },
}
