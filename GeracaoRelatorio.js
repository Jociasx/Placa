import React, { useState } from 'react';
import axios from 'axios';

function GeracaoRelatorio() {
  const [cidade, setCidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  const gerarRelatorio = async () => {
    try {
      await axios.get(`/relatorio/cidade/${cidade}`);
      setMensagem('Relatório gerado com sucesso!');
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao gerar relatório');
    }
  };

  return (
    <div>
      <h1>Geração de Relatório</h1>
      <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
      <button onClick={gerarRelatorio}>Gerar Relatório</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default GeracaoRelatorio;
