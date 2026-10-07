import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const generatePaymentReceiptPDF = (driver, period, freights, deductions, totals, paymentInfo) => {
  const doc = new jsPDF();

  // Cabeçalho Empresa
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 38, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSFRETE LOGÍSTICA', 14, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Comprovante Demonstrativo de Pagamento de Frete', 14, 26);
  doc.text(`Data de Emissão: ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 32);

  // Informações do Motorista
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO MOTORISTA E VEÍCULO', 14, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Motorista: ${driver.name}`, 14, 55);
  doc.text(`CPF: ${driver.cpf}`, 14, 61);
  doc.text(`Veículo/Placa: ${driver.model} (${driver.plate})`, 14, 67);

  doc.text(`Banco: ${driver.bank || '-'} | Ag: ${driver.agency || '-'} | Conta: ${driver.account || '-'}`, 110, 55);
  doc.text(`Chave PIX: ${driver.pix || '-'}`, 110, 61);
  doc.text(`Período de Referência: ${period || 'Geral'}`, 110, 67);

  // Tabela de Fretes
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('FRETES REALIZADOS', 14, 78);

  const freightRows = freights.map(f => [
    formatDate(f.date),
    f.number,
    f.origin,
    f.destination,
    formatCurrency(f.amount),
    formatCurrency((Number(f.toll) || 0) + (Number(f.daily_allowance) || 0) + (Number(f.other_additions) || 0)),
    formatCurrency(Number(f.amount) + (Number(f.toll) || 0) + (Number(f.daily_allowance) || 0) + (Number(f.other_additions) || 0))
  ]);

  doc.autoTable({
    startY: 82,
    head: [['Data', 'Nº Frete', 'Origem', 'Destino', 'Vlr. Frete', 'Adicionais', 'Total Bruto']],
    body: freightRows,
    theme: 'striped',
    headStyles: { fillStyle: [30, 41, 59] },
    styles: { fontSize: 8 }
  });

  let currentY = doc.lastAutoTable.finalY + 10;

  // Tabela de Descontos
  if (deductions && deductions.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCONTOS APLICADOS', 14, currentY);

    const deductionRows = deductions.map(d => [
      formatDate(d.date),
      d.type,
      d.reason || '-',
      formatCurrency(d.amount)
    ]);

    doc.autoTable({
      startY: currentY + 4,
      head: [['Data', 'Tipo', 'Motivo / Descrição', 'Valor Desconto']],
      body: deductionRows,
      theme: 'striped',
      headStyles: { fillStyle: [185, 28, 28] }, // Red header
      styles: { fontSize: 8 }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Resumo Financeiro
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, 182, 32, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  doc.text(`Total Bruto Fretes + Adicionais:`, 18, currentY + 8);
  doc.text(`${formatCurrency(totals.gross + totals.additions)}`, 110, currentY + 8);

  doc.text(`Total de Descontos:`, 18, currentY + 16);
  doc.text(`- ${formatCurrency(totals.deductions)}`, 110, currentY + 16);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`VALOR LÍQUIDO A PAGAR:`, 18, currentY + 26);
  doc.text(`${formatCurrency(totals.net)}`, 110, currentY + 26);

  // Assinaturas
  currentY += 50;
  doc.setLineWidth(0.5);
  doc.line(20, currentY, 90, currentY);
  doc.line(120, currentY, 190, currentY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do Responsável', 32, currentY + 5);
  doc.text('Assinatura do Motorista', 137, currentY + 5);

  doc.save(`Comprovante_Pagamento_${driver.name.replace(/\s+/g, '_')}.pdf`);
};