import React from 'react';
import { Sparkles, Activity, Play, Send, Plus, Layers, CheckCircle } from 'lucide-react';

export default function DeviceMockup({ url, screen = 'semente' }) {

    const renderScreen = () => {
        if (url) return (
            <iframe
                src={url}
                className="w-full h-full border-none select-none pointer-events-auto"
                title="VibeScope Preview"
                loading="lazy"
            />
        );

        switch (screen) {
            case 'semente':
                return (
                    <div className="h-full w-full bg-black flex flex-col p-6 pt-12 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black italic tracking-tighter">VibeScope</h3>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none">A Semente do Projeto 🌿</p>
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 space-y-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center"><Plus size={20} /></div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Novo Projeto</h4>
                            <div className="h-[1px] w-full bg-white/5"></div>
                            <div className="space-y-2 opacity-30">
                                <div className="h-3 w-3/4 bg-white/10 rounded-full"></div>
                                <div className="h-3 w-1/2 bg-white/10 rounded-full"></div>
                            </div>
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 text-center border-dashed opacity-50">
                            <Sparkles size={24} className="mx-auto mb-2 text-blue-500" />
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-700">Dump sua Ideia</p>
                        </div>
                    </div>
                );
            case 'motor':
                return (
                    <div className="h-full w-full bg-black flex flex-col p-6 pt-12 space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xl font-black italic tracking-tighter leading-none">Motor</h3>
                            <span className="text-[8px] font-black bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest mb-1">Live</span>
                        </div>
                        <div className="space-y-2">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-[#111111] border border-white/5 rounded-3xl p-4 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <div className="h-3 w-20 bg-white/10 rounded-full"></div>
                                        <div className="h-2 w-12 bg-white/5 rounded-full"></div>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center opacity-50"><Layers size={14} /></div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2rem] p-6 space-y-3">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Activity size={14} />
                                <span className="text-[8px] font-black uppercase tracking-widest">IA Task Engine</span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-2 w-full bg-blue-500/20 rounded-full"></div>
                                <div className="h-2 w-3/4 bg-blue-500/20 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                );
            case 'veredito':
                return (
                    <div className="h-full w-full bg-black flex flex-col p-0">
                        <div className="w-full aspect-[9/16] bg-zinc-900 flex items-center justify-center overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 z-10"></div>
                            <Play size={40} className="text-white z-20 opacity-40" />
                            <div className="absolute bottom-6 left-6 z-20 space-y-1">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Versão Final v1.2</h4>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Aguardando Aprovação...</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#0A0A0A] p-6 space-y-4">
                            <div className="flex items-center gap-2 text-white/50">
                                <Activity size={14} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Veredito do Cliente</span>
                            </div>
                            <div className="bg-black border border-white/5 rounded-[2rem] p-5 border-dashed flex items-center justify-center flex-col gap-2 opacity-50">
                                <Send size={20} className="text-blue-500" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-700">Enviar Feedback</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative mx-auto border-gray-800 bg-gray-900 border-[10px] rounded-[3.5rem] h-[680px] w-[320px] shadow-2xl ring-1 ring-white/10 overflow-visible group">
            {/* Botões Laterais Realistas */}
            <div className="h-[40px] w-[3px] bg-gray-800 absolute -start-[13px] top-[100px] rounded-s-lg border-y border-white/5"></div>
            <div className="h-[40px] w-[3px] bg-gray-800 absolute -start-[13px] top-[150px] rounded-s-lg border-y border-white/5"></div>
            <div className="h-[60px] w-[3px] bg-gray-800 absolute -end-[13px] top-[130px] rounded-e-lg border-y border-white/5"></div>

            {/* Tela do Smartphone */}
            <div className="rounded-[2.8rem] overflow-hidden w-full h-full bg-black relative shadow-inner">
                {/* Notch / Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black border border-white/5 rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 blur-[1px]"></div>
                </div>

                <div className="h-full w-full overflow-hidden bg-black relative">
                    {renderScreen()}
                </div>

                {/* Camada de Proteção/Reflexo */}
                <div className="absolute inset-0 pointer-events-none rounded-[2.8rem] border border-white/5 ring-1 ring-inset ring-white/5 z-40 opacity-50"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-50"></div>
            </div>

            {/* Glow Sutil no fundo do celular */}
            <div className="absolute -inset-4 bg-blue-600/5 blur-3xl rounded-[4rem] -z-10 group-hover:bg-blue-600/10 transition-all duration-500"></div>
        </div>
    );
}
