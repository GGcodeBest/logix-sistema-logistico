import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/80">
          <h3 class="text-lg font-semibold text-slate-100">{title}</h3>
          <button 
            onClick={onClose} 
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}