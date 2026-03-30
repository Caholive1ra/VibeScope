import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { PlayCircle, Bell, MessageSquare, CheckCircle2, History } from 'lucide-react';

export default function ClientDashboard() {
    const navigate = useNavigate();

    const historicoVersoes = [
        { id: 'v3', tipo: 'entrega', versao: 'v3.0 Final', titulo: 'Ajuste de Cor e Trilha', autor: 'VibeScope IA', status: 'Aguardando Feedback', data: 'Hoje, 14:30' },
        { id: 'v2-resp', tipo: 'resposta', versao: 'Ajuste v2', titulo: 'Correção: Trilha sincronizada', autor: 'Produção', status: 'Visualizado', data: 'Ontem, 19:15' },
        { id: 'v2', tipo: 'entrega', versao: 'v2.0', titulo: 'Primeiro Corte com Efeitos', autor: 'VibeScope IA', status: 'Feedback Recebido', data: '27 Mar' },
        { id: 'v1', tipo: 'entrega', versao: 'v1.0 (Start)', titulo: 'Escopo Inicial', autor: 'VibeScope IA', status: 'Concluído', data: '25 Mar' }
    ];

    return (
        <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden select-none touch-none">

            {/* Header Fixo - Não Arrasta */}
            <header className="flex justify-between items-center px-6 pt-12 mb-6 shrink-0 z-20 bg-black/50 backdrop-blur-md">
                <div>
                    <h2 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Painel do Cliente</h2>
                    <h1 className="text-xl font-black italic tracking-tighter">VibeScope</h1>
                </div>
                <div className="relative p-2 bg-white/5 rounded-full shrink-0">
                    <Bell className="text-gray-400" size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-black"></span>
                </div>
            </header>

            {/* Viewport de Arraste */}
            <motion.div
                drag="y"
                dragConstraints={{ top: -400, bottom: 0 }}
                dragElastic={0.1}
                className="flex-1 px-6 flex flex-col cursor-grab active:cursor-grabbing"
            >
                {/* Banner de Destaque */}
                <div
                    onClick={() => navigate(`/projeto/v3`)}
                    className="mb-8 relative overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-blue-600 to-blue-900 shadow-xl shadow-blue-900/30 group active:scale-[0.98] transition-all shrink-0 border border-white/10"
                >
                    <div className="relative z-10 space-y-2.5">
                        <div className="flex items-center gap-2">
                            <span className="bg-white text-blue-800 text-[7px] font-black uppercase py-0.5 px-2.5 rounded-full">Review</span>
                            <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">v3.0 • Vídeo Manifesto</span>
                        </div>
                        <h3 className="text-lg font-black leading-tight max-w-[180px]">Pronto para sua revisão final.</h3>
                    </div>
                    <PlayCircle size={44} className="absolute bottom-6 right-6 text-white opacity-40 group-hover:opacity-100 transition-all group-hover:scale-110" />
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                    <div className="flex items-center gap-2 text-gray-500">
                        <History size={12} />
                        <h4 className="text-[9px] font-black uppercase tracking-widest">Atividade do Projeto</h4>
                    </div>
                </div>

                <div className="space-y-4 relative pb-40">
                    {/* Linha da Timeline */}
                    <div className="absolute left-6 top-0 bottom-40 w-[1px] bg-gradient-to-b from-blue-500/30 via-gray-800 to-transparent"></div>

                    {historicoVersoes.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/projeto/${item.id}`)}
                            className="relative pl-12 group transition-transform"
                        >
                            <div className={`absolute left-4.5 translate-x-1 top-2.5 w-2.5 h-2.5 rounded-full border-2 border-black z-10 ${item.tipo === 'entrega' ? 'bg-blue-500' : 'bg-green-500'
                                }`} />

                            <div className="bg-[#0F0F0F] p-4 rounded-3xl border border-white/5 active:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">{item.versao}</span>
                                    <span className="text-[8px] font-bold text-gray-700">{item.data}</span>
                                </div>
                                <h5 className="font-bold text-xs leading-tight text-gray-200 mb-3">{item.titulo}</h5>

                                <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                                    <div className="flex items-center gap-1.5 text-[8px] text-gray-600 font-bold uppercase tracking-tighter">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center text-[5px]">AI</div>
                                        {item.autor}
                                    </div>
                                    <div className={`flex items-center gap-1 text-[8px] font-black uppercase ${item.status === 'Aguardando Feedback' ? 'text-blue-500' : 'text-gray-600'
                                        }`}>
                                        {item.status.split(' ')[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Fim da linha */}
                    <div className="pl-14 pt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Criação do Projeto</span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
