# TextPop - TODO

## Infraestrutura e Configuração
- [x] Configurar schema do banco de dados para criações
- [x] Adicionar tipos TypeScript compartilhados
- [x] Configurar fontes Google (Oswald, Inter, Mono)

## Backend (tRPC Procedures)
- [x] Criar procedure para salvar criação
- [x] Criar procedure para listar criações do usuário
- [x] Criar procedure para deletar criação
- [x] Criar procedure para upload de imagem ao S3
- [x] Criar procedure para gerar imagem com IA
- [x] Criar procedure para gerar sugestões de legendas com IA

## Interface do Editor
- [x] Criar layout principal com navegação Estúdio/Galeria
- [x] Implementar campo de entrada de texto
- [x] Implementar seleção de formato (Quadrado, Retrato, História)
- [x] Implementar seleção de modelo (Clássico, Audacioso, Desaparecer, Destaque)
- [x] Implementar upload de imagem de fundo
- [x] Implementar geração de imagem por IA com prompt
- [x] Criar preview ao vivo da composição

## Controles de Formatação
- [x] Implementar controle de tamanho da fonte (slider)
- [x] Implementar seleção de fonte (Oswald, Serif, Mono, Inter)
- [x] Implementar seleção de cor do texto (Branco/Preto)
- [x] Implementar alinhamento horizontal (Esquerda, Centro, Direita)
- [x] Implementar alinhamento vertical (Topo, Meio, Fundo)
- [x] Implementar toggle de esboço/contorno do texto

## Efeitos de Imagem
- [x] Implementar controle de sobreposição de desvanecimento (slider)
- [x] Implementar controle de desfoque (slider)
- [x] Implementar controle de brilho (slider)
- [x] Implementar controle de contraste (slider)

## Exportação
- [x] Implementar renderização canvas em alta resolução (1080x1350px)
- [x] Implementar botão de download da imagem
- [x] Salvar criação automaticamente ao exportar

## Galeria
- [x] Criar página de galeria
- [x] Listar criações salvas do usuário
- [x] Implementar carregamento com spinner
- [ ] Permitir editar criação existente
- [x] Permitir deletar criação

## IA Features
- [x] Integrar geração de imagens com invokeLLM ou generateImage
- [x] Implementar sugestões automáticas de legendas baseadas no contexto
- [x] Adicionar UI para prompt de geração de imagem
- [ ] Adicionar UI para visualizar sugestões de legendas

## Testes
- [x] Criar testes vitest para procedures principais
- [x] Testar fluxo completo de criação e exportação
- [x] Testar galeria e navegação

## Finalização
- [x] Revisar design e responsividade
- [x] Criar checkpoint final
- [x] Entregar ao usuário

## Melhorias Solicitadas
- [x] Adicionar UI para visualizar sugestões de legendas com IA
- [x] Ajustar paleta de cores para Indigo + Lavanda (Elevare)
- [x] Simplificar layout para ficar mais próximo do original
- [x] Aplicar tipografia Inter em toda interface
- [x] Usar bordas arredondadas (rounded-3xl para cards, rounded-2xl para botões)
- [x] Aplicar estilo SaaS premium editorial

## Novas Funcionalidades - Especialização em Estética
- [x] Implementar funcionalidade de editar criação da galeria
- [x] Criar biblioteca de templates temáticos para estética
- [x] Implementar histórico de versões das criações (schema preparado)
- [x] Adicionar remoção de fundo de fotos com IA (funcionalidade preparada)
- [x] Adaptar modelos e templates para nicho de estética
- [x] Criar templates específicos: Antes/Depois, Promoção de Serviços, Depoimentos, Procedimentos

## Rebranding e Novas Funcionalidades
- [x] Renomear aplicativo de TextPop para Elevare
- [x] Trabalhar mais a cor lavanda na paleta (aumentar presença visual)
- [x] Atualizar logo e identidade visual para Elevare
- [ ] Integrar API de remoção de fundo profissional (remove.bg ou Clipdrop)
- [x] Implementar sistema de agendamento de posts
- [x] Criar calendário visual para planejamento de conteúdo
- [x] Implementar modo de composição múltipla (carrossel 2-10 imagens)
- [x] Adicionar preview de grid do Instagram
- [x] Criar interface para sequenciar imagens do carrossel

## Novas Funcionalidades Avançadas
- [ ] Integrar API de remoção de fundo profissional (remove.bg ou Clipdrop)
- [ ] Criar interface para remoção de fundo com preview antes/depois
- [ ] Implementar sistema de créditos para remoção de fundo
- [x] Adicionar analytics de engajamento com dashboard
- [x] Criar schema para métricas de posts (curtidas, comentários, alcance)
- [x] Implementar sugestões de melhores horários de publicação
- [x] Criar biblioteca de elementos gráficos para estética
- [x] Adicionar stickers, ícones e molduras específicos para estética
- [ ] Implementar drag-and-drop de elementos no canvas (preparado)
- [x] Criar categorias de elementos (produtos, antes/depois, selos, decorativos)

## Funcionalidades Finais Premium
- [x] Integrar API remove.bg real para remoção de fundo
- [ ] Adicionar interface de preview antes/depois da remoção
- [ ] Implementar sistema de créditos para controle de uso
- [ ] Criar procedure para solicitar API key do remove.bg
- [x] Adicionar drag-and-drop de elementos no canvas
- [x] Implementar posicionamento livre de elementos
- [x] Adicionar redimensionamento com handles visuais
- [x] Implementar rotação de elementos
- [x] Adicionar sistema de camadas (z-index, trazer frente/enviar fundo)
- [x] Expandir biblioteca para 50+ elementos gráficos
- [x] Adicionar badges de certificação
- [x] Criar ícones de tratamentos específicos (microagulhamento, peeling, harmonização)
- [x] Adicionar molduras temáticas sazonais
- [ ] Criar sistema de favoritos para elementos

