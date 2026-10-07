import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import Modal from '../components/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Search, MinusCircle, Trash2, Edit } from 'lucide-react';

export default function Descontos() {
  const [deductions, setDeductions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [freights, setFreights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState(null);

  const emptyForm = {
    driver_id: '',
    freight_id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Adiantamento',
    reason: '',
    amount: 0,
    notes: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ded = await dataService.getDeductions();
    const d = await dataService.getDrivers();
    const f = await dataService.getFreight();
    setDeductions(ded);
    setDrivers(d);
    setFreights(f);
  };

  const handleOpenModal = (deduction = null) => {
    if (deduction) {
      setSelectedDeduction(deduction);
      setFormData(deduction);
    } else {
      setSelectedDeduction(null);
      setFormData({ ...emptyForm, driver_id: drivers[0]?.id || '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dataService.saveDeduction(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este lançamento de desconto?')) {
      await dataService.deleteDeduction(id);
      loadData();
    }
  };

  const filteredDeductions = deductions.filter(d => {
    const driver = drivers.find(dr => dr.id === d.driver_id);
    return (
      driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Controle de Descontos e Adiantamentos</h1>
          <p class="text-sm text-slate-400">Registre avarias, vales, multas e abastecimentos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          class="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-lg"
        >
          <Plus class="w-4 h-4" />
          <span>Lançar Desconto</span>
        </button>
      </div>

      <div class="relative max-w-md">
        <Search class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por motorista, tipo ou motivo..."
          class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/60 text-xs font-semibold uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th class="p-4">Data</th>
                <th class="p-4">Motorista</th>
                <th class="p-4">Tipo</th>
                <th class="p-4">Motivo / Descrição</th>
                <th class="p-4">Valor Desconto</th>
                <th class="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              {filteredDeductions.map(ded => {
                const driver = drivers.find(d => d.id === ded.driver_id);
                return (
                  <tr key={ded.id} class="hover:bg-slate-700/30 transition">
                    <td class="p-4 text-xs font-mono">{formatDate(ded.date)}</td>
                    <td class="p-4 font-medium text-white">{driver?.name || 'Não identificado'}</td>
                    <td class="p-4">
                      <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400">
                        {ded.type}
                      </span>
                    </td>
                    <td class="p-4 text-slate-400">{ded.reason || '-'}</td>
                    <td class="p-4 font-bold text-rose-400">{formatCurrency(ded.amount)}</td>
                    <td class="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(ded)} class="p-1 text-slate-400 hover:text-emerald-400">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ded.id)} class="p-1 text-slate-400 hover:text-rose-400">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Desconto */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDeduction ? 'Editar Desconto' : 'Lançar Desconto'}>
        <form onSubmit={handleSubmit} class="space-y-4 text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Motorista</label>
              <select required value={formData.driver_id} onChange={e => setFormData({...formData, driver_id: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                <option value="">Selecione...</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Data</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Tipo de Desconto</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                <option>Avaria de mercadoria</option>
                <option>Falta de mercadoria</option>
                <option>Multa</option>
                <option>Adiantamento</option>
                <option>Combustível</option>
                <option>Pedágio</option>
                <option>Diária</option>
                <option>Outros</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Valor do Desconto (R$)</label>
              <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-rose-400 font-bold" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Motivo / Descrição Detalhada</label>
            <textarea rows="3" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" placeholder="Explique a origem do desconto..."></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg">Salvar Desconto</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}