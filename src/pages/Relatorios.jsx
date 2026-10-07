import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { formatCurrency, formatDate } from '../utils/formatters';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Printer } from 'lucide-react';

export default function Relatorios() {
  const [freights, setFreights] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [deductions, setDeductions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setFreights(await dataService.getFreight());
    setDrivers(await dataService.getDrivers());
    setDeductions(await dataService.getDeductions());
  };

  const exportToExcel = () => {
    const dataToExport = freights.map(f => {
      const driver = drivers.find(d => d.id === f.driver_id);
      return {
        'Número Frete': f.number,
        'Data': formatDate(f.date),
        'Motorista': driver?.name || '',
        'CPF': driver?.cpf || '',
        'Cliente': f.client,
        'Origem': f.origin,
        'Destino': f.destination,
        'Valor Frete (R$)': f.amount,
        'Pedágio (R$)': f.toll,
        'Status': f.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio_Fretes');
    XLSX.writeFile(workbook, 'Relatorio_Fretes_TransFrete.xlsx');
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Relatórios Gerenciais</h1>
          <p class="text-sm text-slate-400">Exporte dados operacionais e financeiros em Excel</p>
        </div>

        <button
          onClick={exportToExcel}
          class="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-lg"
        >
          <FileSpreadsheet class="w-4 h-4" />
          <span>Exportar para Excel (.xlsx)</span>
        </button>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-bold text-white mb-4">Relatório Consolidado de Operações</h3>
        <p class="text-sm text-slate-400 mb-4">Clique no botão acima para gerar a planilha completa contendo todos os registros filtrados de motoristas, fretes e pagamentos.</p>
      </div>
    </div>
  );
}