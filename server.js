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

// Middleware para processar JSON
app.use(express.json());

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

app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = new Usuario({ email, senha });
    await usuario.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar usuário' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais incorretas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais incorretas' });
    }

    // Gere um token de autenticação (você pode usar JWT)
    const token = 'seu_token_de_autenticacao';

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

const jwt = require('jsonwebtoken');

// Middleware para verificar token
function verificaToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  jwt.verify(token, 'seu_segredo', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    next();
  });
}

app.get('/consulta/:placa', verificaToken, async (req, res) => {
  // Rota protegida por token
  // ...
});

app.get('/relatorio/cidade/:cidade', verificaToken, async (req, res) => {
  // Rota protegida por token
  // ...
});

app.post('/alerta', verificaToken, async (req, res) => {
  // Rota protegida por token
  // ...
});

app.post('/alerta', verificaToken, async (req, res) => {
  const mensagem = 'Inconsistência de dados ou equipamentos foram detectados no sistema';

  // Emita notificação para todos os usuários conectados (use WebSockets ou outra tecnologia apropriada)
  // ...

  res.json({ message: 'Alerta enviado com sucesso!' });
});