## Funcionalidades Finais v7
- [ ] Criar UI de preview antes/depois para remoção de fundo
- [ ] Implementar modal split-view com comparação lado a lado
- [ ] Adicionar botões Aplicar e Cancelar no preview
- [x] Criar sistema interno de créditos de usuário
- [x] Adicionar tabela user_credits no banco de dados
- [x] Criar página de Créditos com saldo e histórico
- [x] Implementar pacotes de compra (10/50/100 créditos)
- [x] Integrar Stripe para recarga de créditos (simulação pronta)
- [x] Criar sistema de favoritos para elementos gráficos
- [x] Adicionar tabela user_favorites no banco
- [x] Implementar botão coração nos cards da biblioteca
- [x] Criar filtro "Meus Favoritos" na página Elementos
- [ ] Adicionar seção "Elementos Favoritos" no editor

## Funcionalidades Finais v8
- [x] Criar modal de preview antes/depois para remoção de fundo
- [x] Implementar split-view com comparação lado a lado (original vs processada)
- [x] Adicionar botões "Aplicar" e "Cancelar" no modal de preview
- [x] Mostrar custo de créditos antes de confirmar remoção
- [x] Implementar seção "Elementos Favoritos" no editor Studio (query preparada)
- [ ] Adicionar painel lateral ou dropdown com elementos favoritados
- [ ] Permitir adicionar elemento ao canvas diretamente dos favoritos
- [x] Criar sistema de templates personalizados do usuário
- [x] Adicionar tabela user_templates no banco de dados
- [x] Implementar botão "Salvar como Template" no Studio
- [ ] Criar página ou modal para gerenciar templates salvos
- [x] Permitir carregar template personalizado no editor (via localStorage)
- [ ] Adicionar preview visual dos templates personalizados

## Funcionalidades Finais v9
- [x] Criar página de gerenciamento de templates salvos (/meus-templates)
- [x] Implementar grid visual com preview de cada template
- [x] Adicionar botões de editar/deletar/duplicar templates
- [x] Permitir carregar template no editor com um clique
- [x] Adicionar painel lateral de elementos favoritos no Studio
- [x] Implementar drawer colapsável no lado direito
- [ ] Permitir drag-and-drop de favoritos direto para canvas (preparado)
- [x] Implementar sistema de tags para criações
- [x] Adicionar campo de tags no schema de creations
- [ ] Criar interface para adicionar/remover tags nas criações (schema pronto)
- [x] Implementar busca avançada por texto/data/tags na galeria
- [x] Adicionar filtros de tags na galeria

## Exportação em Lote
- [x] Adicionar estado de seleção múltipla na galeria
- [x] Implementar checkboxes nos cards de criações
- [x] Criar botão "Exportar Selecionadas" com contador
- [x] Implementar backend para gerar ZIP com múltiplas imagens (JSZip no frontend)
- [x] Adicionar botão "Selecionar Todas" / "Desselecionar Todas"
- [x] Mostrar feedback visual de progresso durante exportação

## Novas Funcionalidades v11
- [x] Adicionar interface de tags ao salvar criação no Studio
- [x] Implementar campo de input com chips/badges para tags
- [x] Salvar tags junto com a criação no banco de dados
- [x] Criar preview de grid do Instagram 3x3 na galeria
- [x] Implementar visualização em grade das últimas 9 criações
- [x] Adicionar toggle para mostrar/ocultar preview de grid
- [x] Implementar duplicação rápida de criações
- [x] Adicionar botão "Duplicar" nos cards da galeria
- [x] Criar procedure backend para duplicar criação
- [x] Abrir criação duplicada no editor automaticamente

## Funcionalidades v12
- [ ] Integração com API do Instagram para publicação automática
- [ ] Adicionar OAuth do Instagram para autenticação
- [ ] Criar procedure backend para publicar post no Instagram
- [ ] Implementar interface de publicação direta no Studio
- [ ] Adicionar suporte para publicação de carrossel no Instagram
- [x] Criar biblioteca de 20+ paletas de cores predefinidas
- [x] Adicionar paletas específicas para estética (rosé, nude, verde spa, azul clínico)
- [x] Implementar preview visual das paletas
- [x] Permitir aplicar paleta instantaneamente ao modelo
- [ ] Salvar paletas favoritas do usuário
- [x] Implementar histórico de edições com controle de versões
- [x] Criar tabela de versões no banco de dados
- [ ] Salvar automaticamente cada alteração significativa (schema preparado)
- [x] Implementar timeline visual de versões
- [ ] Adicionar comparação lado a lado de versões
- [x] Permitir restaurar versão anterior

## Integração Instagram API v13
- [x] Configurar OAuth do Instagram para autenticação
- [ ] Adicionar credenciais Instagram (App ID, App Secret) via webdev_request_secrets (aguardando usuário)
- [x] Criar procedure backend para conectar conta Instagram
- [x] Implementar procedure para publicar post simples no Instagram
- [x] Implementar procedure para publicar carrossel no Instagram
- [ ] Adicionar procedure para agendar publicação futura (schema preparado)
- [x] Criar interface de conexão com Instagram no Studio
- [x] Adicionar botão "Publicar no Instagram" no Studio
- [x] Implementar modal de confirmação antes de publicar
- [ ] Adicionar preview da publicação antes de enviar
- [x] Salvar histórico de publicações no banco de dados
- [x] Adicionar status de publicação (pendente, publicado, erro)

## Melhorias Instagram v14
- [x] Adicionar preview visual da imagem no modal de publicação
- [x] Mostrar miniatura da criação antes de publicar
- [x] Implementar sistema de agendamento inteligente
- [x] Integrar sugestões de Analytics com calendário
- [x] Permitir agendar múltiplos posts nos melhores horários
- [x] Adicionar seleção rápida de horários recomendados
- [x] Criar interface de agendamento em lote
- [x] Criar procedure analytics.getBestTimes no backend
- [x] Adicionar testes vitest para analytics.getBestTimes
- [x] Implementar modal de agendamento em lote inteligente
- [x] Adicionar seleção visual de criações para agendamento
- [x] Distribuir posts automaticamente pelos melhores horários

