import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generatePaymentReceiptPDF } from '../utils/pdfGenerator';
import { FileText, Download, Printer } from 'lucide-react';

export default function Extrato() {
  const [drivers, setDrivers] = useState([]);
  const [freights, setFreights] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');

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
    if (d.length > 0) setSelectedDriverId(d[0].id);
  };

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);
  const driverFreights = freights.filter(f => f.driver_id === selectedDriverId);
  const driverDeductions = deductions.filter(d => d.driver_id === selectedDriverId);

  const grossSum = driverFreights.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const additionsSum = driverFreights.reduce((acc, curr) => acc + (Number(curr.toll) || 0) + (Number(curr.daily_allowance) || 0) + (Number(curr.other_additions) || 0), 0);
  const deductionsSum = driverDeductions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const netSum = (grossSum + additionsSum) - deductionsSum;

  const handleDownloadPDF = () => {
    if (!selectedDriver) return;
    generatePaymentReceiptPDF(
      selectedDriver,
      'Período Atual',
      driverFreights,
      driverDeductions,
      { gross: grossSum, additions: additionsSum, deductions: deductionsSum, net: netSum }
    );
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Extrato Consolidado do Motorista</h1>
          <p class="text-sm text-slate-400">Gere comprovantes detalhados para prestação de contas</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          class="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-lg"
        >
          <Download class="w-4 h-4" />
          <span>Gerar Comprovante PDF</span>
        </button>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
        <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Selecione o Motorista</label>
        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
          class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
        >
          {drivers.map(d => (
            <option key={d.id} value={d.id}>{d.name} — CPF: {d.cpf}</option>
          ))}
        </select>
      </div>

      {selectedDriver && (
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50 text-center">
            <div>
              <p class="text-xs text-slate-400 uppercase">Fretes Brutos</p>
              <p class="text-lg font-bold text-slate-200">{formatCurrency(grossSum)}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 uppercase">Adicionais</p>
              <p class="text-lg font-bold text-emerald-400">{formatCurrency(additionsSum)}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 uppercase">Descontos</p>
              <p class="text-lg font-bold text-rose-400">{formatCurrency(deductionsSum)}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 uppercase">Líquido a Receber</p>
              <p class="text-xl font-extrabold text-emerald-400">{formatCurrency(netSum)}</p>
            </div>
          </div>

          <h3 class="text-md font-bold text-white border-b border-slate-700 pb-2">Detalhamento de Fretes Realizados</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-900/60 text-xs uppercase text-slate-400">
                <tr>
                  <th class="p-3">Data</th>
                  <th class="p-3">Frete</th>
                  <th class="p-3">Origem / Destino</th>
                  <th class="p-3">Valor Frete</th>
                  <th class="p-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50">
                {driverFreights.map(f => (
                  <tr key={f.id}>
                    <td class="p-3 text-xs">{formatDate(f.date)}</td>
                    <td class="p-3 font-bold text-white">{f.number}</td>
                    <td class="p-3 text-xs">{f.origin} ➔ {f.destination}</td>
                    <td class="p-3 font-medium text-emerald-400">{formatCurrency(f.amount)}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-xs bg-slate-700">{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}