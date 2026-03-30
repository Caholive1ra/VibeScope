import React from 'react';

export default function DeviceMockup({ url }) {
    return (
        <div className="relative mx-auto border-gray-800 bg-gray-900 border-[10px] rounded-[3rem] h-[640px] w-[320px] shadow-2xl ring-1 ring-white/10">
            {/* Botões Laterais Realistas */}
            <div className="h-[40px] w-[3px] bg-gray-800 absolute -start-[13px] top-[100px] rounded-s-lg border-y border-white/5"></div>
            <div className="h-[40px] w-[3px] bg-gray-800 absolute -start-[13px] top-[150px] rounded-s-lg border-y border-white/5"></div>
            <div className="h-[60px] w-[3px] bg-gray-800 absolute -end-[13px] top-[130px] rounded-e-lg border-y border-white/5"></div>

            {/* Tela do Smartphone */}
            <div className="rounded-[2.4rem] overflow-hidden w-full h-full bg-black relative">
                {/* Notch / Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black border border-white/10 rounded-full z-30 flex items-center justify-end px-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 blur-[1px]"></div>
                </div>

                {/* Camada do Iframe (App Real) */}
                <div className="h-full w-full overflow-hidden bg-black">
                    {url ? (
                        <iframe
                            src={url}
                            className="w-full h-full border-none select-none pointer-events-auto scale-[1.001]"
                            title="VibeScope Preview"
                            loading="lazy"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-xs">
                            NO_SIGNAL_CONNECTED
                        </div>
                    )}
                </div>

                {/* Efeito de Reflexo Minimalista (apenas nas bordas) */}
                <div className="absolute inset-0 pointer-events-none rounded-[2.4rem] border border-white/5 ring-1 ring-inset ring-white/5 mx-[1px] my-[1px] z-10"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-20 pointer-events-none pointer-events-none z-20"></div>
            </div>
        </div>
    );
}