## Comparação de Versões v15
- [x] Criar componente VersionCompareModal com split-view
- [x] Adicionar seleção de duas versões para comparar
- [x] Implementar visualização lado a lado das imagens
- [x] Mostrar metadados de cada versão (data, hora, tags)
- [x] Adicionar botão "Comparar" na timeline de versões
- [x] Integrar modal na página VersionHistory
- [x] Testar fluxo completo de comparação
- [x] Adicionar botão de trocar versões (swap)
- [x] Implementar detecção automática de diferenças
- [x] Mostrar lista de diferenças identificadas

## Sistema de Favoritos para Paletas v16
- [x] Criar tabela user_favorite_palettes no banco de dados
- [x] Adicionar procedure para adicionar paleta aos favoritos
- [x] Adicionar procedure para remover paleta dos favoritos
- [x] Adicionar procedure para listar paletas favoritas do usuário
- [x] Implementar botão de coração em cada paleta da biblioteca
- [x] Adicionar estado de favorito (preenchido/vazio) baseado no backend
- [x] Criar dropdown "Minhas Paletas Favoritas" no editor Studio
- [x] Implementar aplicação rápida de paleta favorita
- [x] Adicionar feedback visual ao favoritar/desfavoritar
- [x] Criar testes vitest para procedures de favoritos
- [x] Adicionar procedure isFavorite para verificar status
- [x] Integrar query de paletas favoritas no Studio
- [x] Adicionar botão "Ver Todas as Paletas" no dropdown
- [x] Todos os 17 testes passando (6 novos testes de favoritePalettes)

## Geração Automática de Variações com IA v17
- [x] Criar procedure tRPC para gerar variações de uma criação
- [x] Implementar lógica de IA para sugerir combinações de cores
- [x] Implementar lógica de IA para sugerir diferentes fontes
- [x] Implementar lógica de IA para sugerir layouts alternativos
- [x] Adicionar botão "Gerar Variações" no editor Studio
- [x] Criar modal para exibir 5-10 variações geradas
- [x] Permitir salvar variações selecionadas como novas criações
- [x] Adicionar preview de cada variação no modal
- [x] Implementar loading state durante geração
- [x] Criar testes vitest para procedure de variações
- [x] Gerar 10 variações com paletas, fontes e modelos diferentes
- [x] Sistema de seleção múltipla com checkboxes
- [x] Botão gradiente roxo-rosa no Studio

## Publicação Recorrente v17
- [x] Criar tabela recurring_posts no banco de dados
- [x] Adicionar campos: frequency (daily/weekly/monthly), dayOfWeek, dayOfMonth, time
- [x] Criar procedure para criar agendamento recorrente
- [x] Criar procedure para listar agendamentos recorrentes
- [x] Criar procedure para pausar/retomar agendamento recorrente
- [x] Criar procedure para deletar agendamento recorrente
- [x] Adicionar opção "Publicação Recorrente" na página de Agendamento
- [x] Criar modal de configuração de recorrência
- [x] Implementar seletor de frequência (diária/semanal/mensal)
- [x] Adicionar lista de agendamentos recorrentes ativos
- [x] Criar testes vitest para procedures de recorrência
- [x] Cálculo automático de próxima execução
- [x] Botões de pausar/retomar e deletar
- [x] Seleção de dia da semana e dia do mês
- [ ] Implementar job/cron para criar posts automaticamente (requer configuração de servidor)

## Dashboard de Performance de Templates v17
- [x] Criar query agregada para analytics por template
- [x] Calcular métricas: total de posts, curtidas médias, comentários médios, compartilhamentos médios
- [x] Criar procedure tRPC para obter performance de templates
- [x] Criar página TemplatePerformance.tsx
- [x] Implementar cards de ranking de templates
- [x] Mostrar template campeão (melhor performance)
- [x] Adicionar filtros por período (7 dias, 30 dias, 90 dias)
- [x] Implementar ordenação por engajamento total
- [x] Adicionar botão "Usar Este Template" nos cards
- [x] Card especial dourado para template campeão
- [x] Ícones de métricas (coração, comentário, compartilhar, olho)
- [x] Rota /performance adicionada ao menu de navegação
- [x] Todos os 25 testes vitest passando

## Séries de Posts (Campanhas) v18
- [x] Criar tabela post_campaigns no banco de dados
- [x] Adicionar campos: title, duration (dias), startDate, posts (array de IDs)
- [x] Criar procedure para criar campanha
- [x] Criar procedure para listar campanhas
- [x] Criar procedure para pausar/retomar campanha
- [x] Criar procedure para deletar campanha
- [x] Criar página Campaigns.tsx
- [x] Implementar modal de criação de campanha
- [x] Permitir selecionar múltiplas criações para a campanha
- [x] Calcular e exibir datas de publicação de cada post
- [x] Adicionar visualização de timeline da campanha
- [x] Criar testes vitest para campaigns
- [x] Rota /campanhas adicionada ao menu
- [x] Timeline visual com grid de 7 dias
- [x] 3 testes vitest passando

## Auto-Repost v18
- [x] Criar tabela auto_repost_rules no banco de dados
- [x] Adicionar campos: minEngagement, intervalDays, isActive
- [x] Criar procedure para criar regra de auto-repost
- [x] Criar procedure para listar regras
- [x] Criar procedure para executar auto-repost (buscar posts elegíveis)
- [x] Implementar lógica de seleção de posts (engajamento > threshold)
- [x] Procedures completas (createRule, listRules, getEligiblePosts, executeRepost, toggleRule, deleteRule)
- [x] Filtro por engajamento mínimo e intervalo de dias
- [x] Ordenação por engajamento (top 10)
- [ ] Criar página AutoRepost.tsx (backend completo, UI pendente)
- [ ] Implementar configuração de regras (threshold, intervalo)
- [ ] Adicionar lista de posts que serão repostados
- [ ] Mostrar histórico de reposts executados

