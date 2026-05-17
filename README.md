# 📑 Documentação do Front-end: Letalk.Insights

## 1. Visão Geral do Projeto
O **Letalk.Insights** é uma plataforma SPA (Single Page Application) desenvolvida em **React** e **TypeScript**, utilizando **Vite** como ferramenta de build. O objetivo principal do sistema é atuar como uma *Engine de Enrichment B2B*, permitindo que times de vendas e marketing insiram dados cadastrais (Nome, E-mail, Telefone e CNPJ) para validar e enriquecer leads de forma automática através de requisições a um backend Fastify. 

#### 1.1 Minha visão sobre o projeto e desenvolvimento
Busquei fazer um frontend simples, otimizado e atual. Tentei trazer um design moderno com algumas animações simples. O front foi onde tive mais dificuldade; apesar de ter estudado bastante React, a questão do desenvolvimento frontend eu sinto certa dificuldade. A utilização da IA foi excepcional para que eu conseguisse desenvolver de forma rápida, principalmente na parte das animações. Usei o plano gratuito do Gemini, que para mim foi o suficiente. Discuti com ele a arquitetura até chegarmos a um consenso. Iniciei o frontend no sábado por volta das 14h e terminei no mesmo dia. No domingo, por volta das 6h da manhã, voltei a configurá-lo para colocar em produção. Utilizeis dois arquivos .env: um para production e outro para development (rodar localmente)

## 2. Tecnologias Utilizadas
* **Core:** React 19+ / TypeScript
* **Build Tool:** Vite 8+
* **Estilização:** Tailwind CSS (Utilitários)
* **Animações:** Framer Motion (Transições fluidas e perspectiva 3D)
* **Ícones:** Lucide React
* **Formulários & Validação:** React Hook Form + Zod (Mapeamento de erros e validação estrita no client)
* **Gráficos:** Recharts (Renderização SVG responsiva do Foco Operacional)

---

## 3. Estrutura de Arquivos (`src/`)
A arquitetura do projeto segue o padrão de separação por responsabilidades e componentização modular:

```bash
src/
├── assets/             # Arquivos estáticos (imagens, logotipos, fontes)
├── components/         # Componentes globais e modulares da aplicação
│   ├── CompanyDashboard.tsx   # Painel completo de exibição dos dados enriquecidos
│   ├── DashboardSkeleton.tsx  # Estado de carregamento visual (Shimmer Effect)
│   ├── Footer.tsx             # Rodapé da aplicação
│   ├── MarketFitChat.tsx      # Gráfico de pizza de relevância de mercado (Recharts)
│   ├── SearchForm.tsx         # Formulário com validação Zod e máscara de CNPJ
│   └── SociosModal.tsx        # Modal com listagem completa do Quadro de Sócios (QSA)
├── hooks/              # Hooks customizados para isolar lógica de API e estados
│   └── useCompany.ts   # Contém `useCompanySearch` (Busca) e `useCompanyAnalysis` (Bot AI)
├── lib/                # Configurações de bibliotecas externas (Instâncias do Axios/Fetch)
├── pages/              # Páginas da aplicação (Visualização de rotas)
│   └── Home.tsx        # Página principal com fluxo de animação (Bem-vindo -> Busca -> Dashboard)
├── services/           # Camada de comunicação direta com as APIs (Endpoints)
├── types/              # Tipagens globais do TypeScript (Interfaces de DTOs)
│   └── company.ts      # Contém a definição do contrato de dados da empresa (`CompanyDTO`)
├── utils/              # Funções utilitárias (Formatadores, limpadores de strings)
├── App.css / App.tsx   # Componente raiz da aplicação
├── index.css           # Estilos globais e diretivas do Tailwind
└── main.tsx            # Ponto de entrada do React no DOM
```
## 4. Fluxo de Dados e Estado Global
```bash
[SearchForm] ──(Dispara Busca)──> [useCompanySearch] ──(Chamada API)──> [Fastify Backend]
                                          │
                                   (Retorna Dados)
                                          ▼
                                   [CompanyDashboard] ──(Clique Bot)──> [useCompanyAnalysis]
```
- 1 Entrada: O usuário submete os dados válidos no SearchForm.

- Transição: A Home captura o disparo, ativa a animação tridimensional de rotação (rotateY: 360) e exibe o DashboardSkeleton.

- Processamento: O hook useCompanySearch faz a requisição GET para o endpoint http://localhost:3333/api/company/:cnpj.

- Exibição: Havendo sucesso, os dados preenchem a interface do CompanyDashboard. Caso o campo porte retorne "DEMAIS", o sistema avalia o volume do Capital Social para reclassificar automaticamente o score visual para o nível real (ex: Grandes bancos ganham nível 4 de 4 em vez de 1).

- Análise Adicional: No painel, ao clicar em "Rodar Análise do Bot", o hook useCompanyAnalysis faz uma chamada secundária ao endpoint /analysis, gerando insights de abordagem comercial, dores estruturais e plano de ação técnica para o SDR.

### 5. Especificações dos Componentes Principais

#### `Home.tsx`
* **Responsabilidade:** Orquestrador principal da tela e gerenciador de fluxo visual.
* **Funcionalidades Especiais:**
  * **Gerenciamento de Estados Cruzados:** Monitora os retornos do hook `useCompanySearch` para coordenar o desaparecimento da tela de boas-vindas, a inicialização do esqueleto de carregamento e a renderização do dashboard.
  * **Animação de Perspectiva 3D:** Utiliza o `Framer Motion` com `perspective-1000` para rotacionar o card de resultados em 360° no eixo Y (`rotateY`) no momento em que a busca é disparada, criando um efeito visual cinematográfico de "processamento de dados".
  * **Tratamento de Erros de Renderização:** Sanitiza os dados do Quadro de Sócios antes de injetá-los no dashboard, mapeando de forma segura propriedades em português e inglês (`socio.nome || socio.name`) enviadas pela API para evitar quebras de interface.

