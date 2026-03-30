# 📱 DIRETRIZES ESTRITAS: MOCKUPS DE CELULAR E APRESENTAÇÃO (VibeScope)

## ⚠️ INSTRUÇÃO DE ALTA PRIORIDADE PARA A IA
Você está atuando como Desenvolvedor Frontend Sênior. Ao editar a página `Presentation.jsx`, você está **ESTRITAMENTE PROIBIDO** de remover, alterar a estrutura ou substituir os iframes interativos do componente `<DeviceMockup />`. O não cumprimento desta regra quebra a experiência principal do produto.

---

## 1. O Conceito: Apresentação vs. App Real

Para fins de clareza, a nossa interface é dividida em duas camadas distintas que não devem se misturar:

* **A Camada de Apresentação (Landing Page):** É o "palco". Consiste no fundo escuro (`#0D0D0D`), tipografia animada, textos explicativos e o scroll dinâmico. Você tem liberdade para melhorar o design desta camada.
* **A Camada do Produto (Mockups Interativos):** São as "telas dos celulares". Elas rodam as rotas reais do nosso sistema React através de `<iframe>`. **Esta camada é imutável.** Ela simula um aplicativo nativo rodando no bolso do usuário.

---

## 2. Regras de Ouro do Mockup (DeviceMockup)

O componente que renderiza o celular possui regras visuais inegociáveis para manter a ilusão de um app nativo:

1.  **Dimensões Fixas:** O telefone deve manter proporções realistas (ex: `w-[320px] h-[650px]`).
2.  **O Notch (Câmera):** Deve sempre haver um elemento simulando o recorte da câmera no topo da tela para reforçar o visual de hardware.
3.  **Bordas Arredondadas Infinitas:** O iframe não pode ter pontas quadradas vazando pelo celular. O fundo do container e o iframe devem respeitar as curvas (`rounded-[3rem]`).
4.  **Barra de Rolagem Invisível:** A classe global `.hide-scrollbar` (definida no CSS) DEVE estar presente no iframe. O usuário pode rolar o app, mas a barra nativa do navegador não pode aparecer de jeito nenhum.

---

## 3. Código Imutável do Componente

Se você precisar recriar ou reestruturar a página, o componente abaixo **DEVE** ser utilizado exatamente desta forma:

```jsx
// COMPONENTE SAGRADO - NÃO ALTERAR A ESTRUTURA DO IFRAME
const DeviceMockup = ({ url, title, description, animationProps }) => (
  <motion.div {...animationProps} className="flex flex-col items-center gap-6">
    
    {/* Moldura do Hardware */}
    <div className="w-[320px] h-[650px] border-[12px] border-gray-900 rounded-[3rem] overflow-hidden relative shadow-2xl bg-[#0D0D0D] shrink-0 ring-1 ring-gray-700">
       
       {/* Notch / Dynamic Island Simulado */}
       <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl w-1/2 mx-auto z-50 pointer-events-none"></div>
       
       {/* O App Real - Iframe Blindado */}
       <iframe 
          src={url} 
          className="w-full h-full border-none pt-4 pb-2 bg-[#0D0D0D] hide-scrollbar rounded-b-[2.5rem]"
          title={title}
       />

    </div>
    
    {/* Textos de Apoio da Apresentação */}
    <div className="text-center max-w-sm mt-2">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-2 text-sm">{description}</p>
    </div>
    
  </motion.div>
);

4. Instrução de Modificação
Ao receber um novo prompt para atualizar a Landing Page:

Foque apenas nos textos, espaçamentos externos e transições de scroll.

Mantenha as 3 chamadas do <DeviceMockup /> apontando para as rotas corretas (/editor/novo, /editor, /projeto/demo-token).