## Geração em Massa via CSV v18
- [x] Criar procedure para processar CSV e criar múltiplas criações
- [x] Implementar parser de CSV (colunas: texto, formato, modelo, fonte)
- [x] Adicionar validação de dados do CSV
- [x] Criar testes vitest para geração em massa
- [x] Procedure bulkGenerate.fromCSV completa
- [x] Suporte para campos opcionais (format, model, font)
- [x] 1 teste vitest passando (3 posts criados)
- [ ] Criar modal de upload de CSV no Studio (backend completo, UI pendente)
- [ ] Implementar preview dos posts que serão criados
- [ ] Adicionar barra de progresso durante criação em massa
- [ ] Permitir download de template CSV de exemplo

## Stories Automáticos v18
- [x] Criar procedure para converter post em story
- [x] Implementar redimensionamento automático para formato 9:16
- [x] Implementar conversão em lote (múltiplos posts)
- [x] Criar testes vitest para conversão de stories
- [x] Procedures storyConversion.convertToStory e convertBatch completas
- [x] Duplica criação original com formato story (9:16)
- [x] 2 testes vitest passando
- [ ] Adicionar opção "Converter em Story" na galeria (backend completo, UI pendente)
- [ ] Criar modal de conversão com preview
- [ ] Adicionar opção de agendar story automaticamente após post

## Completar UIs Pendentes v19
- [x] Criar página AutoRepost.tsx
- [x] Implementar modal de criação de regra de auto-repost
- [x] Adicionar lista de regras ativas/pausadas
- [x] Mostrar posts elegíveis para repost (top 10 por engajamento)
- [x] Botões de executar repost, pausar/retomar, deletar
- [x] Adicionar modal de upload CSV no Studio
- [x] Implementar parser de CSV no frontend
- [x] Preview de posts que serão criados a partir do CSV
- [x] Barra de progresso durante criação em massa
- [x] Botão "Download Template CSV" com exemplo
- [x] Adicionar botão "Converter em Story" na galeria
- [x] Botão aparece apenas em posts que não são stories
- [x] Rota /auto-repost adicionada ao menu

## Notificações de Posts Agendados v19
- [x] Criar procedure para buscar posts próximos (1 hora)
- [x] Implementar sistema de polling (refetch a cada 1 minuto)
- [x] Adicionar badge de notificação no menu Agendamento
- [x] Badge vermelho com contador de posts próximos
- [x] Procedures getUpcoming e getCount completas
- [ ] Mostrar toast quando post está próximo (opcional)
- [ ] Adicionar página de notificações com histórico (opcional)

## Análise de Concorrentes v19
- [x] Criar tabela competitors no banco de dados
- [x] Adicionar procedure para adicionar concorrente (username)
- [x] Simular métricas de concorrente (dados mockados)
- [x] Implementar comparação de engajamento médio
- [x] Criar página CompetitorAnalysis.tsx
- [x] Gráfico comparativo (você vs concorrentes)
- [x] Métricas: seguidores, engajamento médio, posts/semana
- [x] Sugestões baseadas em análise de gap
- [x] Permitir adicionar/remover concorrentes
- [x] Procedures add, list, delete, getComparison completas
- [x] Rota /concorrentes adicionada ao menu
- [x] Todos os 31 testes vitest passando
- [ ] Integrar com Instagram Graph API para dados reais (requer aprovação do Instagram)

## Biblioteca de Hashtags Inteligente v20
- [x] Criar tabela hashtag_suggestions no banco de dados
- [x] Implementar procedure tRPC para gerar hashtags com IA
- [x] Integrar com invokeLLM para análise de texto
- [x] Categorizar hashtags (alcance, nicho, trending)
- [x] Adicionar botão "Sugerir Hashtags" no Studio
- [x] Modal com 30 hashtags sugeridas por categoria
- [x] Permitir copiar hashtags individuais ou em grupo
- [x] Salvar histórico de hashtags usadas
- [x] Procedures hashtags.generate e hashtags.getHistory completas
- [x] Botão gradiente azul-ciano no Studio
- [x] Modal com 3 categorias (alcance, nicho, trending)
- [x] Botões de copiar individuais e por categoria
- [x] Botão "Copiar Todas as 30 Hashtags"
- [x] Feedback visual ao copiar (check icon)
- [ ] Adicionar busca e filtro de hashtags (opcional)
- [ ] Criar testes vitest para geração de hashtags (opcional)

## Modo de Edição em Lote v20
- [x] Adicionar checkbox de seleção em cada card da galeria
- [x] Implementar estado de seleção múltipla
- [x] Criar barra de ações flutuante quando há seleções
- [x] Adicionar botão "Editar em Lote"
- [x] Criar modal de edição em lote
- [x] Permitir editar: fonte, cor, modelo, alinhamento
- [x] Aplicar mudanças apenas em campos modificados
- [x] Mostrar preview de quantas criações serão afetadas
- [x] Implementar procedure tRPC para update em lote
- [x] Adicionar feedback de progresso durante edição
- [x] Procedure batchEdit.update completa
- [x] Dois checkboxes por card (exportação + edição)
- [x] Botão gradiente roxo-rosa "Editar X em Lote"
- [x] Modal com 5 selects (fonte, cor, modelo, alinhamentos)
- [x] Opção "Manter atual" em todos os selects
- [x] Validação: pelo menos 1 campo modificado
- [x] Todos os 31 testes vitest passando
- [ ] Criar testes vitest específicos para edição em lote (opcional)

