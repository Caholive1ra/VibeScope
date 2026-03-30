import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import DeviceMockup from '../components/DeviceMockup';

const Section = ({ children, bg = "bg-[#0D0D0D]", id }) => (
    <section id={id} className={`h-screen w-full snap-start flex flex-col items-center justify-center p-8 overflow-hidden relative ${bg}`}>
        {children}
    </section>
);

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const mockupVariants = {
    hidden: { opacity: 0, y: 120, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
};

// Componente para gerenciar o estado do Iframe por Seção
const SectionContent = ({ step, title, subtitle, description, url }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { amount: 0.5 });
    const [iframeUrl, setIframeUrl] = useState(url);

    // Recarregar o iframe ao entrar na seção para garantir dados frescos
    useEffect(() => {
        if (isInView) {
            setIframeUrl(`${url}?refresh=${Date.now()}`);
        }
    }, [isInView, url]);

    return (
        <div ref={ref} className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 max-w-7xl w-full z-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
                variants={fadeInUp}
                className="flex-1 space-y-6 text-center lg:text-left order-2 lg:order-none"
            >
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-blue-500 font-mono text-sm mb-4">
                    {step}
                </div>
                <h3 className="text-5xl lg:text-8xl font-black tracking-tight leading-[0.9] text-white">
                    {title} <span className="text-blue-500 opacity-80">{subtitle}</span>
                </h3>
                <p className="text-gray-400 text-xl lg:text-2xl max-w-lg leading-relaxed font-light">
                    {description}
                </p>

                {/* Indicador de Interatividade */}
                <div className="pt-8 flex items-center justify-center lg:justify-start gap-4 text-gray-500 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-xs font-mono uppercase tracking-widest">Demonstração Interativa ao vivo</span>
                </div>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
                variants={mockupVariants}
                className="flex-shrink-0"
            >
                <DeviceMockup url={iframeUrl} />
            </motion.div>
        </div>
    );
};

export default function Presentation() {
    // Pegamos a base URL para garantir que o iframe aponte para o próprio servidor de dev
    const baseUrl = window.location.origin;

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth bg-black">

            {/* Background Ambience (Subtle Gradients) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[150px] rounded-full"></div>
            </div>

            {/* Section 01: Creative */}
            <Section id="creative">
                <SectionContent
                    step="01. A Semente"
                    title="O briefing"
                    subtitle="estratégico."
                    description="Onde o caos se torna estrutura. O criativo faz o brain dump e a IA gera o roteiro técnico."
                    url={`${baseUrl}/editor/novo`}
                />
            </Section>

            {/* Section 02: Editor */}
            <Section bg="bg-[#0A0A0A]" id="editor">
                <SectionContent
                    step="02. O Motor"
                    title="Produção"
                    subtitle="acelerada."
                    description="A lista de tarefas técnicas pronta para o Adobe Premiere. Menos tempo teclando, mais tempo criando."
                    url={`${baseUrl}/editor`}
                />
            </Section>

            {/* Section 03: Client */}
            <Section id="client">
                <SectionContent
                    step="03. O Veredito"
                    title="Feedback"
                    subtitle="transparente."
                    description="O cliente aprova com contexto real. Nossa IA protege o escopo e organiza as rodadas de refação."
                    url={`${baseUrl}/cliente/dashboard`}
                />
            </Section>

            {/* Global Scroll Indicator */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-800 to-transparent"></div>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">Scroll para explorar</span>
            </div>

        </div>
    );
}
