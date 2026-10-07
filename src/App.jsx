import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Motoristas from './pages/Motoristas';
import Fretes from './pages/Fretes';
import Descontos from './pages/Descontos';
import Pagamentos from './pages/Pagamentos';
import Extrato from './pages/Extrato';
import Relatorios from './pages/Relatorios';

function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />

      <div class="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/motoristas" element={<Motoristas />} />
            <Route path="/fretes" element={<Fretes />} />
            <Route path="/descontos" element={<Descontos />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/extrato" element={<Extrato />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function MainRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div class="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 font-bold">
        Carregando TransFrete...
      </div>
    );
  }

  return user ? <PrivateLayout /> : <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}