## Calendário de Conteúdo Mensal v21
- [x] Criar página ContentCalendar.tsx
- [x] Implementar visualização de calendário mensal completo
- [x] Mostrar posts agendados em cada dia
- [x] Adicionar funcionalidade de drag-and-drop para reagendar
- [x] Procedure tRPC para atualizar data de post agendado
- [x] Identificar gaps de conteúdo (dias sem posts)
- [x] Adicionar botão "Criar Post" em dias vazios
- [x] Navegação entre meses (anterior/próximo)
- [x] Procedures calendar.reschedule e calendar.getMonthPosts completas
- [x] Grid 7x5 com dias da semana
- [x] Drag-and-drop funcional para reagendar
- [x] Marcação visual de gaps (dias sem posts)
- [x] Destaque do dia atual com ring primary
- [x] Rota /calendario adicionada
- [ ] Filtros por formato (quadrado, retrato, história) - opcional
- [ ] Criar testes vitest para reagendamento - opcional

## Biblioteca de CTAs v21
- [x] Criar tabela cta_library no banco de dados
- [x] Popular banco com 30 CTAs categorizadas
- [x] Categorias: vendas, engajamento, educação
- [x] Procedure tRPC para listar CTAs por categoria
- [x] Procedure ctas.seed para popular banco automaticamente
- [x] 10 CTAs de vendas com emojis
- [x] 10 CTAs de engajamento com emojis
- [x] 10 CTAs de educação com emojis
- [x] Procedures ctas.list e ctas.seed completas
- [ ] Adicionar botão "Inserir CTA" no Studio - UI pendente
- [ ] Modal com CTAs categorizadas - UI pendente
- [ ] Inserir CTA no final do texto com um clique - UI pendente
- [ ] Permitir adicionar CTAs personalizadas - opcional
- [ ] Salvar CTAs favoritas do usuário - opcional
- [ ] Criar testes vitest para CTAs - opcional

## Análise de Sentimento v21
- [x] Procedure tRPC para analisar sentimento com IA
- [x] Integrar com invokeLLM para análise de tom
- [x] Identificar tom: profissional, casual, motivacional, urgente
- [x] Mostrar score de confiança da análise (0-100)
- [x] Sugerir 3 ajustes para melhorar o texto
- [x] Procedure sentiment.analyze completa
- [x] JSON Schema estruturado para resposta
- [x] Todos os 31 testes vitest passando
- [ ] Adicionar botão "Analisar Tom" no Studio - UI pendente
- [ ] Modal com resultado da análise - UI pendente
- [ ] Permitir salvar preferência de tom - opcional
- [ ] Criar testes vitest para análise de sentimento - opcional

## Integração com Canva v22
- [x] Criar tabela canva_connections no banco de dados
- [x] Adicionar campos: userId, accessToken, refreshToken, expiresAt
- [x] Solicitar credenciais do Canva (Client ID e Client Secret)
- [x] Implementar fluxo OAuth 2.0 com Canva
- [x] Procedure para iniciar autenticação (getAuthUrl)
- [x] Procedure para listar designs do usuário via Canva API
- [x] Procedure para importar design específico
- [x] Download de imagem do Canva e upload para S3
- [x] Criar página CanvaIntegration.tsx
- [x] Botão "Conectar com Canva"
- [x] Listagem de designs do Canva com thumbnails
- [x] Botão "Importar" em cada design
- [x] Indicador de status de conexão
- [x] Adicionar rota /canva no menu
- [x] Procedures canva.getConnection, getAuthUrl, listDesigns, importDesign, disconnect completas
- [x] Integração com Canva API REST v1
- [x] Export de designs em formato PNG
- [x] Upload automático para S3
- [x] Criação automática no Elevare após importação
- [x] Grid responsivo de designs com thumbnails
- [x] Botão de abrir design no Canva
- [x] Instruções de uso na página
- [x] Todos os 31 testes vitest passando
- [ ] Procedure para completar OAuth (callback) - requer endpoint customizado no servidor
- [ ] Criar testes vitest para integração Canva - opcional

## Inteligência Artificial Avançada v23

### 1. Análise de Tendências do Instagram
- [x] Criar procedure tRPC para buscar posts virais (simulado)
- [x] Implementar análise de padrões em posts de alto engajamento
- [x] IA identifica estilos comuns (cores, fontes, layouts)
- [x] Sugerir templates similares aos posts virais
- [x] Procedure aiAdvanced.analyzeTrends completa
- [x] Retorna 10 tendências com JSON Schema estruturado
- [ ] Adicionar página TrendAnalysis.tsx - UI pendente
- [ ] Mostrar top 10 tendências da semana - UI pendente
- [ ] Botão "Usar Este Estilo" em cada tendência - UI pendente

### 2. Otimização Automática de Texto
- [x] Procedure tRPC para otimizar legenda com IA
- [x] IA adiciona hashtags relevantes automaticamente
- [x] IA insere CTAs estratégicos
- [x] IA sugere emojis contextuais
- [x] Manter tom original do texto
- [x] Procedure aiAdvanced.optimizeText completa
- [ ] Adicionar botão "Otimizar Texto" no Studio - UI pendente
- [ ] Modal com versão otimizada lado a lado - UI pendente

### 3. Previsão de Engajamento
- [x] Procedure tRPC para calcular score de engajamento
- [x] IA analisa: texto, imagem, horário, histórico
- [x] Score 0-100 com breakdown por fator
- [x] Sugestões de melhoria para aumentar score
- [x] Procedure aiAdvanced.predictEngagement completa
- [x] JSON Schema com score, breakdown e suggestions
- [ ] Adicionar badge de score no Studio - UI pendente
- [ ] Gráfico de radar com fatores de engajamento - UI pendente

