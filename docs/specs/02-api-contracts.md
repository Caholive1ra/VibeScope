# VibeScope - Spec 02: API Contracts & AI Prompts

## 1. Endpoints Principais (Spring Boot REST API)

### A. Criar Novo Projeto (Uso Interno/Agência)
* **Rota:** `POST /api/v1/projetos`
* **Payload (Request):**
  ```json
  {
    "cliente_nome": "Nome do Cliente",
    "nome_projeto": "Campanha de Lançamento",
    "video_url": "[https://vimeo.com/123456](https://vimeo.com/123456)",
    "limite_refacoes": 3
  }
  Retorno Esperado (201 Created): Objeto do projeto salvo, incluindo o magic_token gerado.

B. Carregar Área do Cliente (Acesso Frictionless)
Rota: GET /api/v1/projetos/magic/{magic_token}

Retorno Esperado (200 OK): Dados do projeto (sem dados sensíveis da agência), status atual, e histórico de refações anteriores para exibição na UI.

C. Submeter Feedback "Brain Dump" (Cliente)
Rota: POST /api/v1/projetos/magic/{magic_token}/feedback

Payload (Request):
{
  "feedback_texto": "O vídeo tá legal, mas achei a cor meio apagada nos 15 segundos, e a logo no final tem que ficar maior.",
  "anexos": [
    { "tipo": "AUDIO", "url": "https://supabase.../audio1.ogg" },
    { "tipo": "IMAGEM", "url": "https://supabase.../print_tela.png" }
  ]
}
Processamento Interno: O Spring Boot envia esse pacote para a IA (Gemini), aguarda o JSON de tarefas, salva tudo no banco e retorna sucesso.

Retorno Esperado (200 OK): Confirmação de recebimento e número da rodada gerada.

D. Listar Tarefas da Rodada (Visão Mobile do Editor)
Rota: GET /api/v1/projetos/{id}/rodadas/{rodada_id}/tarefas

Retorno Esperado (200 OK): Array com as tarefas técnicas formatadas (timecode, descrição, esforço e status).

2. A Ponte da IA (System Prompt para o Gemini)
Este é o System Prompt estrito que o Spring Boot enviará para a API do Gemini:

[SYSTEM INSTRUCTION]
Você é o "Árbitro de Escopo", um assistente técnico especializado em edição de vídeo.
Sua missão é receber um feedback bruto (texto, transcrição de áudio ou imagens) de um cliente e traduzi-lo em tarefas técnicas acionáveis para um editor de vídeo.

REGRAS OBRIGATÓRIAS:

Extraia o timecode exato de cada solicitação, se mencionado. Se não houver, use "[Geral]".

Classifique o esforço da edição como "BAIXO", "MEDIO" ou "ALTO".

Seja direto e técnico na descrição da tarefa.

Você deve retornar EXCLUSIVAMENTE um objeto JSON válido, sem formatação Markdown ao redor (```json), sem textos introdutórios e sem explicações adicionais.

ESTRUTURA JSON ESPERADA:
{
"analise_geral": "Breve resumo do sentimento do cliente",
"tarefas": [
{
"timecode": "[00:15]",
"descricao": "Aplicar correção de cor primária para aumentar saturação/contraste.",
"esforco": "MEDIO"
},
{
"timecode": "[Geral]",
"descricao": "Aumentar a escala da logomarca na cartela final.",
"esforco": "BAIXO"
}
],
"consumiu_escopo_real": true
}