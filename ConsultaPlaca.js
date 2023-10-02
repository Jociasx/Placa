import React, { useState } from 'react';
import axios from 'axios';

function ConsultaPlaca() {
  const [placa, setPlaca] = useState('');
  const [mensagem, setMensagem] = useState('');

  const consultarPlaca = async () => {
    try {
      const response = await axios.get(`/consulta/${placa}`);
      setMensagem(response.data.message);
    } catch (error) {
      console.error(error);
      setMensagem('Placa não encontrada');
    }
  };

  return (
    <div>
      <h1>Consulta de Placa</h1>
      <input type="text" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
      <button onClick={consultarPlaca}>Consultar Placa</button>
      <p>{mensagem}</p>
    </div>
  );
}

export default ConsultaPlaca;