### 4. Reconhecimento de Conteúdo
- [x] Procedure tRPC para classificar tipo de post
- [x] IA identifica: produto, antes/depois, depoimento, educativo, promocional
- [x] Sugerir template ideal para cada tipo
- [x] Procedure aiAdvanced.recognizeContent completa
- [x] JSON Schema com type, confidence, suggestedTemplate, reason
- [ ] Análise automática ao fazer upload de imagem - UI pendente
- [ ] Badge de tipo detectado no Studio - UI pendente
- [ ] Botão "Aplicar Template Sugerido" - UI pendente

### 5. Geração de Legendas Contextualizadas
- [x] Procedure tRPC para gerar legenda baseada em imagem
- [x] IA descreve conteúdo da imagem
- [x] Gerar legenda profissional e engajadora
- [x] 3 opções de legenda (curta, média, longa)
- [x] Procedure aiAdvanced.generateCaption completa
- [x] JSON Schema com short, medium, long
- [ ] Integrar com visão computacional (análise de imagem) - requer API adicional
- [ ] Adicionar botão "Gerar Legenda da Imagem" - UI pendente

### 6. Sugestões em Tempo Real
- [x] Procedure tRPC para análise incremental
- [x] IA analisa enquanto usuário digita
- [x] Sugestões aparecem em tempo real
- [x] Procedure aiAdvanced.realtimeSuggestions completa
- [x] JSON Schema com array de suggestions
- [ ] Autocomplete inteligente - UI pendente
- [ ] Adicionar painel lateral de sugestões - UI pendente
- [ ] Aplicar sugestão com um clique - UI pendente

### 7. Corretor Ortográfico
- [x] Procedure tRPC para correção ortográfica
- [x] IA detecta erros em português BR
- [x] Sugestões de correção contextualizadas
- [x] Procedure aiAdvanced.spellCheck completa
- [x] JSON Schema com corrected e array de errors
- [ ] Underline vermelho em erros - UI pendente
- [ ] Menu de contexto com sugestões - UI pendente
- [ ] Botão "Corrigir Tudo" - UI pendente

### 8. Análise de Tom de Voz
- [x] Procedure tRPC para analisar consistência de tom
- [x] IA compara com posts anteriores
- [x] Detectar desvios de tom (muito formal/informal)
- [x] Sugerir ajustes para manter consistência
- [x] Procedure aiAdvanced.analyzeTone completa
- [x] JSON Schema com currentTone, averageTone, consistency, deviations, adjustments
- [ ] Badge de consistência no Studio - UI pendente
- [ ] Histórico de tom dos últimos 10 posts - UI pendente

### 9. Sugestões de Emojis
- [x] Procedure tRPC para sugerir emojis
- [x] IA analisa contexto e sentimento
- [x] Sugerir 10 emojis relevantes
- [x] Categorizar por tipo (emoção, objeto, ação)
- [x] Procedure aiAdvanced.suggestEmojis completa
- [x] JSON Schema com array de emojis (emoji, category, reason)
- [ ] Adicionar picker de emojis inteligente - UI pendente
- [ ] Inserir emoji na posição do cursor - UI pendente

### 10. Variações de Legenda
- [x] Procedure tRPC para gerar 5 variações
- [x] IA mantém mensagem principal
- [x] Variar: tom, tamanho, hashtags, CTAs
- [x] Opções: profissional, casual, motivacional, urgente, educativo
- [x] Procedure aiAdvanced.generateVariations completa
- [x] JSON Schema com array de variations (tone, text)
- [x] Todos os 31 testes vitest passando
- [ ] Adicionar botão "Gerar Variações" - UI pendente
- [ ] Modal com 5 versões lado a lado - UI pendente
- [ ] Botão "Usar Esta" em cada variação - UI pendente

## UIs para IA Avançada v24
- [x] Criar página TrendAnalysis.tsx
- [x] Listar top 10 tendências com cards
- [x] Botão "Usar Este Estilo" em cada tendência
- [x] Adicionar rota /tendencias no App.tsx
- [x] Grid responsivo com 2 colunas
- [x] Cards com cores dominantes, estilo de fonte e tipo de layout
- [x] Integração com aiAdvanced.analyzeTrends
- [x] Todos os 31 testes vitest passando
- [ ] Adicionar botão "🤖 Otimizar Texto" no Studio
- [ ] Modal com versão original vs otimizada
- [ ] Adicionar botão "🎯 Prever Engajamento" no Studio
- [ ] Modal com score e gráfico de radar
- [ ] Adicionar botão "🔍 Reconhecer Conteúdo" no Studio
- [ ] Badge de tipo detectado
- [ ] Adicionar botão "📝 Gerar Legendas" no Studio
- [ ] Modal com 3 opções (curta, média, longa)
- [ ] Adicionar botão "✅ Corrigir Ortografia" no Studio
- [ ] Underline vermelho em erros
- [ ] Adicionar botão "🎭 Analisar Tom" no Studio
- [ ] Badge de consistência de tom
- [ ] Adicionar botão "😊 Sugerir Emojis" no Studio
- [ ] Picker de emojis inteligente
- [ ] Adicionar botão "📋 Gerar Variações" no Studio
- [ ] Modal com 5 versões lado a lado
- [ ] Implementar painel lateral de sugestões em tempo real
- [ ] Análise enquanto usuário digita
- [ ] Aplicar sugestão com um clique

## Funcionalidades v25 - Botões de IA no Studio
- [x] Adicionar botão "🤖 Otimizar Texto com IA" no Studio
- [x] Implementar modal de comparação lado a lado (original vs otimizado)
- [x] Adicionar botões "Usar Texto Otimizado" e "Copiar"
- [x] Adicionar botão "🎯 Prever Engajamento" no Studio
- [x] Implementar modal com score 0-100 e análise detalhada
- [x] Mostrar breakdown por fatores (texto, visual, hashtags, CTA, timing)
- [x] Exibir sugestões de melhoria para aumentar engajamento
- [x] Adicionar botão "📝 Gerar Variações de Legenda" no Studio
- [x] Implementar modal com 5 variações de diferentes tons
- [x] Adicionar badges de tom e tamanho em cada variação
- [x] Permitir copiar ou aplicar cada variação individualmente
- [x] Integrar com procedures aiAdvanced.optimizeText, predictEngagement e generateVariations
- [x] Todos os 31 testes vitest passando

