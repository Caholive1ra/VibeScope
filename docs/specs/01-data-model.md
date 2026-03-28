# VibeScope - Spec 01: Data Model & Infrastructure

## 1. Visão Geral da Arquitetura (Bootstrapping / Custo Zero)
* **Backend:** Java 17+ com Spring Boot (Hospedagem: Render - Free Web Service).
* **Banco de Dados:** PostgreSQL relacional (Hospedagem: Supabase - Plano Gratuito).
* **Storage (Arquivos):** Supabase Storage Buckets (Para áudios e imagens de feedback).
* **Frontend / PWA:** React + Vite (Hospedagem: Vercel - Plano Hobby).
* **Inteligência Artificial:** Google AI Studio (Gemini API - Free Tier) para processamento multimodal (Texto, Áudio e Imagem).

---

## 2. Diagrama de Relacionamento (Entidades JPA)

[PROJETO] 1 -----> N [RODADA_REFACAO]
[RODADA_REFACAO] 1 -----> N [TAREFA_TECNICA]
[RODADA_REFACAO] 1 -----> N [ANEXO_FEEDBACK]

---

## 3. Dicionário de Dados (PostgreSQL)

### Tabela: `projeto`
Entidade raiz que gerencia o contrato e o limite de escopo do cliente.
* `id` (UUID) - Primary Key.
* `cliente_nome` (VARCHAR 255) - Nome do cliente. Not Null.
* `nome_projeto` (VARCHAR 255) - Título do projeto. Not Null.
* `video_url` (VARCHAR 500) - Link de referência (Vimeo/Drive). Not Null.
* `limite_refacoes` (INT) - Teto de refações acordadas. Default: 3.
* `status` (VARCHAR 50) - Enum: `AGUARDANDO_CLIENTE`, `REFACAO_SOLICITADA`, `APROVADO`.
* `magic_token` (VARCHAR 100) - Token único para acesso sem login. Unique, Not Null.
* `created_at` (TIMESTAMP) - Timestamp de criação.
* `updated_at` (TIMESTAMP) - Timestamp de atualização.

### Tabela: `rodada_refacao`
Representa uma iteração de feedback do cliente.
* `id` (BIGSERIAL) - Primary Key.
* `projeto_id` (UUID) - Foreign Key para `projeto`.
* `numero_rodada` (INT) - Identificador sequencial da rodada (ex: 1, 2, 3). Not Null.
* `feedback_bruto` (TEXT) - Texto original do cliente ou transcrição da IA.
* `consumiu_escopo` (BOOLEAN) - Define se esta rodada abate do `limite_refacoes`. Default: TRUE.
* `prazo_entrega` (TIMESTAMP) - Cálculo de SLA para a equipe técnica entregar.
* `data_conclusao` (TIMESTAMP) - Preenchido ao finalizar todas as tarefas técnicas.
* `created_at` (TIMESTAMP) - Timestamp de criação.

### Tabela: `anexo_feedback` (Multimodalidade)
Guarda as referências de mídias enviadas no brain dump do cliente.
* `id` (UUID) - Primary Key.
* `rodada_id` (BIGINT) - Foreign Key para `rodada_refacao`.
* `tipo_midia` (VARCHAR 20) - Enum: `AUDIO`, `IMAGEM`, `DOCUMENTO`.
* `url_arquivo` (VARCHAR 500) - URL pública/assinada do bucket do Supabase. Not Null.
* `created_at` (TIMESTAMP) - Timestamp de upload.

### Tabela: `tarefa_tecnica`
A tradução do feedback emocional para uma tarefa acionável e com minutagem.
* `id` (BIGSERIAL) - Primary Key.
* `rodada_id` (BIGINT) - Foreign Key para `rodada_refacao`.
* `timecode` (VARCHAR 20) - Minutagem exata da ação (ex: 00:15). Not Null.
* `descricao` (TEXT) - Ação técnica gerada pela IA. Not Null.
* `esforco` (VARCHAR 20) - Enum de complexidade avaliada pela IA: `BAIXO`, `MEDIO`, `ALTO`.
* `status_tarefa` (VARCHAR 30) - Enum: `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`. Default: `PENDENTE`.
* `created_at` (TIMESTAMP) - Timestamp de criação.
* `updated_at` (TIMESTAMP) - Timestamp de atualização.

---

## 4. Regras de Negócio e Restrições (Constraints)
1.  **Exclusão em Cascata (Cascade):** Se um `Projeto` for deletado, todas as suas `Rodadas` e `Tarefas` associadas devem ser deletadas.
2.  **Imutabilidade do Magic Token:** O `magic_token` é gerado apenas na criação do `Projeto` e não pode ser alterado.
3.  **Bloqueio de Escopo:** Uma nova `Rodada_Refacao` não pode ser criada se a contagem atual de rodadas (onde `consumiu_escopo = true`) for igual ou maior que o `limite_refacoes` do Projeto, a menos que autorizado por um override gerencial.