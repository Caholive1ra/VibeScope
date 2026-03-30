# 🎬 VibeScope: O Fim do Telefone Sem Fio na Pós-Produção

> **VibeScope transforma a intenção criativa abstrata e subjetiva em um plano de execução técnico impulsionado por IA.**

🔗 **[Link da Aplicação no Ar]** | 💻 **[Link do Repositório]**

---

## 🩸 O Problema: A Dor Real que Destrói Margens de Lucro

O maior gargalo da indústria audiovisual não é a falta de poder de processamento, nem o software de edição ou a lente ciniematográfica mais recente. **É a comunicação humana.** 

Visualize uma cena caótica e tragicamente comum: Sexta-feira, 18h. O cliente aprova "quase tudo", mas manda um áudio de 4 minutos no WhatsApp repleto de abstrações: *"Senti que faltou energia na virada do minuto dois. Dá pra deixar com uma vibe mais tech? E aquele corte ali, não sei, não bateu, me fez sentir desconfortável."* 

Clientes não sabem o que é um *Jump Cut*, *L-Cut* ou *Color Grading*. Eles falam em emoções e sensações, não em *frames*. O impacto prático disso? O editor perde **40% do seu dia** tentando decifrar e adivinhar as reais intenções por trás de metáforas soltas. 

O resultado não é apenas frustração, mas o inevitável e doloroso ciclo do arquivo `Projeto_Final_v5_Agora_Vai_Revisado_FINAL.mp4`. Isso atrasa cronogramas, cansa a equipe técnica, queima horas não orçadas e **destrói silenciosamente a margem de lucro da agência produtora.**

---

## 💡 A Solução e Nosso Raciocínio

Tentamos, por anos como mercado, educar o cliente a preencher planilhas técnicas e a usar jargões corretos. É inútil. O cliente contrata uma agência justamente para não ter que pensar de forma técnica. A resposta correta não era mudar o cliente ou forçá-lo a um molde, mas sim criar um **Tradutor Universal**.

Apresentamos o conceito do **Brain Dump**. Em vez de lutar contra a natureza do criativo e do cliente, nós a abraçamos. Eles simplesmente "vomitam" a ideia bruta — seja em texto desestruturado, seja soltando um conceito abstrato longo — e o motor de IA do VibeScope assume o papel de um verdadeiro **Diretor Técnico Sênior**.

Nossa integração lê as entrelinhas e traduz *sentimentos e percepções fluidas* num painel de tarefas altamente estruturado para o editor, chegando a inferir a minutagem e o nível de esforço técnico de cada alteração.

**Para entender o poder do motor:** 
- O cliente diz, da forma dele: *"Corta aquela parte que o CEO gagueja antes de rir, ficou enrolado, e tenta deixar o clima mais corporativo no final."*
- O VibeScope traduz imediatamente na tela do Editor:
  - ✂️ `[01:12 - 01:18]` **Remover erro de gravação, pular até a parte das risadas.** *(Esforço: Baixo, Tipo: Corte/Montagem)*
  - 🎨 `[Geral]` **Ajustar Color Grading para tons frios/profissionais** *(Esforço: Médio, Tipo: Cores)*

---

## 🔄 Na Prática: O Novo Processo da Agência

Nossa arquitetura revoluciona o workflow respondendo exatamente *Quem*, *Quando* e *Como*:

- 🌱 **O Criativo/Atendimento (A Semente do Projeto):** Sai de uma call exaustiva com o cliente, abre o VibeScope no desktop e simplesmente joga o *Brain Dump* (suas próprias anotações brutas e caóticas da reunião). Em segundos, a IA digere o caos e gera o "Projeto Orquestrado".
  
- ⚙️ **O Editor (O Motor):** Abre o app pela manhã. No lugar de decifrar *threads* gigantescas de e-mail ou voltar em mensagens do WhatsApp, ele encontra uma **fila de produção higienizada**. As tarefas estão ali, "mastigadas", traduzidas, categorizadas e com o nível de esforço calculado na sua frente. O foco passa a ser puramente execução e arte.

- ⚖️ **O Cliente (O Veredito):** Ao finalizar o corte ou enviar uma nova versão, o cliente recebe um *Magic Link* seguro no celular. Ele não cria conta, não precisa de senha impossível ou baixar apps nativos. Apenas abre no navegador do celular, assiste ao material, revisa a linha do tempo e clica em **"Enviar Brain Dump"** para dar feedback em texto corrido (ou áudio). O ciclo se reinicia, enviando contexto limpo de volta à IA para a próxima rodada perfeita. Atrito zero.

---

## ⚙️ Tech Stack & Arquitetura (O Raciocínio Técnico)

O VibeScope foi projetado desde a primeira linha de código pensando em UX (User Experience) premium, performance extrema em baixa latência e escalabilidade enterprise:

- **Frontend:** Construído em **React + Tailwind CSS**. Decidimos adotar uma arquitetura estritamente *Mobile-First*, com uma interface ultra-minimalista ("Dark Aesthetic") que respira eficiência. Está estruturalmente preparada para ser empacotada e gerar executáveis nativos (via *Ionic Capacitor* para virar `.apk` Android e `.ipa` iOS), permitindo uso do hardware do celular pelo cliente no futuro (microfone direto para feedback).
- **Backend:** O coração seguro de controle do fluxo é feito em **Java com Spring Boot**, orquestrando os dados relacionais, endpoints assíncronos e integração profunda com as camadas de IA. O banco de dados fica no potente PostgreSQL (Hospedagem no Supabase).
- **IA Generativa:** Em vez de usar IAs apenas para chat visual, nós usamos as inferências rapidíssimas da API via **Groq (com o poderoso modelo Llama 3)**. Forçamos o modelo a não conversar, mas a ser uma literal engrenagem dentro do motor: ele recebe *inputs* destruturados pelo Backend e responde estritamente no formato de Objetos JSON, permitindo que a aplicação faça parse inteligente e salve em banco as tarefas de imediato.

---

### 🚀 Rodando e Testando o Projeto Localmente

**Pré-requisitos:**
1. Java 21+ instalado no ambiente.
2. Node.js (v18+) e NPM.
3. Possuir as chaves de variáveis de ambiente configuradas no arquivo `.env` da raiz e `.env` do WEB (incluindo `GROQ_API_KEY`, credenciais e banco de dados rodando).

**1. Subindo o Core Backend (Java Spring Boot)**
```bash
# Na raiz do projeto backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```
*(O backend escutará localmente na porta 8080).*

**2. Subindo o Frontend (VibeScope App)**
```bash
# Em um novo terminal, entre na pasta do front
cd vibescope-web
npm install
npm run dev
```
*(O frontend VibeScope subirá no `http://localhost:5173` ou na próxima porta Vite disponível).*

**Hack the Vibe. Ship the Future.**