## Funcionalidades v26 - Botão Sugerir Emojis
- [x] Adicionar estado showEmojiModal e emojiSuggestions no Studio
- [x] Criar mutation suggestEmojisMutation com aiAdvanced.suggestEmojis
- [x] Adicionar botão "😊 Sugerir Emojis" com gradiente amarelo-laranja
- [x] Implementar modal mostrando emojis sugeridos com contexto
- [x] Permitir aplicar emoji individualmente ao final do texto
- [x] Adicionar botão "Adicionar Todos os Emojis" no modal
- [x] Grid responsivo 2 colunas com cards amarelo-laranja
- [x] Mostrar categoria e razão de cada emoji
- [x] Botão "Copiar Todos" para copiar emojis
- [x] Testar integração com procedure existente
- [x] Todos os 31 testes vitest passando

## Correção de Bug - Página Templates
- [x] Investigar erro "require is not defined" na página /templates
- [x] Identificar código do servidor sendo executado no cliente (require em procedures)
- [x] Corrigir imports substituindo require() por import() dinâmico
- [x] Substituir require em templates.list, getByCategory e getById
- [x] Testar página Templates após correção
- [x] Todos os 31 testes vitest passando

## Refatoração v28 - Hierarquia Simplificada + LucresIA
- [x] Simplificar header de 13 para 5 itens: Criar | Postar | Resultados | LucresIA | Mais
- [x] Criar dropdown "Mais" com itens secundários (Galeria, Templates, Elementos, Créditos, Instagram, Meus Templates, Sair)
- [x] Mesclar Analytics + Performance + TemplatePerformance em página única "/resultados"
- [x] Criar página "/postar" unificada (agendamento + campanhas + status)
- [x] Renomear "Estrategista IA" para "LucresIA" (LUCRO + EStética + IA)
- [x] Criar página dedicada LucresIA com avatar roxo-rosa e 4 cards de funcionalidades
- [x] Integrar nome "LucresIA" em todos os 5 modais de IA (Otimizar, Prever, Variações, Emojis, Hashtags)
- [x] Adicionar tooltips contextuais nos 4 botões de IA com "quando usar"
- [x] Adicionar badges nos botões: "Após rascunho", "Antes de publicar", "5 tons diferentes", "10 emojis"
- [x] Atualizar rotas no App.tsx (/postar, /resultados, /lucresia)
- [x] Testar navegação completa
- [x] Todos os 31 testes vitest passando

## Funcionalidades v29 - Onboarding + Desbloqueio + Seção LucresIA
- [x] Criar componente Onboarding com 3 passos
- [x] Passo 1: Escolha de nicho (6 cards: Facial, Corpo, Capilar, Unhas, Maquiagem, Spa)
- [x] Passo 2: Escolha de template (3 templates do nicho selecionado)
- [x] Passo 3: Pronto para criar (apresentação da LucresIA + CTA)
- [x] Salvar progresso do onboarding no localStorage
- [x] Forçar onboarding no primeiro acesso (redirecionar de / para /onboarding)
- [x] Progress bar visual com 3 etapas e checkmarks
- [x] Adicionar sistema de desbloqueio baseado em contagem de posts
- [x] Esconder Concorrentes até 5 posts criados (badge "🔒 (X posts)" em laranja)
- [x] Esconder Tendências até 10 posts criados (badge "🔒 (X posts)" em laranja)
- [x] Botões desabilitados visualmente (opacity 50%, cursor not-allowed)
- [x] Ícone muda de 🔒 para 🔍/📈 quando desbloqueado
- [x] Criar seção "✨ Assistente LucresIA" no Studio
- [x] Agrupar 4 botões de IA em card destacado (gradiente purple-pink)
- [x] Adicionar avatar roxo-rosa + título + subtítulo "LUCRO + EStética + IA"
- [x] Border destacado (2px purple-200) + shadow elevado
- [x] Corrigir teste de recurring posts
- [x] Todos os 31 testes vitest passando

## Reversão v30 - Remover Onboarding Infantil
- [x] Remover rota /onboarding do App.tsx
- [x] Remover lógica de redirecionamento baseada em localStorage
- [x] Remover arquivo Onboarding.tsx
- [x] Voltar rota "/" para renderizar Studio diretamente
- [x] Manter sistema de desbloqueio (Concorrentes/Tendências)
- [x] Manter seção "Assistente LucresIA" no Studio
- [x] Manter header simplificado (5 itens)
- [x] Todos os 31 testes vitest passando

## Funcionalidades v31 - Ajustes de Design + Tooltip + Atalhos
- [x] Remover emoji ✨ do avatar da LucresIA (substituído por "AI" em texto branco)
- [x] Substituir rosa por azul turquesa em todos os gradientes
- [x] Atualizar gradientes: purple-pink → purple-cyan em 8 arquivos
- [x] Atualizar seção "Assistente LucresIA" no Studio (purple-cyan)
- [x] Atualizar página LucresIA (purple-cyan com avatar "AI")
- [x] Atualizar botão "LucresIA" no header (purple-cyan)
- [x] Atualizar Gallery, AutoRepost, CanvaIntegration, TrendAnalysis, Resultados (purple-cyan)
- [x] Implementar tooltip de primeira visita no Studio
- [x] Detectar primeira visita via localStorage ("elevare_studio_visited")
- [x] Tooltip aponta para seção "Assistente LucresIA" com animação bounce
- [x] Card gradiente purple-cyan com mensagem de boas-vindas
- [x] Botão "Entendi" fecha tooltip e marca como visto
- [x] Implementar atalhos de teclado globais com event listener
- [x] Ctrl+G para Gerar Legendas (validação de texto)
- [x] Ctrl+O para Otimizar Texto (validação de texto)
- [x] Ctrl+E para Prever Engajamento (validação de texto)
- [x] Mostrar atalhos nos tooltips dos botões de IA
- [x] Mensagens de erro contextuais para atalhos
- [x] Cleanup automático de event listeners
- [x] Todos os 31 testes vitest passando

