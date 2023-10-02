import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CadastroPlaca from './components/CadastroPlaca';
import ConsultaPlaca from './components/ConsultaPlaca';
import GeracaoRelatorio from './components/GeracaoRelatorio';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/cadastro-placa">Cadastro de Placa</Link>
          </li>
          <li>
            <Link to="/consulta-placa">Consulta de Placa</Link>
          </li>
          <li>
            <Link to="/geracao-relatorio">Geração de Relatório</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/cadastro-placa">
          <CadastroPlaca />
        </Route>
        <Route path="/consulta-placa">
          <ConsultaPlaca />
        </Route>
        <Route path="/geracao-relatorio">
          <GeracaoRelatorio />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
