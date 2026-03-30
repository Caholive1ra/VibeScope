import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronUp, Send, Sparkles, CheckCircle2, Play, Info, History, ExternalLink } from 'lucide-react';
import { projetosApi } from '../api/projetosApi';

// Auxiliar para extrair ID do YouTube
const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function ClientView() {
    const { magicToken } = useParams();
    const location = useLocation();
    const videoRef = useRef(null);
    const openBrainDumpOnEnter = Boolean(location.state?.openBrainDump);
    const selectedRodadaIdFromRoute = location.state?.selectedRodadaId ?? null;

    const [isPlaying, setIsPlaying] = useState(false);
    const [feedbackTexto, setFeedbackTexto] = useState("");
    const [anexos, setAnexos] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(openBrainDumpOnEnter);
    const [sucesso, setSucesso] = useState(false);
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [feedbackError, setFeedbackError] = useState(null);
    const [activeTab, setActiveTab] = useState('video');

    const [isAddRefOpen, setIsAddRefOpen] = useState(false);
    const [novoAnexoTipo, setNovoAnexoTipo] = useState('AUDIO');
    const [novoAnexoUrl, setNovoAnexoUrl] = useState('');
    const [projeto, setProjeto] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [selectedRodadaId, setSelectedRodadaId] = useState(selectedRodadaIdFromRoute);

    const fallbackVersion = {
        nome: 'Vídeo Manifesto',
        versao: 'v3.0 Final',
        resumoIA: 'Ajuste fino na colorização para tons mais frios.',
        feedbackAnterior: null,
        videoUrl: 'https://www.youtube.com/watch?v=P4bqsSgmDMQ',
        videoThumb: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const [projectData, timelineData] = await Promise.all([
                    projetosApi.getProjectByMagicToken(magicToken),
                    projetosApi.getTimelineByMagicToken(magicToken),
                ]);
                if (!mounted) return;
                setProjeto(projectData);
                const tl = Array.isArray(timelineData) ? timelineData : [];
                setTimeline(tl);
                if (tl.length > 0) {
                    const selectedFromRoute = selectedRodadaIdFromRoute != null
                        ? tl.find((t) => String(t.rodadaId) === String(selectedRodadaIdFromRoute))
                        : null;
                    setSelectedRodadaId(selectedFromRoute ? selectedFromRoute.rodadaId : tl[0].rodadaId);
                }
            } catch {
                if (!mounted) return;
                setProjeto(null);
                setTimeline([]);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [magicToken, selectedRodadaIdFromRoute]);

    const selectedTimelineItem = useMemo(() => {
        if (timeline.length === 0) return null;
        return timeline.find((t) => String(t.rodadaId) === String(selectedRodadaId)) || timeline[0];
    }, [timeline, selectedRodadaId]);

    const currentVersion = {
        nome: projeto?.nomeProjeto || fallbackVersion.nome,
        versao: selectedTimelineItem?.versao || fallbackVersion.versao,
        resumoIA: projeto?.resumoIa || fallbackVersion.resumoIA,
        feedbackAnterior: selectedTimelineItem?.feedbackCliente || null,
        videoUrl: selectedTimelineItem?.videoUrl || projeto?.videoUrl || fallbackVersion.videoUrl,
        videoThumb: fallbackVersion.videoThumb,
    };
    const ytID = getYouTubeID(currentVersion.videoUrl);

    const togglePlay = () => {
        if (ytID) {
            setIsPlaying(true); // YouTube iframes controlam o próprio play, apenas ocultamos o thumb
            return;
        }

        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSendFeedback = async (e) => {
        e.preventDefault();
        if (!feedbackTexto.trim() || feedbackSubmitting) return;

        setFeedbackError(null);
        setFeedbackSubmitting(true);

        try {
            await projetosApi.submitFeedback(magicToken, {
                feedbackTexto: feedbackTexto.trim(),
                anexos: anexos.map((a) => ({
                    tipo: a.tipo,
                    url: a.url,
                })),
            });
            const timelineData = await projetosApi.getTimelineByMagicToken(magicToken);
            setTimeline(Array.isArray(timelineData) ? timelineData : []);
            setSucesso(true);
            setFeedbackSubmitting(false);

            setTimeout(() => {
                setIsSheetOpen(false);
                setSucesso(false);
                setFeedbackTexto("");
                setAnexos([]);
                setNovoAnexoUrl('');
                setNovoAnexoTipo('AUDIO');
                setIsAddRefOpen(false);
                setFeedbackError(null);
            }, 2000);
        } catch (err) {
            console.error('Erro ao enviar feedback:', err);
            setSucesso(false);
            setFeedbackSubmitting(false);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Não foi possível enviar. Verifique a conexão e tente de novo.';
            setFeedbackError(typeof msg === 'string' ? msg : 'Falha ao enviar Brain Dump. Verifique a API.');
        }
    };

    const handleAddRef = () => {
        const url = novoAnexoUrl.trim();
        if (!url) return;

        setAnexos((prev) => [
            ...prev,
            {
                tipo: novoAnexoTipo,
                url,
            },
        ]);

        setNovoAnexoUrl('');
        setNovoAnexoTipo('AUDIO');
    };

    const refreshProjetoERodadas = async () => {
        const [projectData, timelineData] = await Promise.all([
            projetosApi.getProjectByMagicToken(magicToken),
            projetosApi.getTimelineByMagicToken(magicToken),
        ]);
        setProjeto(projectData);

        const tl = Array.isArray(timelineData) ? timelineData : [];
        setTimeline(tl);

        setSelectedRodadaId((prev) => {
            if (prev && tl.some((t) => String(t.rodadaId) === String(prev))) return prev;
            return tl.length > 0 ? tl[0].rodadaId : null;
        });
    };

    const handleTabChange = (tab) => {
        if (tab === 'historico' && isPlaying) {
            if (videoRef.current) videoRef.current.pause();
            setIsPlaying(false);
        }
        setActiveTab(tab);
        if (tab === 'historico') {
            refreshProjetoERodadas().catch(() => {
                // Silencioso: evita quebrar a navegação se o backend estiver instável.
            });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans pt-4 pb-10 px-5 overflow-hidden relative">

            <header className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/5 z-20 shrink-0">
                <div className="w-[38px]"></div> {/* Spacer para manter o título centralizado */}
                <div className="text-center">
                    <h1 className="text-xs font-black uppercase tracking-widest mb-1">{currentVersion.versao}</h1>
                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-tight italic opacity-80">{currentVersion.nome}</p>
                </div>
                <button className="p-2 -mr-2 text-gray-400">
                    <History size={20} />
                </button>
            </header>

            {/* Abas */}
            <div className="flex bg-[#0F0F0F] mt-4 p-1 rounded-2xl border border-white/5 shrink-0 z-20">
                <button onClick={() => handleTabChange('video')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600'}`}>Review</button>
                <button onClick={() => handleTabChange('historico')} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'historico' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600'}`}>Chat Histórico</button>
            </div>

            <motion.main
                style={{ touchAction: 'pan-y' }}
                className="flex-1 overflow-y-auto hide-scrollbar flex flex-col p-0 space-y-4 pb-28 justify-center"
            >
                {activeTab === 'video' ? (
                    <>
                        {/* Universal Player Container */}
                        <div
                            className="relative aspect-video bg-gray-950 rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center shrink-0 group active:scale-[0.99] transition-transform"
                        >
                            {/* Camada de Cobertura (Gate) - Somente aparece se NOT isPlaying */}
                            {!isPlaying && (
                                <div
                                    onClick={() => setIsPlaying(true)}
                                    className="absolute inset-0 z-30 cursor-pointer flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-500"
                                >
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/60 transition-transform active:scale-110">
                                        <Play fill="white" className="text-white translate-x-0.5" size={28} />
                                    </div>
                                    <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Clique para Review</p>
                                </div>
                            )}

                            {ytID ? (
                                <iframe
                                    key={`yt-${ytID}-${isPlaying}`}
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${ytID}?autoplay=${isPlaying ? 1 : 0}&modestbranding=1&rel=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    ref={videoRef}
                                    onClick={togglePlay}
                                    src={currentVersion.videoUrl}
                                    poster={currentVersion.videoThumb}
                                    className={`w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}
                                    playsInline
                                    loop
                                />
                            )}
                        </div>

                        {currentVersion.feedbackAnterior && (
                            <div className="bg-blue-500/5 p-4 rounded-[1.5rem] border border-blue-500/20 shrink-0">
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1 block">Contexto do Feedback:</span>
                                <p className="text-xs text-blue-100 italic font-light opacity-90 leading-relaxed italic">"{currentVersion.feedbackAnterior}"</p>
                            </div>
                        )}

                        <div className="bg-[#0F0F0F] p-5 rounded-[1.5rem] border border-white/5 space-y-3 shrink-0">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Sparkles size={14} />
                                <h4 className="text-[9px] font-black uppercase tracking-widest mb-0.5">IA Insights: Automação</h4>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed font-light">{currentVersion.resumoIA}</p>
                            <button className="pt-2 text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1">
                                <Info size={12} /> Assistir com Comentários
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4 pt-2">
                        {timeline.length > 0 ? timeline.map((item) => (
                            <button
                                key={item.rodadaId}
                                type="button"
                                onClick={() => {
                                    setSelectedRodadaId(item.rodadaId);
                                    setActiveTab('video');
                                }}
                                className="w-full text-left bg-[#0F0F0F] p-6 rounded-[2rem] border border-white/5 relative pl-14 active:bg-white/5"
                            >
                                <div className="absolute left-6 top-10 bottom-0 w-[1px] bg-gray-800"></div>
                                <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-blue-600 border-4 border-black"></div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-blue-500 tracking-[0.2em]">{item.status}</span>
                                    <h5 className="text-xs font-bold text-gray-200">Versão {item.versao} enviada por {item.autor}</h5>
                                    <p className="text-[10px] text-gray-500 font-light leading-tight">
                                        {item.observacoesEditor || 'Clique para abrir esta versão.'}
                                    </p>
                                </div>
                            </button>
                        )) : (
                            <div className="bg-[#0F0F0F] p-6 rounded-[2rem] border border-white/5">
                                <p className="text-[10px] text-gray-500">Sem histórico real ainda para este token.</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.main>

            {/* Fixo Botão */}
            <div className="absolute bottom-6 left-5 right-5 z-30">
                <button
                    onClick={() => setIsSheetOpen(true)}
                    className="w-full h-14 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-[0.15em] text-[10px] shadow-2xl shadow-blue-950/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-t border-white/10"
                >
                    <ChevronUp size={18} className="animate-bounce" />
                    <span>Enviar Brain Dump</span>
                </button>
            </div>

            {/* Bottom Sheet */}
            <AnimatePresence>
                {isSheetOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSheetOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            drag="y" dragConstraints={{ top: 0 }}
                            onDragEnd={(_, info) => { if (info.offset.y > 100) setIsSheetOpen(false); }}
                            className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] rounded-t-[3rem] z-50 p-8 pt-2 pb-12 border-t border-white/10 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto my-4 mb-8"></div>
                            <form onSubmit={handleSendFeedback} className="space-y-6">
                                <header className="text-center mb-4">
                                    <h2 className="text-lg font-black italic tracking-tighter uppercase italic text-blue-500">Escreva sua Alteração</h2>
                                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Texto + imagem/link/video/audio para o Brain Dump</p>
                                </header>
                                {sucesso ? (
                                    <div className="h-44 flex flex-col items-center justify-center gap-4 text-green-500">
                                        <CheckCircle2 size={54} className="animate-pulse shadow-xl shadow-green-900/40" />
                                        <p className="font-black tracking-widest uppercase text-xs">VibeScope IA Atualizando...</p>
                                    </div>
                                ) : (
                                    <>
                                        {feedbackError && (
                                            <p className="text-center text-red-400 text-[11px] font-bold uppercase tracking-wide px-2" role="alert">
                                                {feedbackError}
                                            </p>
                                        )}
                                        <textarea
                                            value={feedbackTexto}
                                            onChange={(e) => setFeedbackTexto(e.target.value)}
                                            className="w-full h-40 bg-black border border-white/5 rounded-[1.5rem] p-5 text-xs focus:outline-none focus:border-blue-500 transition-all resize-none shadow-inner"
                                            placeholder="Ex: Na alteração, reduzir trilha em 2db no final e aumentar saturação da cena 03."
                                        />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddRefOpen((v) => !v)}
                                                    className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.12em] text-[10px] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span className="text-[12px]">📎</span> Adicionar Referência
                                                </button>
                                            </div>

                                            {isAddRefOpen && (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">
                                                            Tipo
                                                        </label>
                                                        <select
                                                            value={novoAnexoTipo}
                                                            onChange={(e) => setNovoAnexoTipo(e.target.value)}
                                                            className="w-full bg-black border border-white/5 rounded-[1.5rem] p-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                                                        >
                                                            <option value="AUDIO">AUDIO</option>
                                                            <option value="VIDEO">VIDEO</option>
                                                            <option value="IMAGEM">IMAGEM</option>
                                                            <option value="DOCUMENTO">DOCUMENTO</option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2">
                                                            URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={novoAnexoUrl}
                                                            onChange={(e) => setNovoAnexoUrl(e.target.value)}
                                                            placeholder="https://... (MP3, imagem, Drive, Notion)"
                                                            className="w-full bg-black border border-white/5 rounded-[1.5rem] p-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={!novoAnexoUrl.trim()}
                                                        onClick={handleAddRef}
                                                        className="w-full h-12 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl text-white font-black uppercase tracking-[0.15em] text-[11px] active:scale-95 transition-all flex items-center justify-center gap-2 border-t border-white/10"
                                                    >
                                                        Adicionar
                                                    </button>
                                                </div>
                                            )}

                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!feedbackTexto.trim() || feedbackSubmitting}
                                            className="w-full h-16 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl text-white font-black uppercase tracking-[0.15em] text-[11px] shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {feedbackSubmitting ? 'Enviando…' : (
                                                <>
                                                    Confirmar Envio <Send size={16} />
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </form>

                            {!sucesso && anexos.length > 0 && (
                                <div className="space-y-3 mt-6">
                                    {anexos.map((anexo, idx) => {
                                        const tipo = String(anexo.tipo ?? '').toUpperCase();
                                        return (
                                            <div
                                                key={`${anexo.url}-${idx}`}
                                                className="bg-[#050505] border border-white/5 rounded-[1.5rem] p-4"
                                            >
                                                {tipo === 'AUDIO' && (
                                                    <audio controls src={anexo.url} className="h-8 w-full" />
                                                )}

                                                {tipo === 'IMAGEM' && (
                                                    <img
                                                        src={anexo.url}
                                                        alt="Anexo"
                                                        className="h-16 w-16 object-cover rounded"
                                                    />
                                                )}

                                                {(tipo === 'DOCUMENTO' || tipo === 'VIDEO') && (
                                                    <a
                                                        href={anexo.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.12em] text-[10px] transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <ExternalLink size={16} />
                                                        Abrir referência
                                                    </a>
                                                )}

                                                <p className="mt-3 text-[9px] font-mono text-gray-500 break-all">
                                                    {tipo} • {anexo.url}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