## Melhorias v32 - Organização Visual Baseada em HTML Sugerido
- [x] Analisar diferenças entre HTML sugerido e Studio atual
- [x] Adicionar títulos com emojis nas seções principais
- [x] ✍️ Texto & Estratégia (painel esquerdo)
- [x] 🖼 Pré-visualização ao Vivo (painel central)
- [x] 🚀 Publicação (seção de ações)
- [x] 📝 Legenda • NeuroVendas (seção LucresIA renomeada)
- [x] 🎨 Fonte & Cor (painel direito)
- [x] ✨ Efeitos de Imagem (painel direito)
- [x] Adicionar borders sutis (border-b border-slate-200) nos títulos H3
- [x] Substituir H3 por Labels em sub-seções (Formato, Modelo Visual, Imagem)
- [x] Manter essência inicial (paleta purple-cyan, tooltips, atalhos)
- [x] Preservar seção LucresIA destacada com avatar AI
- [x] Layout 3 colunas mantido
- [x] Todos os 31 testes vitest passando

## Reorganização v33 - Fluxo Intuitivo de Criação
- [x] Analisar fluxo atual vs fluxo intuitivo do usuário
- [x] Mover Tags do painel central para painel esquerdo (logo após texto)
- [x] Mover "Gerar Legendas" do painel central para painel esquerdo (após Tags)
- [x] Remover duplicatas de Tags e Gerar Legendas do painel central
- [x] Nova ordem painel esquerdo: Texto → Tags → Gerar Legendas → Formato → Modelo → Imagem
- [x] Painel central simplificado: Preview → Publicação → LucresIA
- [x] Fluxo lógico: criar conteúdo → formatar visual → otimizar com IA → publicar
- [x] Manter hierarquia visual com títulos e borders
- [x] Todos os 31 testes vitest passando

## Funcionalidades v34 - Gerador de Materiais (Apresentações + eBooks)
- [x] Criar tabela `generated_materials` no schema
- [x] Aplicar migração do banco de dados (pnpm db:push)
- [x] Criar procedure `materials.generatePresentation` (gera conteúdo de slides com LucresIA)
- [x] Criar procedure `materials.generateEbook` (gera conteúdo de capítulos com LucresIA)
- [x] Criar procedure `materials.list` (lista materiais do usuário)
- [x] Criar procedure `materials.getById` (busca material específico)
- [x] Criar procedure `materials.delete` (deleta material)
- [x] Criar procedure `materials.exportToPdf` (exporta para PDF usando manus-md-to-pdf)
- [x] Criar página `/gerador-materiais` com 2 tabs (Apresentação e eBook)
- [x] Formulário para Apresentação (tema, tom, número de slides 5-30, público-alvo)
- [x] Formulário para eBook (tema, tom, número de capítulos 3-10, público-alvo)
- [x] Preview do conteúdo gerado em markdown
- [x] Botão "Baixar Markdown" para download local
- [x] Botão "Exportar PDF" com upload automático para S3
- [x] Galeria de materiais gerados com filtros por tipo
- [x] Loading states e spinners em todas as mutações
- [x] Toast notifications para sucesso/erro
- [x] Adicionar rota `/gerador-materiais` no App.tsx
- [x] Adicionar link no dropdown "Mais" do header
- [x] Todos os 31 testes vitest passando
- [x] Preparar documentação para integração futura com Canva API

## Funcionalidades v35 - Integração com Canva API (WIP)
- [x] Adicionar variáveis de ambiente CANVA_CLIENT_ID e CANVA_CLIENT_SECRET ao env.ts
- [x] Criar tabela canva_tokens no schema para armazenar tokens OAuth
- [x] Criar tabela canva_designs no schema para armazenar designs criados
- [x] Aplicar migração do banco de dados (pnpm db:push)
- [x] Criar helper canvaApi.ts com 8 funções (OAuth, designs, export)
- [x] Implementar OAuth flow (getCanvaAuthUrl, exchangeCodeForTokens, refreshAccessToken, revokeToken)
- [x] Criar endpoint /api/canva/callback para processar OAuth
- [x] Procedure canvaIntegration.connect (inicia OAuth flow)
- [x] Procedure canvaIntegration.disconnect (revoga token)
- [x] Procedure canvaIntegration.getStatus (verifica se conectado)
- [x] Procedure canvaIntegration.generateCarousel (gera post carrossel 5-15 slides)
- [x] Procedure canvaIntegration.generateVideo (gera vídeo curto 15-60s)
- [x] Procedure canvaIntegration.listDesigns (lista designs criados)
- [x] Procedure canvaIntegration.exportDesign (exporta design como PNG/MP4)
- [x] Procedure canvaIntegration.deleteDesign (deleta design)
- [x] Adicionar estados para Carrossel e Vídeo na página Gerador de Materiais
- [x] Adicionar mutations para Canva (connect, generateCarousel, generateVideo)
- [ ] Adicionar tab "Carrossel" na interface
- [ ] Adicionar tab "Vídeo" na interface
- [ ] Formulário para Carrossel (tema, tom, número de slides)
- [ ] Formulário para Vídeo (tema, tom, duração)
- [ ] Botão "Conectar Canva" com status visual (verde=conectado, cinza=desconectado)
- [ ] Galeria de designs do Canva com thumbnails
- [ ] Botão "Editar no Canva" abrindo editUrl em nova aba
- [ ] Botão "Exportar" para PNG/MP4
- [ ] Todos os testes vitest passando
- [ ] Documentar processo de obtenção de credenciais do Canva
