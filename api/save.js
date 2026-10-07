// Dados padrão inicial quando não houver nada salvo
const defaultData = {
  motoristas: [
    { id: 1, nome: "João Silva", cpf: "111.222.333-44", telefone: "(16) 99911-1111" },
    { id: 2, nome: "Marcos Oliveira", cpf: "222.333.444-55", telefone: "(16) 99922-2222" },
    { id: 3, nome: "Roberto Costa", cpf: "333.444.555-66", telefone: "(17) 99933-3333" }
  ],
  transferencias: []
};

// Função para CARREGAR os dados do Firebase ao abrir a página
async function loadData() {
  try {
    const doc = await window.db.collection('app_data').doc('main').get();
    if (doc.exists) {
      return doc.data();
    } else {
      // Se ainda não existir no Firebase, guarda o estado padrão
      await saveData(defaultData);
      return defaultData;
    }
  } catch (err) {
    console.error('Erro ao carregar do Firebase:', err);
    return defaultData;
  }
}

// Função para SALVAR os dados no Firebase sempre que algo for alterado
async function saveData(appData) {
  try {
    await window.db.collection('app_data').doc('main').set(appData);
    console.log('Dados gravados no Firebase com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar no Firebase:', err);
  }
}