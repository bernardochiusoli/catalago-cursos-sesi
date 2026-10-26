// Conteúdo institucional fixo, copiado do protótipo no Figma.
// Os cursos vêm da API; estes textos não fazem parte do catálogo.

export const impacto = [
  { numero: '25.000+', rotulo: 'Profissionais capacitados' },
  { numero: '500+', rotulo: 'Empresas parceiras' },
  { numero: '4.8/5', rotulo: 'Avaliação média' },
  { numero: '2.5M+', rotulo: 'Horas de capacitação' },
]

export const beneficios = [
  { icone: '01-certificacao', titulo: 'Certificação SESI', texto: 'Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.' },
  { icone: '02-professores', titulo: 'Professores especialistas', texto: 'Contamos com professores reconhecidos por sua excelência no mercado.' },
  { icone: '03-suporte', titulo: 'Suporte contínuo', texto: 'Você não está sozinho! Acompanhamento online durante todo o curso.' },
  { icone: '04-flexibilidade', titulo: 'Flexibilidade', texto: 'Turmas presenciais e online com horários que se adaptam à sua rotina.' },
]

export const depoimentos = [
  { texto: 'A experiência do curso foi incrível! As aulas foram muito bem estruturadas e o cronograma foi cuidadosamente planejado, facilitando muito o aprendizado.', nome: 'Lucas Pereira', cargo: 'Analista na Empresa X' },
  { texto: 'Concluir o curso foi uma jornada enriquecedora. As aulas eram dinâmicas e o horário foi organizado para maximizar nosso tempo de estudo.', nome: 'Mariana Costa', cargo: 'Gestora na Empresa X' },
  { texto: 'O curso superou minhas expectativas! As aulas eram bem elaboradas e o planejamento do horário ajudou a manter o foco e a produtividade.', nome: 'Thiago Almeida', cargo: 'Técnico na Empresa X' },
  { texto: 'Finalizar o curso foi uma experiência motivadora. As aulas foram muito bem preparadas e o cronograma foi ideal para o aprendizado.', nome: 'Fernanda Silva', cargo: 'Analista na Empresa X' },
  { texto: 'A conclusão do curso foi uma etapa gratificante. As aulas foram bem organizadas e o horário foi pensado para facilitar o aprendizado.', nome: 'Gabriel Santos', cargo: 'Analista na Empresa X' },
]

export const duvidasFrequentes = [
  { pergunta: 'Preciso ter experiência prévia?', resposta: 'Não. Cada curso informa o público-alvo e os conhecimentos recomendados na página de detalhes.' },
  { pergunta: 'Recebo certificado?', resposta: 'Sim. Ao concluir todas as atividades com aproveitamento, você recebe a certificação SESI.' },
  { pergunta: 'Como funcionam os cursos online?', resposta: 'O conteúdo fica disponível no Ambiente Virtual de Aprendizagem (AVA), e você estuda no seu ritmo, com apoio da tutoria.' },
]

export const aulasOnline =
  'As aulas ficam no Ambiente Virtual de Aprendizagem (AVA), com vídeos, textos e atividades. Cada módulo termina com uma avaliação curta, e o certificado é liberado ao concluir todos os módulos.'

export const rodape = {
  email: 'contato@sesindustria.com.br',
  endereco: 'Av. Paulista, 1313',
  navegacao: [
    { rotulo: 'Início', href: '/' },
    { rotulo: 'Certificação', href: '/#sobre' },
    { rotulo: 'Cursos', href: '/cursos' },
    { rotulo: 'Sobre', href: '/#sobre' },
  ],
  cursosPopulares: [
    'Cultura Organizacional',
    'Ferramentas Google para Produtividade',
    'Excel Básico ao Avançado',
    'Trabalho em Equipe e Colaboração',
    'Gestão do Tempo e Produtividade',
    'Comunicação Assertiva',
    'Inteligência Emocional no Trabalho',
  ],
  suporte: ['Termos de Uso', 'Política de Privacidade', 'Trabalhe Conosco', 'Fale Conosco', 'Central de Ajuda'],
}
