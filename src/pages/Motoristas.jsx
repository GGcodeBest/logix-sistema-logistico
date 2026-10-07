import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import Modal from '../components/Modal';
import { formatCurrency, formatCPF } from '../utils/formatters';
import { Plus, Search, Eye, Edit, Trash2, DollarSign } from 'lucide-react';

export default function Motoristas() {
  const [drivers, setDrivers] = useState([]);
  const [freights, setFreights] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const emptyForm = {
    name: '', cpf: '', phone: '', plate: '', model: '', type: 'Carreta LS',
    bank: '', agency: '', account: '', pix: '', notes: '', status: 'Ativo'
  };

  const [formData, setFormData] = useState(emptyForm);

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

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setSelectedDriver(driver);
      setFormData(driver);
    } else {
      setSelectedDriver(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dataService.saveDriver(formData);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      await dataService.deleteDriver(id);
      loadData();
    }
  };

  // Cálculo por motorista
  const getDriverStats = (driverId) => {
    const dFreights = freights.filter(f => f.driver_id === driverId);
    const dDeductions = deductions.filter(d => d.driver_id === driverId);

    const gross = dFreights.reduce((acc, curr) => acc + (Number(curr.amount) || 0) + (Number(curr.toll) || 0) + (Number(curr.daily_allowance) || 0), 0);
    const ded = dDeductions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return {
      count: dFreights.length,
      gross,
      deductions: ded,
      net: gross - ded
    };
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cpf.includes(searchTerm) ||
    d.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Cadastro de Motoristas</h1>
          <p class="text-sm text-slate-400">Gerencie a frota de parceiros e dados bancários</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          class="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-lg"
        >
          <Plus class="w-4 h-4" />
          <span>Novo Motorista</span>
        </button>
      </div>

      {/* Busca */}
      <div class="relative max-w-md">
        <Search class="w-5 h-5 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, CPF ou placa..."
          class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Tabela */}
      <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/60 text-xs font-semibold uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th class="p-4">Motorista</th>
                <th class="p-4">CPF</th>
                <th class="p-4">Veículo / Placa</th>
                <th class="p-4 text-center">Fretes</th>
                <th class="p-4">Total Bruto</th>
                <th class="p-4">Descontos</th>
                <th class="p-4">Total Líquido</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              {filteredDrivers.map(driver => {
                const stats = getDriverStats(driver.id);
                return (
                  <tr key={driver.id} class="hover:bg-slate-700/30 transition">
                    <td class="p-4 font-medium text-white">{driver.name}</td>
                    <td class="p-4">{formatCPF(driver.cpf)}</td>
                    <td class="p-4">
                      <div>{driver.model}</div>
                      <span class="text-xs text-slate-400 font-mono">{driver.plate}</span>
                    </td>
                    <td class="p-4 text-center font-bold">{stats.count}</td>
                    <td class="p-4 text-emerald-400 font-medium">{formatCurrency(stats.gross)}</td>
                    <td class="p-4 text-rose-400">{formatCurrency(stats.deductions)}</td>
                    <td class="p-4 text-white font-bold">{formatCurrency(stats.net)}</td>
                    <td class="p-4">
                      <span class={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        driver.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(driver)} class="p-1 text-slate-400 hover:text-emerald-400">
                        <Edit class="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(driver.id)} class="p-1 text-slate-400 hover:text-rose-400">
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

      {/* Modal Cadastro/Edição */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDriver ? 'Editar Motorista' : 'Novo Motorista'}>
        <form onSubmit={handleSubmit} class="space-y-4 text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">CPF</label>
              <input required type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Telefone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Placa do Veículo</label>
              <input required type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white uppercase" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Modelo do Veículo</label>
              <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Tipo de Veículo</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                <option>Truck</option>
                <option>Carreta LS</option>
                <option>Bitrem</option>
                <option>Vanderléia</option>
              </select>
            </div>
          </div>

          <div class="border-t border-slate-700 pt-4">
            <h4 class="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Dados Bancários para Pagamento</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input placeholder="Banco" type="text" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})} class="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
              <input placeholder="Agência" type="text" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} class="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
              <input placeholder="Conta" type="text" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} class="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
            <div class="mt-3">
              <input placeholder="Chave PIX (CPF, E-mail, Celular ou Aleatória)" type="text" value={formData.pix} onChange={e => setFormData({...formData, pix: e.target.value})} class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={() => setIsModalOpen(false)} class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg">Salvar Motorista</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}