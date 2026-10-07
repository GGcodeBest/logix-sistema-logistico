import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  MinusCircle, 
  CreditCard, 
  FileSpreadsheet, 
  BarChart3, 
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Motoristas', path: '/motoristas', icon: Users },
    { name: 'Fretes', path: '/fretes', icon: Truck },
    { name: 'Descontos', path: '/descontos', icon: MinusCircle },
    { name: 'Pagamentos', path: '/pagamentos', icon: CreditCard },
    { name: 'Extrato', path: '/extrato', icon: FileSpreadsheet },
    { name: 'Relatórios', path: '/relatorios', icon: BarChart3 },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          class="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 
        transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div class="h-16 flex items-center justify-between px-6 border-b border-slate-700 lg:hidden">
            <span class="text-lg font-bold text-emerald-400">Menu Principal</span>
            <button onClick={() => setIsOpen(false)} class="text-slate-400 hover:text-white">
              <X class="w-6 h-6" />
            </button>
          </div>

          <nav class="p-4 space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors
                    ${isActive 
                      ? 'bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500' 
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
                  `}
                >
                  <Icon class="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div class="p-4 border-t border-slate-700/50">
          <div class="bg-slate-900/50 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/30">
            <p class="font-semibold text-slate-300">TransFrete v1.0</p>
            <p class="mt-1">Sistema Web de Controle Financeiro de Fretes.</p>
          </div>
        </div>
      </aside>
    </>
  );
}