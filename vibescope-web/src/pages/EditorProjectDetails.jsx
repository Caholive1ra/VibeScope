import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Activity, CheckCircle2, RefreshCw } from 'lucide-react';
import { projetosApi } from '../api/projetosApi';

const formatProjetoStatus = (status) => {
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

const effortClass = (esforco) => {
    const s = String(esforco ?? '').toUpperCase();
    switch (s) {
        case 'BAIXO':
            return 'bg-green-500/10 text-green-400 border border-green-500/20';
        case 'MEDIO':
            return 'bg-blue-600/10 text-blue-500 border border-blue-500/20';
        case 'ALTO':
            return 'bg-red-500/10 text-red-400 border border-red-500/20';
        default:
            return 'bg-gray-800 text-gray-300 border border-white/10';
    }
};

const tarefaStatusClass = (statusTarefa) => {
    const s = String(statusTarefa ?? '');
    switch (s) {
        case 'PENDENTE':
            return 'bg-gray-800/60 text-gray-300 border border-white/10';
        case 'EM_ANDAMENTO':
            return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
        case 'CONCLUIDA':
            return 'bg-green-500/10 text-green-400 border border-green-500/20';
        default:
            return 'bg-gray-800 text-gray-300 border border-white/10';
    }
};

export default function EditorProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [projeto, setProjeto] = useState(null);
    const [rodadaAtual, setRodadaAtual] = useState(null);
    const [tarefas, setTarefas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [error, setError] = useState(null);
    const [regenLoading, setRegenLoading] = useState(false);
    const [regenError, setRegenError] = useState(null);
    const [deliveryUrl, setDeliveryUrl] = useState('');
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [deliveryLoading, setDeliveryLoading] = useState(false);
    const [deliveryMsg, setDeliveryMsg] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProjetoAndTasks = async () => {
            setLoading(true);
            setLoadingTasks(false);
            setError(null);
            setProjeto(null);
            setRodadaAtual(null);
            setTarefas([]);

            try {
                const found = await projetosApi.getProjectById(id);

                if (!found) {
                    throw new Error('Projeto não encontrado');
                }

                // Rodada com maior número (mais recente)
                const rodadas = Array.isArray(found.rodadas) ? found.rodadas : [];
                const rodadaEscolhida = rodadas
                    .slice()
                    .sort((a, b) => (b.numeroRodada ?? 0) - (a.numeroRodada ?? 0))[0];

                if (!isMounted) return;
                setProjeto(found);
                setRodadaAtual(rodadaEscolhida ?? null);

                if (rodadaEscolhida?.id) {
                    setLoadingTasks(true);
                    const tasks = await projetosApi.getTarefasDaRodada(
                        found.id,
                        rodadaEscolhida.id,
                    );
                    if (!isMounted) return;
                    setTarefas(Array.isArray(tasks) ? tasks : []);
                }
            } catch (e) {
                if (!isMounted) return;
                setError(e?.message ?? String(e));
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setLoadingTasks(false);
                }
            }
        };

        fetchProjetoAndTasks();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const currentTask = useMemo(() => {
        if (!tarefas || tarefas.length === 0) return null;
        return (
            tarefas.find((t) => t.statusTarefa === 'PENDENTE') ||
            tarefas.find((t) => t.statusTarefa === 'EM_ANDAMENTO') ||
            tarefas[0]
        );
    }, [tarefas]);

    const handleRegenResumo = async () => {
        if (!projeto?.id || regenLoading) return;
        setRegenLoading(true);
        setRegenError(null);
        try {
            const updated = await projetosApi.regerarResumo(projeto.id);
            setProjeto(updated);
        } catch {
            setRegenError('Não foi possível regerar o resumo agora.');
        } finally {
            setRegenLoading(false);
        }
    };

    const handleEntregarRodada = async () => {
        if (!projeto?.id || !rodadaAtual?.id || !deliveryUrl.trim() || deliveryLoading) return;
        setDeliveryLoading(true);
        setDeliveryMsg(null);
        try {
            const updated = await projetosApi.entregarRodada(projeto.id, rodadaAtual.id, {
                videoUrl: deliveryUrl.trim(),
                observacoesEditor: deliveryNotes.trim() || null,
            });
            setProjeto(updated);
            setDeliveryMsg('Entrega publicada para o cliente com sucesso.');
        } catch (e) {
            setDeliveryMsg(e?.response?.data?.message || 'Não foi possível publicar a entrega.');
        } finally {
            setDeliveryLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !projeto) {
        return (
            <div className="min-h-screen bg-black text-white pt-12 pb-10 px-5 flex flex-col relative overflow-hidden font-sans">
                <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl z-20 pb-6">
                    <button
                        onClick={() => {
                            const currentRole = new URLSearchParams(window.location.search).get('role') || 'editor';
                            navigate(`/editor?role=${currentRole}`);
                        }}
                        className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-all mb-4"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-lg font-black tracking-tight">
                                Projeto não encontrado
                            </h2>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
                                {error || 'Sem dados'}
                            </p>
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-6 flex items-center justify-center">
                    <p className="text-gray-500">{error || 'Falha ao carregar dados.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-6 pb-10 px-5 flex flex-col relative overflow-hidden font-sans">
            <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl z-20 pb-6">
                <button
                    onClick={() => {
                        const currentRole = new URLSearchParams(window.location.search).get('role') || 'editor';
                        navigate(`/editor?role=${currentRole}`);
                    }}
                    className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-all mb-4"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-lg font-black tracking-tight">
                            {projeto.nomeProjeto}
                        </h2>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] break-all">
                            {projeto.clienteNome} • #VS-{projeto.id}24
                        </p>
                    </div>
                    <div className="shrink-0">
                        <div className="px-2 py-1 rounded-full text-[8px] leading-none font-black uppercase tracking-[0.14em] bg-white/5 border border-white/10 whitespace-nowrap">
                            {formatProjetoStatus(projeto.status)}
                        </div>
                    </div>
                </div>
            </header>

            <motion.main
                drag="y"
                dragConstraints={{ top: -1800, bottom: 0 }}
                dragElastic={0.1}
                style={{ touchAction: 'pan-y' }}
                className="flex-1 overflow-y-auto hide-scrollbar cursor-grab active:cursor-grabbing space-y-10 pt-6 pb-28"
            >
                {/* Missão Atual */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-400">
                            <Activity size={16} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                                📌 O Que Fazer Agora?
                            </h4>
                        </div>
                        {rodadaAtual?.numeroRodada && (
                            <span className="text-[8px] font-black bg-orange-500/20 text-orange-400 px-2.5 py-1 rounded-full uppercase border border-orange-500/20">
                                Rodada {rodadaAtual.numeroRodada}
                            </span>
                        )}
                    </div>

                    {currentTask ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#15120F] p-8 rounded-[2.5rem] border border-orange-500/20 shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)] space-y-4"
                        >
                            <div className="flex items-center gap-3 justify-between">
                                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/80">
                                    {currentTask.timecode}
                                </span>
                                <span
                                    className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase border ${effortClass(
                                        currentTask.esforco,
                                    )}`}
                                >
                                    {currentTask.esforco}
                                </span>
                            </div>
                            <p className="text-lg font-medium leading-normal text-white">
                                {currentTask.descricao}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="bg-[#050505] p-8 rounded-[2.5rem] border border-white/5 border-dashed flex flex-col items-center justify-center gap-2 text-gray-600">
                            <CheckCircle2 size={24} className="opacity-20" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">
                                {loadingTasks ? 'Carregando tarefas...' : 'Aguardando processamento da IA'}
                            </span>
                        </div>
                    )}
                </section>

                {/* Resumo / Briefing */}
                <section className="space-y-3 opacity-70">
                    <div className="flex items-center gap-2 text-white/40">
                        <Sparkles size={14} />
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em]">
                            AI Summary
                        </h4>
                        <button
                            type="button"
                            onClick={handleRegenResumo}
                            disabled={regenLoading}
                            className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-blue-300 disabled:opacity-40"
                        >
                            <RefreshCw size={12} className={regenLoading ? 'animate-spin' : ''} />
                            {regenLoading ? 'Gerando...' : 'Regerar'}
                        </button>
                    </div>
                    <div className="bg-[#080808] p-5 rounded-3xl border border-white/5">
                        <p className="text-[12px] text-gray-500 leading-relaxed font-light">
                            {projeto.resumoIa || projeto.briefingBruto || 'Sem resumo ainda.'}
                        </p>
                        {regenError && (
                            <p className="mt-3 text-[10px] text-red-400 font-bold">
                                {regenError}
                            </p>
                        )}
                    </div>
                </section>

                {/* Lista de Tarefas Técnicas */}
                <section className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Activity size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                            Tarefas Técnicas
                        </h4>
                    </div>

                    {tarefas.length > 0 ? (
                        <div className="space-y-3">
                            {tarefas.map((t) => (
                                <div
                                    key={t.id ?? `${t.timecode}-${t.descricao}`}
                                    className="bg-[#0A0A0A] p-4 rounded-[2rem] border border-white/5 space-y-2"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/70">
                                                {t.timecode}
                                            </span>
                                            <span
                                                className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase border ${effortClass(
                                                    t.esforco,
                                                )}`}
                                            >
                                                {t.esforco}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase border ${tarefaStatusClass(
                                                t.statusTarefa,
                                            )}`}
                                        >
                                            {t.statusTarefa}
                                        </span>
                                    </div>

                                    <p className="text-sm leading-snug text-white/90 font-medium">
                                        {t.descricao}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 rounded-[2rem] border border-dashed border-white/10 text-gray-500 text-center">
                            Nenhuma tarefa para esta rodada ainda.
                        </div>
                    )}
                </section>

                {new URLSearchParams(window.location.search).get('role') !== 'creative' && (
                    <section className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle2 size={16} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Publicar Entrega para Cliente
                            </h4>
                        </div>
                        <div className="bg-[#0A0A0A] p-5 rounded-[2rem] border border-white/5 space-y-3">
                            <input
                                type="url"
                                value={deliveryUrl}
                                onChange={(e) => setDeliveryUrl(e.target.value)}
                                placeholder="URL do vídeo final (YouTube/Vimeo/Drive)"
                                className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                            <textarea
                                value={deliveryNotes}
                                onChange={(e) => setDeliveryNotes(e.target.value)}
                                placeholder="Observações opcionais para o cliente"
                                className="w-full h-24 bg-black border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                            />
                            <button
                                type="button"
                                onClick={handleEntregarRodada}
                                disabled={!deliveryUrl.trim() || deliveryLoading || !rodadaAtual?.id}
                                className="w-full h-12 bg-green-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-2xl text-white font-black uppercase tracking-widest text-[10px]"
                            >
                                {deliveryLoading ? 'Publicando...' : 'Marcar como Feito e Enviar ao Cliente'}
                            </button>
                            {deliveryMsg && (
                                <p className="text-[10px] text-gray-400">{deliveryMsg}</p>
                            )}
                        </div>
                    </section>
                )}
            </motion.main>
        </div>
    );
}
