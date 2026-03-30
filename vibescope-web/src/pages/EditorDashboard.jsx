import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Link as LinkIcon, ExternalLink, Activity, Sparkles, ChevronDown, ChevronUp, MoreHorizontal, Copy, Layers, Send } from 'lucide-react';
import axios from 'axios';

export default function EditorDashboard() {
    const navigate = useNavigate();
    const [expandedRow, setExpandedRow] = useState(null);
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjetos = async () => {
            try {
                // Timeout de 1s para o demo não "engasgar" se o backend estiver lento
                const response = await axios.get("http://localhost:8080/api/v1/projetos", { timeout: 1000 });
                if (Array.isArray(response.data)) {
                    setProjetos(response.data);
                } else {
                    throw new Error("Formato inválido");
                }
            } catch (error) {
                console.warn("Usando dados de demonstração (Backend offline ou lento)");
                setProjetos([
                    {
                        id: 1,
                        nomeProjeto: "Vídeo Manifesto",
                        clienteNome: "TechX",
                        status: "Em Edição",
                        magicToken: "techx-123",
                        resumoIa: "Focar em transições suaves e cores futuristas.",
                        rodadas: [1],
                        limiteRefacoes: 3,
                        briefing: "Campanha institucional de 60s. Tom inspirador, focado em tecnologia humana e simplicidade.",
                        feedbacks: [
                            { id: 1, autor: "Estrategista IA", texto: "A trilha sonora atual está muito lenta. Sugiro algo com 128 BPM para o clímax.", data: "Hoje, 10:30" },
                            { id: 2, autor: "Cliente", texto: "Podemos trocar o take do escritório por algo mais aberto/natureza?", data: "Hoje, 11:45" }
                        ]
                    },
                    {
                        id: 2,
                        nomeProjeto: "Campanha Verão",
                        clienteNome: "FashionHub",
                        status: "Aguardando Feedback",
                        magicToken: "fh-456",
                        resumoIa: "Cores vibrantes e cortes rápidos.",
                        rodadas: [1, 2],
                        limiteRefacoes: 5,
                        briefing: "Coleção Alto Verão. Energia, movimento e luz natural. Foco nas texturas dos tecidos.",
                        feedbacks: [
                            { id: 1, autor: "Cliente", texto: "Aprovado o estilo, mas a cor do logo está errada no final.", data: "Ontem" }
                        ]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjetos();
    }, []);

    const [entrega, setEntrega] = useState({ link: '', notas: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleCopyLink = (e, token) => {
        e.stopPropagation();
        const url = `${window.location.origin}/projeto/${token}`;
        navigator.clipboard.writeText(url);
        alert('Link Mágico copiado!');
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
        setEntrega({ link: '', notas: '' }); // Reset ao trocar
    };

    const handleSubmitVersion = (e) => {
        e.stopPropagation();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            alert("Nova versão enviada com sucesso! O cliente será notificado.");
            setExpandedRow(null);
        }, 1500);
    };

    return (
        <div className="h-full bg-black text-white flex flex-col font-sans overflow-hidden relative select-none touch-none">

            {/* Container de Arraste (No Scroll) */}
            <motion.main
                drag="y"
                dragConstraints={{ top: -900, bottom: 0 }}
                dragElastic={0.1}
                className="flex-1 cursor-grab active:cursor-grabbing pb-40"
            >
                {/* Header Dinâmico (Notch) - Agora dentro do Scroll */}
                <header className="p-4 pt-12 pb-6 mb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
                                VibeScope <span className="text-[10px] not-italic font-black bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Motor</span>
                            </h1>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Gestão de Produção 🎬</p>
                        </div>
                    </div>

                    {/* Stats Rápidos */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Na Fila</span>
                            <p className="text-[14px] font-black leading-none">{projetos.length}</p>
                        </div>
                        <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Pendentes</span>
                            <p className="text-[14px] font-black leading-none">2</p>
                        </div>
                    </div>
                </header>

                <div className="px-4 space-y-4">
                    {projetos.map(proj => (
                        <div
                            key={proj.id}
                            onClick={() => toggleRow(proj.id)}
                            className={`group bg-[#111111] border rounded-[2rem] p-6 space-y-4 active:scale-[0.99] transition-all overflow-hidden ${expandedRow === proj.id ? 'border-blue-500 ring-1 ring-blue-500/20 shadow-2xl shadow-blue-900/20' : 'border-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-black text-white text-lg tracking-tight leading-none">{proj.nomeProjeto}</h3>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{proj.clienteNome}</span>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                        <span className="text-[9px] font-bold text-blue-400">#VS-{proj.id}00</span>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${proj.status === 'Em Edição' ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    }`}>
                                    {proj.status}
                                </div>
                            </div>

                            {expandedRow !== proj.id && (
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Layers size={14} className="opacity-50" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Versão {proj.rodadas?.length || 1}.0</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => handleCopyLink(e, proj.magicToken)} className="p-2.5 bg-white/5 rounded-xl text-gray-400 border border-white/5 active:bg-blue-600 transition-colors">
                                            <Copy size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/projeto/${proj.magicToken}`); }} className="p-2.5 bg-white/5 rounded-xl text-blue-500 border border-white/5">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <AnimatePresence>
                                {expandedRow === proj.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 space-y-6">
                                            {/* 1. Briefing Semente */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-blue-400/80">
                                                    <Sparkles size={14} />
                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">O Briefing (Semente)</h4>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                                    <p className="text-[11px] text-gray-400 leading-relaxed italic">"{proj.briefing}"</p>
                                                </div>
                                            </div>

                                            {/* 2. Alterações Cliente */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-orange-400/80">
                                                    <Activity size={14} />
                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">Alterações Pedidas</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    {proj.feedbacks?.map(f => (
                                                        <div key={f.id} className="bg-white/5 p-4 rounded-3xl border border-l-2 border-l-orange-500 border-white/5 space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[8px] font-black uppercase text-gray-500">{f.autor}</span>
                                                                <span className="text-[8px] text-gray-600 font-bold">{f.data}</span>
                                                            </div>
                                                            <p className="text-[11px] text-white font-medium leading-tight">{f.texto}</p>
                                                        </div>
                                                    ))}
                                                    {(!proj.feedbacks || proj.feedbacks.length === 0) && (
                                                        <div className="text-[10px] text-gray-600 font-bold uppercase py-2">Nenhuma alteração pendente</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 3. Entrega Motor */}
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-blue-500">
                                                    <PlusCircle size={14} />
                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">Entregar Nova Versão</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Link do Vídeo (Google Drive / Frame.io)"
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => setEntrega({ ...entrega, link: e.target.value })}
                                                        className="w-full bg-[#050505] border border-white/10 rounded-2xl p-4 text-[11px] text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-600 transition-all font-mono"
                                                    />
                                                    <textarea
                                                        placeholder="Notas de Produção (Ex: Corrigido o take 05...)"
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => setEntrega({ ...entrega, notas: e.target.value })}
                                                        className="w-full bg-[#050505] border border-white/10 rounded-2xl p-4 text-[11px] text-white placeholder:text-gray-700 h-24 resize-none focus:outline-none focus:border-blue-600 transition-all"
                                                    />
                                                    <button
                                                        onClick={handleSubmitVersion}
                                                        className="w-full h-14 bg-blue-600 rounded-3xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {submitting ? (
                                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>Submeter Entrega <Send size={14} /></>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {projetos.length === 0 && !loading && (
                        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-gray-600 flex flex-col items-center gap-4">
                            <Activity size={32} className="opacity-20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum Projeto Ativo</span>
                        </div>
                    )}
                </div>
            </motion.main>

        </div>
    );
}

