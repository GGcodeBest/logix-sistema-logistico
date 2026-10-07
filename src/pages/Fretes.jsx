import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import Modal from '../components/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Search, Truck, Edit, Trash2 } from 'lucide-react';

export default function Fretes() {
  const [freights, setFreights] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState(null);

  const emptyForm = {
    number: `FR-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split('T')[0],
    driver_id: '',
    client: '',
    client_code: '',
    origin: '',
    destination: '',
    cargo_type: '',
    amount: 0,
    toll: 0,
    daily_allowance: 0,
    other_additions: 0,
    notes: '',
    status: 'Pendente'
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const f = await dataService.getFreight();
    const d = await dataService.getDrivers();
    setFreights(f);
    setDrivers(d);
  };

  const handleOpenModal = (freight = null) => {
    if (freight) {
      setSelectedFreight(freight);
      setFormData(freight);
    } else {
      setSelectedFreight(null);
      setFormData({ ...emptyForm, driver_id: drivers[0]?.id || '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dataService.saveFreight(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente remover este frete?')) {
      await dataService.deleteFreight(id);
      loadData();
    }
  };

  const calculateGross = (item) => {
    return (Number(item.amount) || 0) + (Number(item.toll) || 0) + (Number(item.daily_allowance) || 0) + (Number(item.other_additions) || 0);
  };

  const filteredFreights = freights.filter(f =>
    f.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Lançamento de Fretes</h1>
          <p class="text-sm text-slate-400">Registre ordens de transporte e valores adicionais</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          class="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-lg"
        >
          <Plus class="w-4 h-4" />
          <span>Novo Frete</span>
        </button>
      </div>

      <div class="relative max-w-md">
        <Search class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar frete, cliente, origem ou destino..."
          class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Tabela de Fretes */}
      <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/60 text-xs font-semibold uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th class="p-4">Nº / Data</th>
                <th class="p-4">Motorista</th>
                <th class="p-4">Cliente</th>
                <th class="p-4">Rota (Origem / Destino)</th>
                <th class="p-4">Valor Bruto</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              {filteredFreights.map(freight => {
                const driver = drivers.find(d => d.id === freight.driver_id);
                return (
                  <tr key={freight.id} class="hover:bg-slate-700/30 transition">
                    <td class="p-4">
                      <div class="font-bold text-white">{freight.number}</div>
                      <div class="text-xs text-slate-400">{formatDate(freight.date)}</div>
                    </td>
                    <td class="p-4 font-medium">{driver?.name || 'Não identificado'}</td>
                    <td class="p-4">{freight.client}</td>
                    <td class="p-4 text-xs">
                      <div><span class="text-slate-400">De:</span> {freight.origin}</div>
                      <div><span class="text-slate-400">Para:</span> {freight.destination}</div>
                    </td>
                    <td class="p-4 font-bold text-emerald-400">{formatCurrency(calculateGross(freight))}</td>
                    <td class="p-4">
                      <span class={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        freight.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' :
                        freight.status === 'Aprovado' ? 'bg-blue-500/10 text-blue-400' :
                        freight.status === 'Em conferência' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {freight.status}
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(freight)} class="p-1 text-slate-400 hover:text-emerald-400">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(freight.id)} class="p-1 text-slate-400 hover:text-rose-400">
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

      {/* Modal Frete */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedFreight ? 'Editar Frete' : 'Novo Frete'}>
        <form onSubmit={handleSubmit} class="space-y-4 text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Número do Frete</label>
              <input required type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Data</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Motorista</label>
              <select required value={formData.driver_id} onChange={e => setFormData({...formData, driver_id: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                <option value="">Selecione...</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.plate})</option>)}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Cliente</label>
              <input required type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Origem</label>
              <input required type="text" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Destino</label>
              <input required type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Tipo de Carga</label>
              <input type="text" value={formData.cargo_type} onChange={e => setFormData({...formData, cargo_type: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
          </div>

          <div class="border-t border-slate-700 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Valor Frete (R$)</label>
              <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-emerald-400 font-bold" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Pedágio (R$)</label>
              <input type="number" step="0.01" value={formData.toll} onChange={e => setFormData({...formData, toll: parseFloat(e.target.value) || 0})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Diárias (R$)</label>
              <input type="number" step="0.01" value={formData.daily_allowance} onChange={e => setFormData({...formData, daily_allowance: parseFloat(e.target.value) || 0})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Outros Adicionais</label>
              <input type="number" step="0.01" value={formData.other_additions} onChange={e => setFormData({...formData, other_additions: parseFloat(e.target.value) || 0})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Status do Frete</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
              <option>Pendente</option>
              <option>Em conferência</option>
              <option>Aprovado</option>
              <option>Pago</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg">Salvar Frete</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}