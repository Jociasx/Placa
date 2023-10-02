import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [cidade, setCidade] = useState('');
  const [imagem, setImagem] = useState(null);
  const [placa, setPlaca] = useState('');
  const [consultaPlaca, setConsultaPlaca] = useState('');
  const [relatorioCidade, setRelatorioCidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  const cadastrarPlaca = async () => {
    try {
      const formData = new FormData();
      formData.append('cidade', cidade);
      formData.append('imagem', imagem);

      await axios.post('/cadastroPlaca', formData);

      setMensagem('Placa cadastrada com sucesso!');
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao cadastrar placa');
    }
  };

  const consultarPlaca = async () => {
    try {
      const response = await axios.get(`/consulta/${consultaPlaca}`);
      setPlaca(response.data.message);
    } catch (error) {
      console.error(error);
      setPlaca('Placa não encontrada');
    }
  };

  const gerarRelatorio = async () => {
    try {
      await axios.get(`/relatorio/cidade/${relatorioCidade}`);
      setMensagem('Relatório gerado com sucesso!');
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao gerar relatório');
    }
  };

  return (
    <div>
      <h1>Cadastro de Placa</h1>
      <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
      <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
      <button onClick={cadastrarPlaca}>Cadastrar Placa</button>
      <p>{mensagem}</p>

      <h1>Consulta de Placa</h1>
      <input type="text" placeholder="Placa" value={consultaPlaca} onChange={(e) => setConsultaPlaca(e.target.value)} />
      <button onClick={consultarPlaca}>Consultar Placa</button>
      <p>{placa}</p>

      <h1>Relatório de Cidade</h1>
      <input type="text" placeholder="Cidade" value={relatorioCidade} onChange={(e) => setRelatorioCidade(e.target.value)} />
      <button onClick={gerarRelatorio}>Gerar Relatório</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default App;
