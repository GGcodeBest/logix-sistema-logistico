import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'emerald', subtext }) {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  };

  return (
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div>
        <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 class="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
        {subtext && <p class="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div class={`p-3 rounded-xl border ${colorMap[color]}`}>
        <Icon class="w-6 h-6" />
      </div>
    </div>
  );
}