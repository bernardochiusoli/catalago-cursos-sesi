# Limitações, itens não concluídos e diferenças em relação ao Figma

## Diferenças em relação ao Figma

O protótipo tem três telas: **Landing page**, **Detalhes do curso** e **AVA**. A aplicação reproduz as três e acrescenta o que o enunciado exige e o Figma não mostra.

| Elemento | No Figma | Na aplicação | Justificativa |
| --- | --- | --- | --- |
| Página de catálogo com busca e filtros | Não existe; "Ver todos os cursos" não leva a nenhuma tela | Página `/cursos` com busca, 3 filtros, contador, limpar filtros e grade de cards | É o centro dos requisitos obrigatórios. Criada só com componentes, cores e fonte do protótipo |
| Estados de carregamento, erro e nenhum resultado | Não existem | Esqueleto dos cards, mensagem de erro com "Tentar novamente", mensagem de nenhum resultado com "Limpar filtros" | Requisitos obrigatórios, desenhados no mesmo estilo |
| Card do catálogo | Card mostra categoria, título e resumo | Também mostra status, modalidade e carga horária | Informação necessária para comparar cursos e entender os filtros |
| Detalhe do curso | Mostra início do curso e certificação | Também mostra modalidade, carga horária, status, público-alvo e código (nome breve) | O enunciado exige esses campos |
| Mídia do detalhe e da chamada final | Miniatura de vídeo com botão "play" | Imagem do curso, sem botão "play" | Nenhum vídeo foi fornecido; um botão que não toca nada confundiria a pessoa |
| Fotos dos cards | Fotos próprias de cada curso | Recortes das 3 fotos do pacote (hero, banner do AVA, miniatura de vídeo), convertidos para WebP | O pacote só trazia essas 3 imagens |
| Botão "Matricule-se" | Sempre visível | Só para cursos com inscrições abertas; nos demais aparece "Matrículas em breve" ou "Matrículas encerradas" | Evita oferecer matrícula em curso encerrado |
| Destino de "Matricule-se" e "Área do aluno" | Fluxo do protótipo leva ao AVA | Levam à tela de AVA de demonstração, sem login | Não há autenticação no escopo |
| Links do rodapé "Cursos populares" e "Suporte" | Aparência de link | Texto simples | Não há páginas de destino; links quebrados prejudicam a navegação e a acessibilidade |
| Trilha "Início / Cursos / curso" | Não existe | No topo do detalhe | Ajuda a orientação, especialmente para leitor de tela |
| Versão para celular | Só há telas de desktop | Layout responsivo próprio (menu recolhível, colunas empilhadas) | Requisito de responsividade |
| Fonte | Open Sans | Open Sans do pacote, convertida para WOFF2 e reduzida aos caracteres latinos | De cerca de 530 KB para cerca de 90 KB, sem mudança visual |
| Data do curso "Matemática para a Precisão" | 05/01/2026 | 05/01/2027 | A data do protótipo já passou; mantido o mesmo dia e mês |

## Itens não concluídos ou limitações

| Item | Situação | Próximo passo |
| --- | --- | --- |
| Integração com Moodle | Não implementada (era diferencial) | Uma interface de fonte de cursos com implementação via Web Services do Moodle, com cache |
| Paginação | Não implementada | Parâmetros `pagina` e `tamanho` na API quando o catálogo crescer |
| AVA | Demonstração: navega por módulos e aulas, sem login nem progresso salvo | Seria responsabilidade do Moodle |
| Cadastro, edição e exclusão | Fora do escopo, conforme o enunciado | |
| Hospedagem gratuita | O serviço dorme sem acesso; primeira carga pode levar cerca de um minuto | Plano pago ou hospedagem institucional |
| Inicialização do banco | Roda na subida da aplicação | Passo separado no pipeline de deploy |
| Testes de ponta a ponta | Executados durante o desenvolvimento, não versionados no CI | Adicionar Playwright ao pipeline |
| Testes da API com banco real | Os testes xUnit cobrem as regras de busca e filtros em memória | Testes de integração com PostgreSQL em contêiner |
