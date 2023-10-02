import React, { useState } from 'react';
import axios from 'axios';

function CadastroPlaca() {
  const [cidade, setCidade] = useState('');
  const [imagem, setImagem] = useState(null);
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

  return (
    <div>
      <h1>Cadastro de Placa</h1>
      <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
      <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
      <button onClick={cadastrarPlaca}>Cadastrar Placa</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default CadastroPlaca;
