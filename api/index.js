const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const defaultData = {
  motoristas: [
    { id: 1, nome: "João Silva", cpf: "111.222.333-44", telefone: "(16) 99911-1111" },
    { id: 2, nome: "Marcos Oliveira", cpf: "222.333.444-55", telefone: "(16) 99922-2222" },
    { id: 3, nome: "Roberto Costa", cpf: "333.444.555-66", telefone: "(17) 99933-3333" }
  ],
  transferencias: []
};

// Rota de Leitura
app.get('/api/data', async (req, res) => {
  try {
    const { data, error } = await supabase.from('app_data').select('content').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error;
    
    return res.json(data ? data.content : defaultData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Rota de Escrita
app.post('/api/save', async (req, res) => {
  try {
    const { error } = await supabase
      .from('app_data')
      .upsert({ id: 1, content: req.body });

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = app;