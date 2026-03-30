import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sparkles, Zap, Rocket, Cpu, Smartphone } from 'lucide-react';

// Componente DeviceMockup Interativo solicitado pelo Arquiteto
const DeviceMockup = ({ url, title, description, animationProps }) => (
  <motion.div {...animationProps} className="flex flex-col items-center gap-4 md:gap-6">
    {/* Moldura do Telefone (Padrão Safe Area) */}
    <div className="w-[260px] h-[520px] md:w-[320px] md:h-[650px] border-[8px] md:border-[12px] border-gray-900 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden relative shadow-2xl bg-[#0D0D0D] shrink-0 ring-1 ring-gray-700">
      {/* Notch/Câmera Simulado */}
      <div className="absolute top-0 inset-x-0 h-4 md:h-6 bg-gray-900 rounded-b-xl md:rounded-b-2xl w-1/2 mx-auto z-50 pointer-events-none"></div>

      {/* Iframe Real rodando o App ou Placeholder */}
      <div className="h-full w-full overflow-hidden rounded-b-[2rem] md:rounded-b-[2.5rem]">
        {url ? (
          <iframe
            src={url}
            className="border-none bg-[#0D0D0D] hide-scrollbar touch-pan-y"
            title={title}
            scrolling="yes"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              // No mobile, escalamos o conteúdo para 80% para caber melhor no frame reduzido
              width: window.innerWidth < 768 ? '125%' : 'calc(100% + 20px)',
              height: window.innerWidth < 768 ? '125%' : '100%',
              transform: window.innerWidth < 768 ? 'scale(0.8)' : 'none',
              transformOrigin: 'top left',
            }}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-black">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600/20 text-blue-500 mb-4 flex items-center justify-center border border-blue-500/30">
              <Smartphone className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="text-xs md:text-sm text-blue-500 font-bold uppercase tracking-widest">Aguardando Magic Link</p>
            <p className="text-[9px] md:text-[10px] text-gray-500 mt-3 font-medium uppercase tracking-widest leading-relaxed">Coloque o link ao lado para carregar o Veredito do Projeto</p>
          </div>
        )}
      </div>
    </div>
    <div className="text-center max-w-[260px] md:max-w-sm mt-0 md:mt-2">
      <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-2 text-xs md:text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const SECTIONS = [
  { id: 'hero', label: 'Início' },
  { id: 'semente', label: '01. A Semente' },
  { id: 'motor', label: '02. O Motor' },
  { id: 'veredito', label: '03. O Veredito' },
  { id: 'stack', label: 'Stack' }
];

