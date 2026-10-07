import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Pagamentos() {
  const [drivers, setDrivers] = useState([]);
  const [freights, setFreights] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Fretes não pagos do motorista
  const driverPendingFreights = freights.filter(f => f.driver_id === selectedDriverId && f.status !== 'Pago');
  const driverDeductions = deductions.filter(d => d.driver_id === selectedDriverId);

  const grossAmount = driverPendingFreights.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const additionsAmount = driverPendingFreights.reduce((acc, curr) => acc + (Number(curr.toll) || 0) + (Number(curr.daily_allowance) || 0) + (Number(curr.other_additions) || 0), 0);
  const deductionsAmount = driverDeductions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const netAmount = (grossAmount + additionsAmount) - deductionsAmount;

  const handleRegisterPayment = async () => {
    if (!selectedDriver) return;

    const paymentData = {
      driver_id: selectedDriver.id,
      date: new Date().toISOString().split('T')[0],
      gross_amount: grossAmount + additionsAmount,
      deductions_amount: deductionsAmount,
      net_amount: netAmount,
      payment_method: paymentMethod,
      notes: paymentNotes,
      status: 'Pago'
    };

    const freightIdsToUpdate = driverPendingFreights.map(f => f.id);

    await dataService.registerPayment(paymentData, freightIdsToUpdate);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      loadData();
    }, 2000);
  };

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 class="text-2xl font-bold text-white">Acerto e Fechamento de Pagamento</h1>
        <p class="text-sm text-slate-400">Calcule o saldo líquido e efetue o pagamento ao motorista</p>
      </div>

      {/* Seleção do Motorista */}
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
        <label class="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Selecione o Motorista para Fechamento</label>
        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
          class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-base focus:border-emerald-500"
        >
          {drivers.map(d => (
            <option key={d.id} value={d.id}>{d.name} — Placa: {d.plate} ({d.model})</option>
          ))}
        </select>
      </div>

      {selectedDriver && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Resumo do Cálculo */}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Resumo do Demonstrativo</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between text-slate-300">
                  <span>Valor dos Fretes ({driverPendingFreights.length}):</span>
                  <span class="font-medium text-white">{formatCurrency(grossAmount)}</span>
                </div>

                <div class="flex justify-between text-slate-300">
                  <span>Adicionais (Pedágio/Diárias):</span>
                  <span class="font-medium text-emerald-400">+ {formatCurrency(additionsAmount)}</span>
                </div>

                <div class="flex justify-between text-slate-300">
                  <span>Descontos / Vales:</span>
                  <span class="font-medium text-rose-400">- {formatCurrency(deductionsAmount)}</span>
                </div>

                <div class="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                  <span class="text-base font-bold text-slate-200">VALOR LÍQUIDO:</span>
                  <span class="text-2xl font-extrabold text-emerald-400">{formatCurrency(netAmount)}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 p-3 bg-slate-900/60 rounded-lg border border-slate-700 text-xs text-slate-400">
              <p class="font-semibold text-slate-300">Dados Bancários Cadastrados:</p>
              <p>PIX: <span class="text-emerald-400 font-mono">{selectedDriver.pix || 'Não informado'}</span></p>
              <p>Banco: {selectedDriver.bank || '-'} | Ag: {selectedDriver.agency || '-'} | C/C: {selectedDriver.account || '-'}</p>
            </div>
          </div>

          {/* Form Registrador */}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Registrar Pagamento</h3>

              <div class="space-y-4 text-sm">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option>PIX</option>
                    <option>Transferência Bancária (TED/DOC)</option>
                    <option>Dinheiro</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Observações do Comprovante</label>
                  <textarea
                    rows="3"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Ex: Ref. fretes semana 40/2026..."
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  ></textarea>
                </div>
              </div>
            </div>

            {isSuccess && (
              <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg flex items-center space-x-2 my-2">
                <CheckCircle class="w-5 h-5" />
                <span>Pagamento registrado com sucesso!</span>
              </div>
            )}

            <button
              onClick={handleRegisterPayment}
              disabled={driverPendingFreights.length === 0}
              class="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 transition"
            >
              <CreditCard class="w-5 h-5" />
              <span>REGISTRAR PAGAMENTO AGORA</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}