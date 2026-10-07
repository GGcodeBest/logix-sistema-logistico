// Rota para LER os dados do Supabase
app.get('/api/data', async (req, res) => {
  try {
    const { data, error } = await supabase.from('app_data').select('content').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error;
    
    return res.json(data ? data.content : defaultData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Rota para SALVAR os dados no Supabase
app.post('/api/save', async (req, res) => {
  try {
    const bodyData = req.body;
    const { error } = await supabase
      .from('app_data')
      .upsert({ id: 1, content: bodyData });

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}); 