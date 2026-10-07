const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const defaultData = {
    motoristas: [
        { id: 1, nome: "João Silva", cpf: "111.222.333-44", telefone: "(17) 99111-2233", tipo_veiculo: "Truck", placa: "ABC-1234", status: "Ativo" },
        { id: 2, nome: "Marcos Oliveira", cpf: "222.333.444-55", telefone: "(16) 99222-3344", tipo_veiculo: "Carreta", placa: "XYZ-5678", status: "Ativo" },
        { id: 3, nome: "Roberto Costa", cpf: "333.444.555-66", telefone: "(17) 99333-4455", tipo_veiculo: "Toco", placa: "DEF-9012", status: "Ativo" }
    ],
    transferencias: [
        {
            id: "TRF-1001",
            data: "2026-10-01",
            hora_saida: "08:30",
            origem: "MATRIZ",
            destino: "São José do Rio Preto",
            motorista_id: 1,
            motorista_nome: "João Silva",
            veiculo: "Truck",
            placa: "ABC-1234",
            valor_mercadoria: 85450.00,
            valor_frete: 2500.00,
            forma_pagamento: "PIX",
            status_pagamento: "Pago",
            data_pagamento: "2026-10-01",
            observacoes: "Carga entregue sem avarias"
        },
        {
            id: "TRF-1002",
            data: "2026-10-03",
            hora_saida: "10:00",
            origem: "MATRIZ",
            destino: "Jardinópolis",
            motorista_id: 2,
            motorista_nome: "Marcos Oliveira",
            veiculo: "Carreta",
            placa: "XYZ-5678",
            valor_mercadoria: 120000.00,
            valor_frete: 3200.00,
            forma_pagamento: "Transferência Bancária",
            status_pagamento: "Pendente",
            data_pagamento: "",
            observacoes: "Aguardando confirmação do financeiro"
        }
    ]
};

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    try {
        const raw = fs.readFileSync(DATA_FILE);
        return JSON.parse(raw);
    } catch (err) {
        return defaultData;
    }
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/data', (req, res) => {
    res.json(readData());
});

app.post('/api/save', (req, res) => {
    const { transferencias, motoristas } = req.body;
    const current = readData();
    const updated = {
        transferencias: transferencias || current.transferencias,
        motoristas: motoristas || current.motoristas
    };
    saveData(updated);
    res.json({ success: true, data: updated });
});

app.post('/api/reset', (req, res) => {
    saveData(defaultData);
    res.json({ success: true, data: defaultData });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`LOGIX rodando na porta ${PORT}`);
});

module.exports = app;