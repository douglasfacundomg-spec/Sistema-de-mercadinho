// index.js - Servidor Back-end com Express e Mongoose
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB utilizando Mongoose
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Exemplo de Schema e Model simples (você pode alterar conforme sua necessidade)
const ExemploSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

const ExemploModel = mongoose.model('Exemplo', ExemploSchema);

// Rota de Teste / API básica
app.get('/api', async (req, res) => {
  try {
    const dados = await ExemploModel.find();
    res.json({ mensagem: 'API funcionando!', dados });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar dados do banco.' });
  }
});

app.post('/api', async (req, res) => {
  try {
    const novoDado = new ExemploModel({ nome: req.body.nome });
    await novoDado.save();
    res.status(201).json({ mensagem: 'Salvo com sucesso!', novoDado });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao salvar dado.' });
  }
});

// Rota para atualizar um item pelo ID
app.put('/api/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const itemAtualizado = await ExemploModel.findByIdAndUpdate(
      id, 
      { nome }, 
      { new: true } // Retorna o documento já atualizado
    );

    if (!itemAtualizado) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    res.json({ mensagem: 'Item atualizado com sucesso!', itemAtualizado });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar o item.' });
  }
});


// Rota para deletar um item pelo ID
app.delete('/api/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const itemDeletado = await ExemploModel.findByIdAndDelete(id);
    
    if (!itemDeletado) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    res.json({ mensagem: 'Item excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir o item.' });
  }
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
