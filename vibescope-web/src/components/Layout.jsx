import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, PlusSquare, User, Activity, Layers, Sparkles, Copy } from 'lucide-react';

export default function Layout({ children }) {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Projetos', path: '/editor', icon: LayoutDashboard },
        { name: 'Novo Projeto', path: '/editor/novo', icon: PlusSquare },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">

            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-shrink-0 bg-[#0f1115] border-r border-gray-800 flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-wider text-white">
                        Vibe<span className="text-blue-500">Scope</span>
                    </h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-600/10 text-blue-500'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">C</div>
                        <div className="flex-1 overflow-hidden uppercase tracking-tighter text-[10px] text-gray-500 font-bold">
                            Carolina <br /> Editora
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (Apenas visível em telas pequenas) */}
            <header className="md:hidden h-14 bg-[#0f1115] border-b border-gray-800 flex items-center justify-between px-4 z-50">
                <h1 className="text-lg font-bold text-white">
                    Vibe<span className="text-blue-500">Scope</span>
                </h1>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white focus:outline-none"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-14 bg-gray-950/95 backdrop-blur-sm z-40 animate-in fade-in duration-200">
                    <nav className="p-6 space-y-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-4 p-4 rounded-xl text-lg font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400'
                                        }`}
                                >
                                    <Icon size={24} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}

            {/* Área Principal (Main) */}
            <main className="flex-1 overflow-y-auto bg-gray-900 pb-28 md:pb-0">
                {children}
            </main>

            {/* Bottom Nav Mobile (Visual de App Nativo) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1115]/80 backdrop-blur-2xl border-t border-white/5 pb-8 pt-4 px-6 flex items-center justify-between z-50 rounded-b-[2.5rem]">
                <Link to="/editor" className="flex flex-col items-center gap-1 text-blue-500">
                    <Layers size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Fila</span>
                </Link>
                <div className="flex flex-col items-center gap-1 text-gray-600">
                    <Activity size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Monitor</span>
                </div>

                <div className="flex flex-col items-center gap-1 text-gray-600">
                    <Sparkles size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">I.A</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-600">
                    <Copy size={20} /><span className="text-[8px] font-black uppercase tracking-tighter">Links</span>
                </div>
            </nav>

        </div>
    );
}
