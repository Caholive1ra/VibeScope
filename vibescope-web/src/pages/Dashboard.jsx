import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const projetos = [
        { id: 1, nome: 'Vídeo Manifesto - TechX', status: 'Em Aprovação', cor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
        { id: 2, nome: 'Campanha de Inverno 2026', status: 'Em Edição', cor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { id: 3, nome: 'Reels Institucionais', status: 'Aprovado', cor: 'bg-green-500/10 text-green-400 border-green-500/20' },
        { id: 4, nome: 'Podcast Ep. 42', status: 'Revisão Cliente', cor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header do Dashboard */}
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-lg text-gray-400">
                    Olá, <span className="text-gray-200 font-medium">Carolina</span>! Você tem <strong className="text-white">{projetos.length}</strong> projetos ativos.
                </p>
            </header>

            {/* Grid de Projetos */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {projetos.map(proj => (
                        <div
                            key={proj.id}
                            className="group flex flex-col justify-between h-40 p-6 bg-[#0f1115] border border-gray-800 hover:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                    {proj.nome}
                                </h3>
                                {/* Badge de Status */}
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${proj.cor}`}>
                                    {proj.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/50">
                                <span className="text-xs text-gray-500 font-medium">Modificado hoje</span>
                                <span className="text-sm font-medium text-blue-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Painel &rarr;
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Card para Novo Projeto */}
                    <Link
                        to="/dashboard/novo"
                        className="flex flex-col items-center justify-center gap-3 h-40 border-2 border-dashed border-gray-700 hover:border-gray-500 hover:bg-[#0f1115]/50 rounded-xl transition-all group"
                    >
                        <div className="p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200">
                            Criar Novo Projeto
                        </span>
                    </Link>

                </div>
            </section>

        </div>
    );
}
