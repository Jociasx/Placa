//Backend (Node.js com Express):
// Importe as dependências necessárias
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const tesseract = require('tesseract.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Configurações básicas
const app = express();
const port = process.env.PORT || 3000;
const mongodbURI = 'mongodb://localhost/meu_banco_de_dados';

// Conexão com o MongoDB
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Defina o esquema do MongoDB para armazenar os registros
const registroSchema = new mongoose.Schema({
  placa: String,
  cidade: String,
  dataHora: Date,
});

const Registro = mongoose.model('Registro', registroSchema);

// Configuração do multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota para cadastro de placa com OCR
app.post('/cadastroPlaca', upload.single('imagem'), async (req, res) => {
  try {
    const { cidade } = req.body;
    
    // Realize o OCR na imagem
    const { data: { text } } = await tesseract.recognize(req.file.buffer);

    // Crie um novo registro no banco de dados
    const registro = new Registro({
      placa: text,
      cidade,
      dataHora: new Date(),
    });

    await registro.save();

    res.json({ message: 'Placa cadastrada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar placa' });
  }
});

// Rota para gerar relatório em PDF
app.get('/relatorio/cidade/:cidade', async (req, res) => {
  const cidade = req.params.cidade;

  try {
    const registros = await Registro.find({ cidade });

    // Crie um novo documento PDF
    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream('relatorio.pdf'));

    // Escreva os dados no PDF
    pdf.text('Relatório de Placas');
    registros.forEach((registro) => {
      pdf.text(`Placa: ${registro.placa}, Cidade: ${registro.cidade}, Data/Hora: ${registro.dataHora}`);
    });

    pdf.end();
    
    res.download('relatorio.pdf');
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// Rota para consultar placa
app.get('/consulta/:placa', async (req, res) => {
  const placa = req.params.placa;

  try {
    const registro = await Registro.findOne({ placa });

    if (registro) {
      res.json({ message: 'Placa encontrada!' });
    } else {
      res.status(404).json({ error: 'Placa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar placa' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
  // Outros campos do usuário
});

// Antes de salvar, criptografe a senha
usuarioSchema.pre('save', async function (next) {
  const usuario = this;
  if (usuario.isModified('senha')) {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
  }
  next();
});

