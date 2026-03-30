import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Presentation from './pages/Presentation';
import ClientDashboard from './pages/ClientDashboard';
import ClientView from './pages/ClientView';
import EditorDashboard from './pages/EditorDashboard';
import EditorProjectDetails from './pages/EditorProjectDetails';
import CreateProject from './pages/CreateProject';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Premium (Root) */}
        <Route path="/" element={<Presentation />} />

        {/* --- ÁREA DO CLIENTE (MOBILE FIRST) --- */}
        <Route path="/cliente/dashboard" element={<ClientDashboard />} />
        <Route path="/projeto/:magicToken" element={<ClientView />} />

        {/* --- ÁREA INTERNA DO EDITOR (B2B SaaS) --- */}
        <Route path="/editor" element={
          <Layout>
            <EditorDashboard />
          </Layout>
        } />

        <Route path="/editor/projeto/:id" element={
          <Layout>
            <EditorProjectDetails />
          </Layout>
        } />

        <Route path="/editor/novo" element={
          <Layout>
            <CreateProject />
          </Layout>
        } />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
