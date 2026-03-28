# VibeScope - Spec 03: UI Components & Design System

## 1. Arquitetura do Frontend (React + Vite)
* **Framework:** React 18+ (Single Page Application).
* **Bundler/Build:** Vite.
* **Estilização:** Tailwind CSS.
* **PWA & Mobile:** `vite-plugin-pwa` para manifest/service workers e estrutura pronta para empacotamento com Capacitor.
* **Gerenciamento de Estado:** Zustand ou React Context API (foco em leveza).
* **Roteamento:** React Router DOM.

---

## 2. Design System Híbrido

O VibeScope possui duas "personas" visuais estritas que coexistem na mesma base de código.

### A. Landing Page (Showcase / Comercial)
Foco em conversão, clareza e demonstração da dor da agência.
* **Estética:** "Clean Tech".
* **Cores Principais:**
  * Fundo: Branco/Gelo (`#F9F9F9`).
  * Chamada para Ação (CTA): Lime Green (`#D4FF32`).
  * Detalhes/Acentos: Azul Elétrico (`#2524FF`).
* **Tipografia:** Sem serifa, alto contraste (Ex: `Inter` ou `Roboto`).
* **Componente Chave:** Mockup Interativo (um `div` moldado como um smartphone rodando o PWA funcional no centro da tela).

### B. Aplicativo PWA (Operacional / "Scope Guard")
Foco em operação rápida, visualização técnica e redução de fadiga visual.
* **Estética:** "Tech Brutalism".
* **Cores Principais:**
  * Fundo: Deep Dark Mode nativo (`#080808`).
  * Superfícies: Cinza escuro com bordas finas e sólidas (`1px solid #333`).
  * Alertas/SLA Atrasado: Vermelho saturado.
* **Tipografia:** `Monospace` obrigatória para dados técnicos, timecodes e JSON.
* **Ergonomia:** Mobile-first, Bottom Navigation Bar, alvos de toque grandes (mínimo 44x44px).

---

## 3. Estrutura de Rotas e Páginas (Views)

### Rota: `/` (Landing Page)
* **Público:** Avaliador / Decisor da Agência.
* **Conteúdo:** Hero section com a proposta de valor, explicação do problema (Scope Creep) e o Mockup Interativo rodando a interface do app.

### Rota: `/magic/:token` (Área do Cliente Externo)
* **Público:** Cliente final da agência.
* **Acesso:** Sem login (Frictionless).
* **Conteúdo:** * Header com nome do projeto e status do escopo ("Refação 1 de 3").
  * Player de vídeo embutido (referência).
  * Interface "Brain Dump": Campo de texto longo + Botões de upload (Áudio, Imagem, Documento).
  * Aviso de "Scope Guard" antes do envio definitivo.

### Rota: `/app/projetos/:id` (Dashboard de Produção)
* **Público:** Editor de Vídeo / Atendimento (Uso via Mobile PWA).
* **Conteúdo:** * Divisão em Tabs: "Pendentes", "Atrasadas", "Concluídas".
  * Cards de Tarefas Técnicas contendo: Timecode em destaque (ex: `[00:15]`), tag de esforço (`BAIXO`, `MEDIO`, `ALTO`), descrição da tarefa e botão de checklist (concluir).

---

## 4. Componentes Globais (UI Kit)
* `Button`: Variantes `primary` (Lime Green), `outline` (bordas finas), `ghost`.
* `MediaUploader`: Componente de drag-and-drop / seleção nativa do celular para áudios e imagens, conectado ao Supabase Storage.
* `TimecodeBadge`: Etiqueta monospace para destacar os minutos/segundos das tarefas.
* `ScopeMeter`: Barra de progresso visual indicando quantas refações o cliente já consumiu do contrato.