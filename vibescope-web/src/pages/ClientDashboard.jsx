import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { PlayCircle, Bell, History } from 'lucide-react';
import { projetosApi } from '../api/projetosApi';

export default function ClientDashboard() {
    const navigate = useNavigate();

    const [projetos, setProjetos] = useState([]);
    const [timelineByMagicToken, setTimelineByMagicToken] = useState({});
    const [loading, setLoading] = useState(true);

    const formatDate = (value) => {
        if (!value) return '';
        const s = String(value);
        return s.includes('T') ? s.slice(0, 10) : s;
    };

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const data = await projetosApi.listProjetos();
                const normalized = Array.isArray(data) ? data : [];
                if (!mounted) return;
                setProjetos(normalized);

                const tokens = normalized
                    .map((p) => p.magicToken)
                    .filter(Boolean);

                const uniqueTokens = Array.from(new Set(tokens));

                const timelinePairs = await Promise.all(
                    uniqueTokens.map(async (token) => {
                        const tl = await projetosApi.getTimelineByMagicToken(token);
                        return [token, Array.isArray(tl) ? tl : []];
                    }),
                );

                if (!mounted) return;
                setTimelineByMagicToken(
                    timelinePairs.reduce((acc, [token, tl]) => {
                        acc[token] = tl;
                        return acc;
                    }, {}),
                );
            } catch {
                if (!mounted) return;
                setProjetos([]);
                setTimelineByMagicToken({});
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const projetosOrdenados = useMemo(() => {
        // Mantém ordem previsível: pendentes primeiro e depois os demais.
        const score = (status) => {
            const s = String(status ?? '');
            if (s === 'AGUARDANDO_CLIENTE') return 0;
            if (s === 'EM_ANALISE') return 1;
            return 2;
        };
        return [...projetos].sort((a, b) => score(a.status) - score(b.status));
    }, [projetos]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans pt-6 pb-10 px-5 overflow-hidden relative">

            {/* Header Fixo - Não Arrasta */}
            <header className="flex justify-between items-center pt-6 mb-6 shrink-0 z-20 bg-black/50 backdrop-blur-md">
                <div>
                    <h2 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Painel do Cliente</h2>
                    <h1 className="text-xl font-black italic tracking-tighter">VibeScope</h1>
                </div>
                <div className="relative p-2 bg-white/5 rounded-full shrink-0">
                    <Bell className="text-gray-400" size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-black"></span>
                </div>
            </header>

            {/* Viewport com scroll nativo */}
            <motion.div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-28" style={{ touchAction: 'pan-y' }}>
                {loading ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">Carregando...</div>
                ) : projetosOrdenados.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        Nenhum projeto encontrado.
                    </div>
                ) : (
                    <div className="space-y-10 pb-40">
                        {projetosOrdenados.map((proj) => {
                            const tl = timelineByMagicToken[String(proj.magicToken ?? '')] || [];
                            const lastItem = tl[0] || null;
                            const canReviewFinal = String(proj.status ?? '') === 'AGUARDANDO_CLIENTE';

                            return (
                                <div key={proj.id} className="space-y-4">
                                    {/* Banner de Destaque por Projeto */}
                                    <div
                                        onClick={() => navigate(`/projeto/${proj.magicToken}`, { state: { openBrainDump: canReviewFinal } })}
                                        className="relative overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-blue-600 to-blue-900 shadow-xl shadow-blue-900/30 group active:scale-[0.98] transition-all shrink-0 border border-white/10"
                                    >
                                        <div className="relative z-10 space-y-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-white text-blue-800 text-[7px] font-black uppercase py-0.5 px-2.5 rounded-full">
                                                    {canReviewFinal ? 'Review' : 'Visualizar'}
                                                </span>
                                                <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                    {lastItem?.versao ? `${lastItem.versao}` : '—'} • {proj.nomeProjeto}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black leading-tight max-w-[220px]">
                                                {canReviewFinal
                                                    ? 'Pronto para sua revisão final.'
                                                    : 'Versões do projeto para acompanhar.'}
                                            </h3>
                                        </div>
                                        <PlayCircle size={44} className="absolute bottom-6 right-6 text-white opacity-40 group-hover:opacity-100 transition-all group-hover:scale-110" />
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex items-center justify-between mb-2 shrink-0 px-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <History size={12} />
                                            <h4 className="text-[9px] font-black uppercase tracking-widest">
                                                Atividade do Projeto
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative">
                                        {tl.length === 0 ? (
                                            <div className="bg-[#0F0F0F] p-4 rounded-3xl border border-white/5 text-gray-500 text-sm">
                                                Sem histórico ainda.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {tl.map((item, idx) => (
                                                    <div
                                                        key={`${item.rodadaId ?? idx}`}
                                                        onClick={() =>
                                                            navigate(`/projeto/${proj.magicToken}`, {
                                                                state: { selectedRodadaId: item.rodadaId, openBrainDump: false },
                                                            })
                                                        }
                                                        className="relative pl-12 group transition-transform cursor-pointer"
                                                    >
                                                        <div
                                                            className={`absolute left-4.5 translate-x-1 top-2.5 w-2.5 h-2.5 rounded-full border-2 border-black z-10 ${item.autor === 'Produção' ? 'bg-green-500' : 'bg-blue-500'
                                                                }`}
                                                        />

                                                        <div className="bg-[#0F0F0F] p-4 rounded-3xl border border-white/5 active:bg-white/10 transition-colors">
                                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                                                                    {item.versao}
                                                                </span>
                                                                <span className="text-[8px] font-bold text-gray-700">
                                                                    {formatDate(item.dataEvento)}
                                                                </span>
                                                            </div>
                                                            <h5 className="font-bold text-xs leading-tight text-gray-200 mb-3">
                                                                {item.titulo}
                                                            </h5>

                                                            <p className="text-[10px] text-gray-500 leading-tight">
                                                                {item.observacoesEditor ||
                                                                    item.feedbackCliente ||
                                                                    'Sem observações nesta versão.'}
                                                            </p>

                                                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                                                                <div className="flex items-center gap-1.5 text-[8px] text-gray-600 font-bold uppercase tracking-tighter">
                                                                    <div className="w-3.5 h-3.5 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center text-[5px]">
                                                                        AI
                                                                    </div>
                                                                    {item.autor}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-600">
                                                                    {String(item.status ?? '').split(' ')[0]}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

        </div>
    );
}