#### `SearchForm.tsx`
* **Responsabilidade:** Captura, sanitização e validação estrita dos dados cadastrais do lead antes do envio.
* **Funcionalidades Especiais:**
  * **Validação por Esquema (Zod):** Integra o `React Hook Form` ao `zodResolver` para impedir o submit caso os critérios mínimos de segurança não sejam atendidos (ex: nome menor que 3 caracteres ou e-mail inválido).
  * **Máscaras Dinâmicas em Tempo de Execução:** Formata e insere pontuações automaticamente nos campos de Telefone e CNPJ enquanto o usuário digita, bloqueando caracteres alfabéticos.
  * **Bloqueio de Concorrência:** Desabilita todos os inputs e o botão de envio quando o estado `isLoading` do sistema está ativo, prevenindo requisições duplicadas ao gateway.

#### `CompanyDashboard.tsx`
* **Responsabilidade:** Hub central de inteligência comercial e exibição de dados enriquecidos.
* **Funcionalidades Especiais:**
  * **Cálculo de Porte Inteligente:** Analisa o campo de porte retornado pela Receita Federal em conjunto com o Capital Social. Se o capital ultrapassar R$ 10.000.000,00, o componente automaticamente eleva o score para o Nível Máximo (4 de 4), corrigindo distorções cadastrais de grandes corporações (como o Banco Santander) enquadradas como "DEMAIS".
  * **Interface de Controle do Letalk Sales Bot:** Consome o hook analítico e renderiza um bloco dinâmico que alterna entre o disparo da API e o controle de visibilidade da análise (`isAnalysisVisible`), permitindo expandir ou recolher o painel com transições suaves.
  * **Injeção de Dados no CRM:** Copia instantaneamente o bloco de texto unificado (`crmFormattedText`) gerado pelo backend para a área de transferência do sistema operacional (`navigator.clipboard`), exibindo um feedback visual de sucesso temporário.

#### `useCompany.ts` (Hooks customizados)
* **Responsabilidade:** Isolar a lógica de requisições HTTP (`fetch`), tratamento de exceções de rede e estados reativos do React.
* **Funcionalidades Especiais:**
  * **Desacoplamento de Chamadas:** Separa o ciclo de vida da aplicação em dois hooks independentes (`useCompanySearch` e `useCompanyAnalysis`), evitando re-renderizações desnecessárias em blocos estáticos do layout.
  * **Limpador de Strings (Sanitização):** Remove automaticamente caracteres especiais (pontos, traços e barras) dos CNPJs antes de concatená-los nas URLs de requisição (`cnpj.replace(/\D/g, '')`).
  * **Captura de Exceções Nativa:** Intercepta erros estruturais de respostas HTTP (como `status 404` ou `500`) e mapeia as mensagens de erro customizadas vindas do backend Fastify diretamente nos estados locais de erro do front-end.

#### `MarketFitChart.tsx`
* **Responsabilidade:** Representação gráfica e estatística do foco de mercado estimado para a empresa.
* **Funcionalidades Especiais:**
  * **Acoplamento Cromático Dinâmico:** Recebe o código hexadecimal da cor do score atual do lead (calculado no dashboard) e injeta dinamicamente na fatia principal do gráfico de pizza, mantendo a identidade visual do nível do lead.
  * **Renderização SVG Responsiva:** Utiliza o componente `ResponsiveContainer` da biblioteca `Recharts` para recalcular o diâmetro, raio interno (`innerRadius`) e posicionamento do gráfico automaticamente com base no tamanho do card que o engloba.
  * **Tooltip Customizada para Dark Mode:** Sobrescreve os estilos padrões da caixas de dica do gráfico para alinhar-se à paleta de cores escura da aplicação (`zinc-900` e `zinc-800`), utilizando fontes monoespaçadas para exibição limpa das porcentagens.

## 🚀 Links do Projeto em Produção (Deploy)

O projeto foi totalmente implantado na nuvem e pode ser acessado de forma 100% online através dos links abaixo:

* **Frontend (Interface do Usuário):** [https://letalk-front.netlify.app/](https://letalk-front.netlify.app/) 
* **Backend (API Rest):** [https://desafio-tecnico-letalk-backend.onrender.com](https://desafio-tecnico-letalk-backend.onrender.com)
* **Endpoint de Rota de Saúde (Healthcheck):** `/api/health` ou `/health`

> ⏳ **Nota Importante para o Avaliador:** O backend está hospedado no plano gratuito do **Render**. Caso a API fique sem receber requisições por mais de 15 minutos, o servidor entra em modo de suspensão (*Spin Down*). A primeira requisição após esse período pode demorar entre **30 e 50 segundos** para "acordar" o servidor. As requisições seguintes funcionarão instantaneamente na velocidade máxima.

---

## 🛠️ Arquitetura de Ambientes & Variáveis (.env)

O projeto foi estruturado seguindo os padrões de mercado, isolando completamente o ambiente de desenvolvimento local do ambiente de produção. O Frontend utiliza o ecossistema do **Vite** para gerenciar dinamicamente as URLs da API com base no comando executado.

### 💻 Ambiente de Desenvolvimento (Local)
Ao executar o comando `npm run dev`, o Vite consome o arquivo `.env.development`, apontando as requisições para a sua máquina:
```env
VITE_API_URL=http://localhost:3333/api
```