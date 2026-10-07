import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { dataService } from '../services/dataService';
import { formatCurrency } from '../utils/formatters';
import { Users, Truck, DollarSign, MinusCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function Dashboard() {
  const [period, setPeriod] = useState('mes');
  const [drivers, setDrivers] = useState([]);
  const [freights, setFreights] = useState([]);
  const [deductions, setDeductions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const d = await dataService.getDrivers();
    const f = await dataService.getFreight();
    const ded = await dataService.getDeductions();
    setDrivers(d);
    setFreights(f);
    setDeductions(ded);
  };

  // Cálculos consolidados
  const totalDrivers = drivers.length;
  const totalFreights = freights.length;
  const totalGross = freights.reduce((acc, curr) => acc + (Number(curr.amount) || 0) + (Number(curr.toll) || 0) + (Number(curr.daily_allowance) || 0) + (Number(curr.other_additions) || 0), 0);
  const totalDeductions = deductions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalNet = totalGross - totalDeductions;

  const pendingFreights = freights.filter(f => f.status !== 'Pago');
  const totalPending = pendingFreights.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const paidFreights = freights.filter(f => f.status === 'Pago');
  const totalPaid = paidFreights.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Gráficos Data
  const barChartData = {
    labels: ['Jul', 'Ago', 'Set', 'Out'],
    datasets: [
      {
        label: 'Valor Bruto (R$)',
        data: [12000, 15000, 18000, totalGross],
        backgroundColor: '#10b981',
      },
      {
        label: 'Descontos (R$)',
        data: [1200, 800, 1500, totalDeductions],
        backgroundColor: '#f43f5e',
      }
    ],
  };

  const doughnutData = {
    labels: ['Pagos', 'Pendentes / Conferência'],
    datasets: [
      {
        data: [totalPaid || 1, totalPending || 1],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Dashboard Geral</h1>
          <p class="text-sm text-slate-400">Visão consolidada dos fretes e pagamentos</p>
        </div>

        {/* Filtro de Período */}
        <div class="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs font-medium">
          <Calendar class="w-4 h-4 text-slate-400 ml-2 mr-1" />
          {['hoje', 'semana', 'mes', '3meses', 'todos'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md transition ${
                period === p 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === 'hoje' && 'Hoje'}
              {p === 'semana' && 'Semana'}
              {p === 'mes' && 'Este Mês'}
              {p === '3meses' && '3 Mêses'}
              {p === 'todos' && 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards KPI */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Motoristas Cadastrados" value={totalDrivers} icon={Users} color="blue" />
        <StatCard title="Total de Fretes" value={totalFreights} icon={Truck} color="indigo" />
        <StatCard title="Valor Bruto dos Fretes" value={formatCurrency(totalGross)} icon={DollarSign} color="emerald" />
        <StatCard title="Total Descontos" value={formatCurrency(totalDeductions)} icon={MinusCircle} color="rose" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Líquido a Pagar" value={formatCurrency(totalNet)} icon={DollarSign} color="emerald" />
        <StatCard title="Pagamentos Pendentes" value={formatCurrency(totalPending)} icon={Clock} color="amber" subtext={`${pendingFreights.length} fretes pendentes`} />
        <StatCard title="Pagamentos Realizados" value={formatCurrency(totalPaid)} icon={CheckCircle} color="blue" subtext={`${paidFreights.length} fretes quitados`} />
      </div>

      {/* Gráficos */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
          <h3 class="text-md font-semibold text-slate-200 mb-4">Comparativo Financeiro Mensal</h3>
          <div class="h-64">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <h3 class="text-md font-semibold text-slate-200 mb-4">Status de Pagamentos</h3>
          <div class="h-52 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div class="mt-4 text-xs text-center text-slate-400">
            Atualizado automaticamente conforme cadastro no sistema
          </div>
        </div>
      </div>
    </div>
  );
}