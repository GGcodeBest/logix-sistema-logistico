import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sun, Moon, Menu, User, Truck } from 'lucide-react';

export default function Navbar({ toggleSidebar, isDarkMode, setIsDarkMode }) {
  const { user, logout } = useAuth();

  return (
    <header class="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div class="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar} 
          class="lg:hidden text-slate-400 hover:text-white focus:outline-none"
        >
          <Menu class="w-6 h-6" />
        </button>
        <div class="flex items-center space-x-2 text-emerald-500 font-bold text-xl tracking-wider">
          <Truck class="w-7 h-7 text-emerald-400" />
          <span class="hidden sm:inline text-white">TRANS<span class="text-emerald-400">FRETE</span></span>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          class="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-700/50 hover:bg-slate-700 transition"
          title="Alternar Tema"
        >
          {isDarkMode ? <Sun class="w-5 h-5" /> : <Moon class="w-5 h-5" />}
        </button>

        <div class="flex items-center space-x-3 border-l border-slate-700 pl-4">
          <div class="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <User class="w-5 h-5" />
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-slate-200">{user?.email || 'Administrador'}</p>
            <p class="text-xs text-slate-400">Gestor de Transportes</p>
          </div>
          <button
            onClick={logout}
            class="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
            title="Sair do sistema"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}