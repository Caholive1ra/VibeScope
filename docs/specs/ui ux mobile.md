Spec: UI/UX Mobile Viewport (Simulação de App Nativo)
Objetivo: Garantir que as rotas do VibeScope (/editor, /editor/novo, /projeto/:token), quando carregadas dentro do simulador de iPhone na página de Apresentação, respeitem os limites físicos do aparelho (Notch/Câmera, Bordas Arredondadas e Home Indicator), entregando uma experiência 100% nativa.

1. Diagnóstico do Problema Atual
Gargalo de Topo (Notch): O conteúdo "vaza" para baixo da câmera frontal (Dynamic Island), ocultando cabeçalhos e logos.

Gargalo de Base (Home Bar): O menu de navegação inferior (Footer) fica cortado pelas bordas curvas da base do celular.

Scrollbar Visível: A barra de rolagem cinza padrão do Windows/Mac aparece dentro do celular, quebrando a ilusão de um app nativo.

Espaçamento (Buracos): Uso incorreto de Flexbox faz com que elementos não preencham a tela de forma fluida.

2. Padrões de Arquitetura Visual (Safe Areas)
Como o iframe desktop não reconhece o comando nativo env(safe-area-inset-top), precisamos criar margens internas fixas (Hardcoded Paddings) no Layout principal do nosso Front-end.

Safe Area Top (Câmera/Status Bar): 48px a 56px (Tailwind: pt-12 ou pt-14).

Safe Area Bottom (Home Indicator): 32px a 40px (Tailwind: pb-8 ou pb-10).

Safe Area Laterais (Bordas Curvas): 16px a 24px (Tailwind: px-4 ou px-6).

3. Regras de Implementação (O que alterar no código)
A. Ajuste do Container Principal das Páginas Internas
Todo arquivo de página (ex: ClientView.jsx, EditorDashboard.jsx) ou o Layout.jsx global deve ter sua div raiz configurada assim:

JavaScript
// Exemplo do wrapper principal
<div className="min-h-screen bg-gray-900 text-white pt-14 pb-10 px-5 flex flex-col relative overflow-hidden">
  {/* Conteúdo da página */}
</div>
B. Ajuste de Navegação Fixa (Bottom Navigation)
Se houver um menu inferior (como os botões Fila, Monitor, IA), ele não pode colar no fundo absoluto.

JavaScript
// Exemplo de Footer de App
<nav className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 pb-8 pt-4 px-6 flex justify-between z-50 rounded-b-[2.5rem]">
  {/* Ícones */}
</nav>
(Nota: O rounded-b-[2.5rem] ajuda a acompanhar a curvatura do mockup externo se o iframe der algum vazamento).

C. Ocultar Barras de Rolagem (Scrollbars)
Para a ilusão ser perfeita, o usuário pode scrollar, mas não deve ver a barra do navegador.
Adicione isso no seu index.css ou App.css:

CSS
/* Esconde o scrollbar para Chrome, Safari e Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Esconde o scrollbar para IE, Edge e Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
Aplique a classe hide-scrollbar na div principal que tem rolagem (geralmente a logo abaixo do Safe Area Top).

D. Ajuste do Mockup Externo (O Iframe na Presentation.jsx)
O simulador do celular também precisa estar estrito:

JavaScript
// No componente MobileMockup dentro de Presentation.jsx
<div className="w-[320px] h-[650px] border-[12px] border-gray-900 rounded-[3rem] overflow-hidden relative shadow-2xl bg-black flex-shrink-0 ring-1 ring-gray-700">
   {/* Notch / Dynamic Island Simulado */}
   <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl w-1/2 mx-auto z-50"></div>
   
   <iframe 
      src={url} 
      className="w-full h-full border-none bg-gray-900"
      title="VibeScope App View"
   />
</div>
4. Checklist para o Agente IA (Prompt Sugerido)
Se você for jogar isso para o agente corrigir automaticamente, use este comando:

"Baseado na especificação de Safe Areas mobile, revise os arquivos Layout.jsx (ou o wrapper principal das páginas) e ajuste os paddings globais para pt-14, pb-10 e px-5. Adicione CSS global para esconder a scrollbar nativa (.hide-scrollbar). No Presentation.jsx, certifique-se de que o iframe ocupa 100% do espaço com border-none e que o Mockup possui bordas arredondadas e um notch simulado. Corrija o flexbox interno das páginas para que os cards ocupem o espaço sem deixar 'buracos'."

Com essa Spec, o seu app não vai apenas funcionar na tela do computador, ele vai parecer um aplicativo de US$ 10.000 rodando na mão do usuário! Podemos aplicar o CSS da Scrollbar e os paddings no Layout primeiro?