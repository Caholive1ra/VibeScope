import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { PlusCircle, Link as LinkIcon, Edit3, ArrowLeft, Sparkles, Send } from 'lucide-react';
import { projetosApi } from '../api/projetosApi';

export default function CreateProject() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [clienteNome, setClienteNome] = useState("");
    const [nomeProjeto, setNomeProjeto] = useState("");
    const [briefingUrl, setBriefingUrl] = useState("");
    const [briefingBruto, setBriefingBruto] = useState("");
    const [createdMagicToken, setCreatedMagicToken] = useState(null);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setCreatedMagicToken(null);

        try {
            const payload = {
                clienteNome: clienteNome,
                nomeProjeto: nomeProjeto,
                videoUrl: "https://vimeo.com/placeholder",
                briefingBruto: briefingBruto,
                briefingUrl: briefingUrl,
                limiteRefacoes: 3
            };

            const created = await projetosApi.createProjeto(payload);
            setCreatedMagicToken(created?.magicToken ?? null);
        } catch (error) {
            console.error("Erro ao criar projeto:", error);
        } finally {
            setLoading(false);
        }
    };

    const clientLink =
        createdMagicToken && typeof window !== 'undefined'
            ? `${window.location.origin}/projeto/${createdMagicToken}`
            : null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans pt-6 pb-10 px-5 overflow-hidden relative">

            {/* Container de Formulário com Arraste */}
            <motion.main
                className="flex-1 overflow-y-auto hide-scrollbar pb-20"
                style={{ touchAction: 'pan-y' }}
            >
                {/* Header Dinâmico - Agora dentro do Scroll */}
                <header className="mb-6">
                    <button
                        onClick={() => navigate('/editor')}
                        className="flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest mb-4 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={16} /> Voltar ao Painel
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <PlusCircle size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter">Novo Projeto</h1>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">IA Engine Ativa ✨</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-6">
                    <div className="space-y-6">
                        {/* Campos de Identificação */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Título da Produção</label>
                                <input
                                    type="text"
                                    value={nomeProjeto}
                                    onChange={(e) => setNomeProjeto(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/5 rounded-[1.5rem] p-5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                                    placeholder="Ex: Campanha de Inverno v1"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Cliente / Solicitante</label>
                                <input
                                    type="text"
                                    value={clienteNome}
                                    onChange={(e) => setClienteNome(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/5 rounded-[1.5rem] p-5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                                    placeholder="Nome da Empresa"
                                    required
                                />
                            </div>
                        </div>

                        {/* Briefing Externo */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Documento de Briefing (Opcional)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-5 flex items-center text-gray-600 pointer-events-none">
                                    <LinkIcon size={16} />
                                </span>
                                <input
                                    type="url"
                                    value={briefingUrl}
                                    onChange={(e) => setBriefingUrl(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/5 rounded-[1.5rem] pl-14 p-5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                                    placeholder="Link do Notion, GDocs, Canva..."
                                />
                            </div>
                        </div>

                        {/* Brain Dump IA */}
                        <div className="space-y-2 px-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Brain Dump do Projeto</label>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/10 rounded-full border border-blue-600/20">
                                    <Sparkles size={10} className="text-blue-500" />
                                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">IA Auto-Análise</span>
                                </div>
                            </div>
                            <textarea
                                value={briefingBruto}
                                onChange={(e) => setBriefingBruto(e.target.value)}
                                className="w-full h-48 bg-[#111111] border border-white/5 rounded-[2rem] p-6 text-sm text-gray-300 resize-none focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/5 leading-relaxed"
                                placeholder="Descreva aqui o vídeo de forma bruta. A IA vai extrair as instruções técnicas de edição para você..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            </motion.main>

            {/* Ação Fixa Flutuante */}
            <div className="absolute bottom-8 left-5 right-5 z-30">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !nomeProjeto || !clienteNome}
                    className="w-full h-16 bg-blue-600 disabled:bg-white/5 disabled:text-gray-700 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-950/60 active:scale-95 transition-all flex items-center justify-center gap-3 border-t border-white/10"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>Injetar no Motor <Send size={16} /></>
                    )}
                </button>
            </div>

            {clientLink && (
                <div className="absolute top-14 left-5 right-5 z-20">
                    <div className="bg-[#0F0F0F] border border-white/10 rounded-[2rem] p-4 shadow-2xl shadow-blue-950/30">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    Projeto criado
                                </p>
                                <p className="text-sm font-black">
                                    Link do cliente pronto
                                </p>
                                <p className="text-[11px] font-mono text-blue-400 break-all">
                                    {clientLink}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button
                                    type="button"
                                    className="h-10 px-4 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-[0.15em] text-[10px] active:scale-95 transition-all"
                                    onClick={() => window.open(clientLink, '_blank')}
                                >
                                    Abrir
                                </button>
                                <button
                                    type="button"
                                    className="h-10 px-4 bg-white/5 rounded-2xl text-white font-black uppercase tracking-[0.15em] text-[10px] border border-white/10 active:scale-95 transition-all"
                                    onClick={() => navigator.clipboard?.writeText?.(clientLink)}
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-end">
                            <button
                                type="button"
                                className="h-11 px-4 bg-white/5 rounded-2xl text-white font-black uppercase tracking-[0.15em] text-[10px] border border-white/10 active:scale-95 transition-all"
                                onClick={() => navigate('/editor')}
                            >
                                Ir para Produção
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
