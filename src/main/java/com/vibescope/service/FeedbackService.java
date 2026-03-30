package com.vibescope.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibescope.domain.entity.AnexoFeedback;
import com.vibescope.domain.entity.Projeto;
import com.vibescope.domain.entity.RodadaRefacao;
import com.vibescope.domain.entity.TarefaTecnica;
import com.vibescope.domain.enums.EsforcoTarefa;
import com.vibescope.domain.enums.ProjetoStatus;
import com.vibescope.domain.enums.StatusTarefa;
import com.vibescope.domain.enums.TipoMidia;
import com.vibescope.dto.FeedbackRequestDTO;
import com.vibescope.exception.ResourceNotFoundException;
import com.vibescope.repository.AnexoFeedbackRepository;
import com.vibescope.repository.ProjetoRepository;
import com.vibescope.repository.RodadaRefacaoRepository;
import com.vibescope.repository.TarefaTecnicaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final ProjetoRepository projetoRepository;
    private final RodadaRefacaoRepository rodadaRefacaoRepository;
    private final AnexoFeedbackRepository anexoFeedbackRepository;
    private final TarefaTecnicaRepository tarefaTecnicaRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processarFeedback(String magicToken, FeedbackRequestDTO request) {
        // a) Buscar o Projeto pelo token
        Projeto projeto = projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));

        // b) Criar e salvar uma nova RodadaRefacao
        int proximoNumero = projeto.getRodadas().size() + 1;
        RodadaRefacao rodada = RodadaRefacao.builder()
                .projeto(projeto)
                .numeroRodada(proximoNumero)
                .feedbackBruto(request.feedbackTexto())
                .build();

        rodada = rodadaRefacaoRepository.save(rodada);

        // c) Iterar sobre os anexos do DTO e salvar as entidades AnexoFeedback
        if (request.anexos() != null) {
            for (FeedbackRequestDTO.AnexoDTO anexoDto : request.anexos()) {
                AnexoFeedback anexo = AnexoFeedback.builder()
                        .rodada(rodada)
                        .tipoMidia(TipoMidia.valueOf(anexoDto.tipo().toUpperCase()))
                        .urlArquivo(anexoDto.url())
                        .build();
                anexoFeedbackRepository.save(anexo);
            }
        }

        // d) Chamar Groq (OpenAI format) - blindado
        String promptSistema = """
                    Você é um Assistente Técnico de Edição de Vídeo. Sua função é ler o feedback de um cliente (o "Brain Dump") e transformá-lo em uma lista estrita de tarefas técnicas acionáveis para o editor de vídeo.

                    REGRAS OBRIGATÓRIAS PARA TIMECODE (minutagem):
                    1. EXATO: Se o cliente citar o tempo (ex: "aos 1:20", "no minuto 2"), extraia e formate como [MM:SS].
                    2. CONTEXTUAL: Se o cliente não der o tempo, mas descrever a cena (ex: "na hora que o moço sorri", "no finalzinho"), crie uma tag descritiva curta. Exemplo: [Cena: moço sorrindo] ou [Final].
                    3. GLOBAL: Se o feedback afetar o vídeo como um todo ou o cliente não der nenhuma pista de onde é (ex: "a cor está lavada", "achei o vídeo longo"), use a tag exata: [Geral].

                    REGRAS PARA ESFORÇO:
                    Classifique o esforço da tarefa apenas como: BAIXO, MEDIO ou ALTO.
                    - BAIXO: Textos, volume de áudio, cortes simples.
                    - MEDIO: Correção de cor, transições, animações simples.
                    - ALTO: Refazer motion graphics, trocar trilha sonora inteira, reestruturar a narrativa.

                    FORMATO DE SAÍDA:
                    Retorne EXCLUSIVAMENTE um JSON puro, sem formatação markdown (sem ```json), contendo um array de objetos.
                    Exemplo:
                    [
                      { "timecode": "[Geral]", "descricao": "Aplicar correção de cor primária", "esforco": "MEDIO", "status_tarefa": "PENDENTE" },
                      { "timecode": "[Cena: praia]", "descricao": "Suavizar transição", "esforco": "BAIXO", "status_tarefa": "PENDENTE" }
                    ]
                """;

        StringJoiner userContent = new StringJoiner("\n");
        userContent.add("Feedback do Cliente: " + (request.feedbackTexto() != null ? request.feedbackTexto() : ""));

        if (request.anexos() != null && !request.anexos().isEmpty()) {
            userContent.add("");
            userContent.add("Anexos Recebidos:");
            for (var anexo : request.anexos()) {
                userContent.add("- Tipo: " + anexo.tipo() + " | URL: " + anexo.url());
            }
        }

        String jsonIA = groqService.processarComIA(promptSistema, userContent.toString());

        // e) Parse do JSON e salvar Tarefas Técnicas
        try {
            JsonNode root = objectMapper.readTree(jsonIA);

            // Como o Gemini agora devolve um Array direto [],
            // tratamos o 'root' como a própria lista de tarefas.
            if (root.isArray()) {
                for (JsonNode t : root) {
                    TarefaTecnica tarefa = TarefaTecnica.builder()
                            .rodada(rodada)
                            // Usa .path() em vez de .get() para evitar NullPointer se o campo sumir
                            .timecode(t.path("timecode").asText("[Geral]"))
                            .descricao(t.path("descricao").asText("Sem descrição"))
                            .esforco(safeParseEsforco(t.path("esforco").asText()))
                            .statusTarefa(StatusTarefa.PENDENTE)
                            .build();
                    tarefaTecnicaRepository.save(tarefa);
                }
            }

            // Definimos um valor padrão para o escopo já que o prompt simplificado não
            // enviou
            rodada.setConsumiuEscopo(true);
            rodadaRefacaoRepository.save(rodada);

        } catch (Exception e) {
            log.error("Erro ao processar resposta da IA", e);
            throw new RuntimeException("Falha no processamento das tarefas técnicas: " + e.getMessage());
        }

        // f) Atualizar status do projeto
        projeto.setStatus(ProjetoStatus.EM_ANALISE);
        projetoRepository.save(projeto);
    }

    private EsforcoTarefa safeParseEsforco(String esforco) {
        if (esforco == null)
            return EsforcoTarefa.MEDIO;
        try {
            String clean = esforco.toUpperCase()
                    .replace("É", "E")
                    .replace("Í", "I")
                    .replace("Ó", "O")
                    .trim();
            return EsforcoTarefa.valueOf(clean);
        } catch (IllegalArgumentException e) {
            log.warn("Esforço inválido recebido da IA: {}. Usando MÉDIO como padrão.", esforco);
            return EsforcoTarefa.MEDIO;
        }
    }
}
