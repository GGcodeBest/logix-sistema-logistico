export const initialDrivers = [
  {
    id: 'd1',
    name: 'Carlos Eduardo Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    plate: 'ABC-1234',
    model: 'Volvo FH 540',
    type: 'Carreta LS',
    bank: 'Banco do Brasil',
    agency: '1234-5',
    account: '98765-4',
    pix: '12345678900',
    notes: 'Motorista preferencial para rotas SP-RJ',
    status: 'Ativo'
  },
  {
    id: 'd2',
    name: 'Roberto Fernandes',
    cpf: '987.654.321-11',
    phone: '(21) 99887-1122',
    plate: 'XYZ-9876',
    model: 'Scania R450',
    type: 'Bitrem',
    bank: 'Itau',
    agency: '4321',
    account: '12345-6',
    pix: 'roberto@email.com',
    notes: 'Aptidão para transporte de carga refrigerada',
    status: 'Ativo'
  },
  {
    id: 'd3',
    name: 'Marcos Vinicius Souza',
    cpf: '456.789.123-22',
    phone: '(31) 97766-5544',
    plate: 'KLY-4512',
    model: 'Mercedes-Benz Actros',
    type: 'Truck',
    bank: 'Bradesco',
    agency: '0887',
    account: '65432-1',
    pix: '(31) 97766-5544',
    notes: '',
    status: 'Inativo'
  }
];

export const initialFreight = [
  {
    id: 'f1',
    number: 'FR-2026-001',
    date: '2026-10-01',
    driver_id: 'd1',
    client: 'Ambev Logística',
    client_code: 'CLI-001',
    origin: 'São Paulo / SP',
    destination: 'Rio de Janeiro / RJ',
    cargo_type: 'Bebidas',
    amount: 4500.00,
    toll: 350.00,
    daily_allowance: 200.00,
    other_additions: 100.00,
    notes: 'Entrega realizada no prazo estipulado',
    status: 'Aprovado'
  },
  {
    id: 'f2',
    number: 'FR-2026-002',
    date: '2026-10-03',
    driver_id: 'd1',
    client: 'Nestlé Brasil',
    client_code: 'CLI-002',
    origin: 'Campinas / SP',
    destination: 'Belo Horizonte / MG',
    cargo_type: 'Alimentos',
    amount: 5200.00,
    toll: 420.00,
    daily_allowance: 300.00,
    other_additions: 0.00,
    notes: 'Aguardando canhoto assinado',
    status: 'Em conferência'
  },
  {
    id: 'f3',
    number: 'FR-2026-003',
    date: '2026-09-28',
    driver_id: 'd2',
    client: 'Klabin Papéis',
    client_code: 'CLI-003',
    origin: 'Curitiba / PR',
    destination: 'São Paulo / SP',
    cargo_type: 'Bobinas de Papel',
    amount: 3800.00,
    toll: 280.00,
    daily_allowance: 150.00,
    other_additions: 50.00,
    notes: 'Pagamento efetuado via PIX',
    status: 'Pago'
  }
];

export const initialDeductions = [
  {
    id: 'ded1',
    driver_id: 'd1',
    freight_id: 'f1',
    date: '2026-10-02',
    type: 'Adiantamento',
    reason: 'Adiantamento de combustível em rota',
    amount: 800.00,
    notes: 'Comprovante do posto anexo'
  },
  {
    id: 'ded2',
    driver_id: 'd1',
    freight_id: 'f1',
    date: '2026-10-02',
    type: 'Avaria de mercadoria',
    reason: 'Caixa danificada na descarga',
    amount: 150.00,
    notes: 'Notificado pelo cliente'
  },
  {
    id: 'ded3',
    driver_id: 'd2',
    freight_id: 'f3',
    date: '2026-09-29',
    type: 'Adiantamento',
    reason: 'Vale refeição/combustível',
    amount: 500.00,
    notes: ''
  }
];

export const initialPayments = [
  {
    id: 'p1',
    driver_id: 'd2',
    date: '2026-09-30',
    gross_amount: 4280.00,
    deductions_amount: 500.00,
    net_amount: 3780.00,
    payment_method: 'PIX',
    notes: 'Comprovante gerado e enviado por WhatsApp',
    status: 'Pago'
  }
];