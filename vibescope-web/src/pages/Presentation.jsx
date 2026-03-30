import React, { useEffect, useMemo, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Database, Layers, MessageSquare, Play, Plus, Server, Smartphone, Sparkles, Timer } from 'lucide-react';
import DeviceMockup from '../components/DeviceMockup';

const electricBlue = '#2563EB';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(mq.matches);
        update();

        // Safari older support
        if (mq.addEventListener) mq.addEventListener('change', update);
        else mq.addListener(update);

        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', update);
            else mq.removeListener(update);
        };
    }, []);

    return isMobile;
}

function scrollToEl(el) {
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const Glass = ({ children, className = '' }) => (
    <div
        className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-[0_0_60px_-30px_rgba(37,99,235,0.35)] ${className}`}
    >
        {children}
    </div>
);

export default function Presentation() {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const isMobile = useIsMobile();

    const problemRef = useRef(null);
    const demoRef = useRef(null);

    const creativeUrl = useMemo(() => `${baseUrl}/editor/novo`, [baseUrl]);
    const productionUrl = useMemo(() => `${baseUrl}/editor`, [baseUrl]);
    const clientUrl = useMemo(() => `${baseUrl}/projeto/demo-token`, [baseUrl]);

    const phones = useMemo(
        () => [
            {
                title: 'Criativo',
                subtitle: 'Brain Dump + Referências',
                url: creativeUrl,
                accent: 'from-blue-600/30 to-blue-900/20',
                mobileHref: creativeUrl,
            },
            {
                title: 'Produção',
                subtitle: 'Tarefas técnicas por rodada',
                url: productionUrl,
                accent: 'from-indigo-600/30 to-indigo-900/20',
                mobileHref: productionUrl,
            },
            {
                title: 'Cliente',
                subtitle: 'Review + Brain Dump frictionless',
                url: clientUrl,
                accent: 'from-sky-600/30 to-sky-900/20',
                mobileHref: clientUrl,
            },
        ],
        [creativeUrl, productionUrl, clientUrl],
    );

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-80">
                <div className="absolute -top-[12%] left-[50%] -translate-x-1/2 w-[560px] h-[560px] bg-blue-900/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[18%] w-[420px] h-[420px] bg-blue-900/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-18%] left-[-18%] w-[380px] h-[380px] bg-blue-900/10 blur-[140px] rounded-full" />
            </div>

            {/* HERO */}
            <section className="h-screen flex items-center justify-center px-6 relative">
                <div className="max-w-5xl w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[12px] tracking-widest uppercase"
                            style={{ boxShadow: `0 0 0 1px rgba(37,99,235,0.15), 0 0 50px rgba(37,99,235,0.15)` }}
                        >
                            <Sparkles size={16} />
                            Human Academy Hackathon Pitch Deck
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6 text-[56px] sm:text-[72px] leading-none font-black tracking-tight"
                    >
                        VibeScope<span style={{ color: electricBlue }}>.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.08 }}
                        className="mt-6 mx-auto max-w-2xl text-[18px] sm:text-[22px] text-gray-300 leading-relaxed"
                    >
                        Transformando vídeo em dados acionáveis com IA.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.12 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => scrollToEl(problemRef.current)}
                            className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-blue-600 border border-blue-400/20 shadow-[0_0_60px_-20px_rgba(37,99,235,0.65)] active:scale-[0.99] transition-transform animate-pulse"
                        >
                            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-20 blur-sm group-hover:opacity-30 transition-opacity" />
                            <span className="relative font-black tracking-wide text-[14px] uppercase">
                                Explorar a Plataforma
                            </span>
                            <ArrowRight size={18} className="relative" />
                        </button>

                        <div className="text-sm text-gray-400">
                            Demo interativa e integração ponta-a-ponta (Criativo → Cliente → Produção)
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PROBLEM */}
            <section ref={problemRef} className="py-24 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[12px] tracking-widest uppercase text-blue-300">
                            <MessageSquare size={16} />
                            O Problema
                        </div>
                        <h2 className="mt-6 text-[40px] sm:text-[52px] font-black tracking-tight leading-[1.05]">
                            O Caos da Pós-Produção.
                        </h2>
                        <p className="mt-4 max-w-2xl text-gray-300 text-[16px] leading-relaxed">
                            A comunicação entre Criativo, Editor e Cliente é cheia de ruídos: briefings subjetivos, timecodes perdidos,
                            contexto fragmentado e refações que estouram o escopo.
                        </p>
                    </motion.div>

                    <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.7, delay: 0.04 }}
                            className="space-y-6"
                        >
                            <Glass className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
                                        <Timer size={18} className="text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-mono uppercase tracking-widest text-blue-300">
                                            Ruído de tempo
                                        </p>
                                        <p className="mt-2 text-gray-300 leading-relaxed">
                                            “No minuto 2 fica melhor” — mas ninguém sabe onde exatamente. Resultado: retrabalho.
                                        </p>
                                    </div>
                                </div>
                            </Glass>

                            <Glass className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
                                        <Layers size={18} className="text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-mono uppercase tracking-widest text-blue-300">
                                            Scope creep silencioso
                                        </p>
                                        <p className="mt-2 text-gray-300 leading-relaxed">
                                            Feedback vira lista de pedidos infinitos. A cada rodada, a entrega se desloca e o custo cresce.
                                        </p>
                                    </div>
                                </div>
                            </Glass>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Briefing subjetivo</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Contexto disperso</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Timecodes perdidos</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.7, delay: 0.08 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Glass className="p-5 sm:col-span-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Plus size={18} className="text-blue-300" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-mono uppercase tracking-widest text-gray-500">
                                                    final_v3.mp4
                                                </p>
                                                <p className="mt-1 text-sm font-black tracking-tight">
                                                    “Ficou legal, mas…” (sem timecode)
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono px-3 py-1 rounded-full border border-white/10 bg-white/5 text-blue-300">
                                            REFAÇÃO 2/3
                                        </span>
                                    </div>
                                    <div className="mt-5 flex flex-col gap-3">
                                        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-gray-300 text-sm">
                                            <span className="text-blue-300 font-mono">Cliente:</span> “A cor tá apagada no finalzinho”
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-gray-300 text-sm">
                                            <span className="text-blue-300 font-mono">Editor:</span> “Qual final? 00:45 ou 01:12?”
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-gray-300 text-sm">
                                            <span className="text-blue-300 font-mono">Projeto:</span> backlog crescendo automaticamente…
                                        </div>
                                    </div>
                                </Glass>

                                <Glass className="p-5">
                                    <div className="flex items-center gap-3">
                                        <Database size={18} className="text-blue-300" />
                                        <div className="flex-1">
                                            <p className="text-xs font-mono uppercase tracking-widest text-gray-500">
                                                briefing_final_v2.docx
                                            </p>
                                            <p className="mt-1 text-sm text-gray-300">
                                                “Tom mais próximo do passado” — ambíguo.
                                            </p>
                                        </div>
                                    </div>
                                </Glass>

                                <Glass className="p-5">
                                    <div className="flex items-center gap-3">
                                        <Play size={18} className="text-blue-300" />
                                        <div className="flex-1">
                                            <p className="text-xs font-mono uppercase tracking-widest text-gray-500">
                                                timecode_missing
                                            </p>
                                            <p className="mt-1 text-sm text-gray-300">
                                                IA tenta inferir… mas custa tempo.
                                            </p>
                                        </div>
                                    </div>
                                </Glass>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SOLUTION */}
            <section className="py-24 bg-[#121212] relative">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[12px] tracking-widest uppercase text-blue-300">
                            <Sparkles size={16} />
                            A Solução
                        </div>
                        <h2 className="mt-6 text-[40px] sm:text-[52px] font-black tracking-tight leading-[1.05]">
                            O VibeScope: Inteligência como Ponte.
                        </h2>
                        <p className="mt-4 max-w-2xl text-gray-300 text-[16px] leading-relaxed">
                            Uma camada que transforma feedback bruto em tarefas técnicas acionáveis com timecode, esforço e status — reduzindo ruídos e protegendo o escopo.
                        </p>
                    </motion.div>

                    <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {[
                            { icon: MessageSquare, title: 'Brain Dump', text: 'O cliente joga a ideia bruta (texto + referências) e envia com atrito mínimo.' },
                            { icon: Sparkles, title: 'Tradução IA', text: 'O Gemini interpreta e devolve tarefas estritas: timecode + descrição + esforço + status.' },
                            { icon: Layers, title: 'Ação', text: 'O editor recebe a fila pronta para produção, reduzindo teclado, retrabalho e incerteza.' },
                        ].map((c, idx) => (
                            <motion.div
                                key={c.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7, delay: idx * 0.06 }}
                            >
                                <Glass className="p-6 h-full">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
                                        <c.icon size={20} className="text-blue-300" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-black tracking-tight">{c.title}</h3>
                                    <p className="mt-3 text-gray-300 leading-relaxed">{c.text}</p>
                                    <div className="mt-6 flex items-center gap-2 text-sm text-blue-300 font-mono uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                                        {idx === 0 ? 'Capture' : idx === 1 ? 'Interpret' : 'Execute'}
                                    </div>
                                </Glass>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DEMO */}
            <section ref={demoRef} className="py-24 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-[40px] sm:text-[52px] font-black tracking-tight leading-[1.05]">
                            Experimente o Fluxo (Interaja com as telas)
                        </h2>
                        <p className="mt-4 max-w-2xl text-gray-300 text-[16px] leading-relaxed">
                            Faça o “walkthrough” entre as áreas: crie um projeto, envie feedback e veja as tarefas aparecerem para a produção.
                        </p>
                    </motion.div>

                    <div className="mt-10 h-[100vh] rounded-[2rem] overflow-hidden border border-white/10 bg-black/30">
                        <div className="h-full overflow-y-auto snap-y snap-mandatory">
                            {phones.map((phone, idx) => (
                                <div key={phone.title} className="h-[100vh] snap-start flex items-center justify-center p-6 bg-gradient-to-br from-white/0 to-white/0">
                                    <div className="max-w-5xl w-full flex flex-col items-center">
                                        <motion.div
                                            initial={{ opacity: 0, y: 18 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.7, delay: idx * 0.05 }}
                                            className="w-full flex items-start justify-between gap-6 mb-6"
                                        >
                                            <div className="space-y-2">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[12px] tracking-widest uppercase text-blue-300">
                                                    <Smartphone size={16} />
                                                    {phone.title}
                                                </div>
                                                <div className="text-gray-300 text-sm">{phone.subtitle}</div>
                                            </div>
                                            <a
                                                href={phone.mobileHref}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.15em] text-[11px] hover:bg-white/10 transition-colors"
                                            >
                                                <ExternalLinkLike />
                                                Abrir em aba
                                            </a>
                                        </motion.div>

                                        <div className="flex items-center justify-center gap-10 w-full">
                                            {/* Desktop: iframes. Mobile: links only (requested). */}
                                            {isMobile ? (
                                                <div className="w-full flex flex-col items-center gap-4">
                                                    <Glass className="p-5 w-full max-w-md">
                                                        <h3 className="text-xl font-black tracking-tight">{phone.title}</h3>
                                                        <p className="mt-2 text-gray-300 leading-relaxed text-sm">
                                                            No mobile, o mock interativo fica apenas via link direto.
                                                        </p>
                                                        <a
                                                            href={phone.mobileHref}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-5 inline-flex w-full items-center justify-center gap-2 h-12 bg-blue-600 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px]"
                                                        >
                                                            Explorar agora <ArrowRight size={16} />
                                                        </a>
                                                    </Glass>
                                                </div>
                                            ) : (
                                                <DeviceMockup url={phone.url} />
                                            )}
                                        </div>

                                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-[12px]">
                                            <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
                                            Role para continuar
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TECH */}
            <section className="py-24 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[12px] tracking-widest uppercase text-blue-300">
                            <Code2 size={16} />
                            Stack
                        </div>
                        <h2 className="mt-6 text-[40px] sm:text-[52px] font-black tracking-tight leading-[1.05]">
                            Por Baixo do Capô.
                        </h2>
                    </motion.div>

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                icon: Server,
                                title: 'Backend & IA',
                                text: 'Spring Boot + Google Gemini. Motor de tradução de dados JSON para tarefas técnicas.',
                            },
                            {
                                icon: Layers,
                                title: 'Frontend',
                                text: 'React + Tailwind CSS com fluxo responsivo e UI “High-End Tech”.',
                            },
                            {
                                icon: Smartphone,
                                title: 'Mobile-First Real',
                                text: 'Arquitetura pronta para build nativo via Ionic + Capacitor (PWA→App).',
                            },
                        ].map((p, idx) => {
                            const Icon = p.icon;
                            return (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.7, delay: idx * 0.06 }}
                                >
                                    <Glass className="p-6 h-full">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
                                            <Icon size={20} className="text-blue-300" />
                                        </div>
                                        <h3 className="mt-6 text-xl font-black tracking-tight">{p.title}</h3>
                                        <p className="mt-3 text-gray-300 leading-relaxed">{p.text}</p>
                                        <div className="mt-6 flex items-center gap-2 text-sm text-blue-300 font-mono uppercase tracking-widest">
                                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                                            Ready for production
                                        </div>
                                    </Glass>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <footer className="py-14 border-t border-white/10 bg-[#0B0B0B]">
                <div className="max-w-6xl mx-auto px-6 text-center text-gray-400 font-mono text-[13px]">
                    Desenvolvido para Human Academy AI Hackathon
                </div>
            </footer>
        </div>
    );
}

function ExternalLinkLike() {
    // Evita adicionar mais imports no topo; mantém o visual de “seta para fora”.
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
                d="M14 3H21V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 14L21 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21 14V21H3V3H10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
