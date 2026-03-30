import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ExternalLink, Activity, Layers } from 'lucide-react';
import { projetosApi } from '../api/projetosApi';

export default function EditorDashboard() {
    const navigate = useNavigate();
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatStatus = (status) => {
        const s = String(status ?? '');
        switch (s) {
            case 'EM_EDICAO':
                return 'Em Edição';
            case 'AGUARDANDO_CLIENTE':
                return 'Aguardando Feedback';
            case 'REFACAO_SOLICITADA':
                return 'Alteração Solicitada';
            case 'EM_ANALISE':
                return 'Em Análise';
            case 'APROVADO':
                return 'Aprovado';
            case 'REPROVADO':
                return 'Reprovado';
            case 'CONCLUIDO':
                return 'Concluído';
            case 'PENDENTE':
                return 'Pendente';
            default:
                return s || 'Pendente';
        }
    };

    useEffect(() => {
        const fetchProjetos = async () => {
            try {
                const data = await projetosApi.listProjetos();
                if (Array.isArray(data)) {
                    setProjetos(data);
                } else {
                    throw new Error("Formato inválido");
                }
            } catch (error) {
                console.warn("Usando dados de demonstração (Backend offline ou lento)", error);
                setProjetos([
                    { id: 1, nomeProjeto: "Vídeo Manifesto", clienteNome: "TechX", status: "EM_EDICAO", magicToken: "techx-123" },
                    { id: 2, nomeProjeto: "Campanha Verão", clienteNome: "FashionHub", status: "AGUARDANDO_CLIENTE", magicToken: "fh-456" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjetos();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-6 pb-10 px-5 flex flex-col relative overflow-hidden font-sans">
            {/* Container principal (scroll interno) */}
            <motion.main
                className="flex-1"
            >
                {/* Header */}
                <header className="pb-6 mb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[19px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Gestão de Produção 🎬</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Na Fila</span>
                            <p className="text-[14px] font-black leading-none">{projetos.length}</p>
                        </div>
                        <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Pendentes</span>
                            <p className="text-[14px] font-black leading-none">
                                {projetos.filter((p) => {
                                    const st = String(p.status ?? '');
                                    return (
                                        st === 'PENDENTE' ||
                                        st === 'EM_ANALISE' ||
                                        st === 'AGUARDANDO_CLIENTE' ||
                                        st === 'REFACAO_SOLICITADA'
                                    );
                                }).length}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    {projetos.map(proj => (
                        <div
                            key={proj.id}
                            onClick={() => navigate(`/editor/projeto/${proj.id}`)}
                            className="group bg-[#111111] border border-white/5 rounded-[2rem] p-6 space-y-4 active:scale-[0.98] active:bg-blue-600/5 transition-all overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 min-w-0">
                                    <h3 className="font-black text-white text-lg tracking-tight leading-none">{proj.nomeProjeto}</h3>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{proj.clienteNome}</span>
                                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-blue-500/50">#VS-{proj.id}00</span>
                                    </div>
                                </div>
                                <div
                                    className={`shrink-0 whitespace-nowrap px-2 py-1 rounded-full text-[8px] leading-none font-black uppercase tracking-[0.14em] ${
                                        proj.status === 'EM_EDICAO' || proj.status === 'EM_ANALISE'
                                            ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    }`}
                                >
                                    {formatStatus(proj.status)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <Layers size={14} className="opacity-50" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Acessar Projeto</span>
                                </div>
                                <div className="p-2.5 bg-white/5 rounded-xl text-blue-500 border border-white/5">
                                    <ExternalLink size={16} />
                                </div>
                            </div>
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