export default function Presentation() {
  const [activeSection, setActiveSection] = useState(0);
  const [projectLinkInput, setProjectLinkInput] = useState('');
  const [clientMockupUrl, setClientMockupUrl] = useState('');

  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);
    setActiveSection(index);
  };

  const scrollToSection = (index) => {
    const container = document.getElementById('snap-container');
    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    });
  };

  const extractMagicToken = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw) return null;

    // Permite colar a URL completa ou somente o token
    if (!raw.includes('http') && !raw.includes('/')) {
      return raw;
    }

    const withoutQuery = raw.split('?')[0].split('#')[0];
    const marker = '/projeto/';
    const idx = withoutQuery.lastIndexOf(marker);
    if (idx === -1) return null;

    const token = withoutQuery.slice(idx + marker.length).trim();
    return token || null;
  };

  const handleProjectLinkChange = (e) => {
    const value = e.target.value;
    setProjectLinkInput(value);

    const token = extractMagicToken(value);
    if (token) {
      setClientMockupUrl(window.location.origin + `/projeto/${token}`);
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#0D0D0D] text-white overflow-hidden selection:bg-blue-600/30">

      {/* Menu Lateral (Dots) - OCULTO NO MOBILE */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 pointer-events-auto">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(i)}
            className="group flex items-center justify-end gap-3"
          >
            <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeSection === i ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              {s.label}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeSection === i ? 'bg-blue-600 scale-150 shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-white/20 group-hover:bg-white/40'}`}></div>
          </button>
        ))}
      </nav>

      {/* Container Principal Snap-Scroll */}
      <div
        id="snap-container"
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto snap-y-mandatory no-scrollbar"
      >

        {/* 1. SEÇÃO HERO */}
        <section className="min-h-screen md:h-screen w-full snap-start flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden">
          <div className="max-w-6xl w-full space-y-8 md:space-y-12 z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3 md:space-y-4"
            >
              <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">VibeScope Pitch Deck</span>
              <h1 className="text-3xl md:text-8xl font-black italic tracking-tighter leading-none">
                O Fim do Caos na <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Pós-Produção.</span>
              </h1>
              <p className="text-gray-500 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                A ponte inteligente que conecta criatividade, produção e aprovação, transformando briefings em ação com IA Generativa.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-8 w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-[#111111] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-4 text-left group hover:bg-[#151515] transition-all"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
                  <Zap size={20} md:size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-black tracking-tight">O Problema</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  Briefings subjetivos, feedbacks perdidos e alterações sem fim que corroem o orçamento.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-[#111111] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-blue-500/20 space-y-4 text-left group hover:bg-[#151515] transition-all shadow-2xl shadow-blue-900/10"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/20 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <Sparkles size={20} md:size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-black tracking-tight">A Solução</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  Nossa IA traduz intenção em tarefas precisas, garantindo fluidez e controle.
                </p>
              </motion.div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-blue-600/5 blur-[80px] md:blur-[120px] rounded-full -z-10"></div>
        </section>

        {/* 2. SEÇÃO: A SEMENTE */}
        <section className="min-h-screen md:h-screen w-full snap-start flex items-center justify-center p-6 md:p-8">
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <DeviceMockup
              url={window.location.origin + "/editor?role=creative"}
              title="01. A Semente"
              description="Deixe a criatividade fluir. O Criativo faz o 'Brain Dump' de suas ideias e referências. A IA ouve e se prepara para agir."
              animationProps={{
                initial: { opacity: 0, y: 100 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 1 }
              }}
            />
          </div>
        </section>

        {/* 3. SEÇÃO: O MOTOR */}
        <section className="min-h-screen md:h-screen w-full snap-start flex items-center justify-center p-6 md:p-8 bg-[#0B0B0B]">
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <DeviceMockup
              url={window.location.origin + "/editor?role=editor"}
              title="02. O Motor"
              description="Produção Turbinada. O Editor entra em cena com um painel de tarefas técnicas gerado instantaneamente pela IA. Timecodes exatos e cortes precisos."
              animationProps={{
                initial: { opacity: 0, y: 100 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 1 }
              }}
            />
          </div>
        </section>

        {/* 4. SEÇÃO: O VEREDITO */}
        <section className="min-h-screen md:h-screen w-full snap-start flex flex-col items-center justify-center p-6 md:p-8">
          <div className="max-w-6xl w-full relative flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16">
            <DeviceMockup
              url={clientMockupUrl}
              title="03. O Veredito"
              description="Aprovação Sem Fricção. O Cliente recebe um 'Magic Link'. Assiste, revisa e envia seu feedback por áudio ou texto. É transparente, é rápido."
              animationProps={{
                initial: { opacity: 0, y: 100 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 1 }
              }}
            />

            {/* Input de link - Visível no Mobile também, mas posicionado estrategicamente */}
            <div className="w-full max-w-[340px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
              <div className="bg-[#111111]/80 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 backdrop-blur-md">
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2 md:mb-3">
                  Cole o link do cliente aqui
                </p>
                <input
                  type="text"
                  value={projectLinkInput}
                  onChange={handleProjectLinkChange}
                  placeholder="link do projeto"
                  className="w-full h-11 md:h-12 bg-black/70 border border-white/10 rounded-xl md:rounded-2xl px-4 text-xs md:text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. SEÇÃO: STACK */}
        <section className="min-h-screen md:h-screen w-full snap-start flex flex-col items-center justify-center p-6 md:p-8 bg-[#090909]">
          <div className="max-w-6xl w-full space-y-8 md:space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center space-y-2 md:space-y-4"
            >
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter italic">Por Baixo do Capô</h2>
              <p className="text-gray-500 text-sm md:font-medium">Tecnologia de ponta orquestrando a criatividade.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 overflow-y-auto md:overflow-visible pb-10 md:pb-0">
              {[
                { title: 'Backend & IA', text: 'Nossa IA Gemini não é apenas um chatbot; é um motor de processamento JSON que otimiza todo o workflow.', icon: <Cpu className="text-blue-500" /> },
                { title: 'Frontend', text: 'UI moderna, escalável e focada na experiência do usuário. Componentes modulares de classe mundial.', icon: <Zap className="text-orange-500" /> },
                { title: 'Nativo', text: 'Código web com arquitetura mobile-first, preparado para ser empacotado e gerar builds nativos.', icon: <Smartphone className="text-green-500" /> }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#111111]/50 border border-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-black tracking-tight">{item.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-12 px-8 flex flex-col items-center gap-6 opacity-30 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">
          <div className="flex gap-4 md:gap-8">
            <span>Human Academy 2025</span>
            <span>•</span>
            <span>VibeScope Hackathon</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

