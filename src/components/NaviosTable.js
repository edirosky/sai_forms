import React from "react";

const NaviosTable = ({ dadosFiltrados = [], adicionarAoDadostable, handleFiltroChange }) => {
  if (!dadosFiltrados || dadosFiltrados.length === 0) {
    return <p>Lista de navios sendo carregada, aguarde...por favor!!!.</p>;
  }

  // A primeira linha é o cabeçalho e as demais são os dados
  const cabecalho = dadosFiltrados[0];
  const dados = dadosFiltrados.slice(1);

  return (
    <div className="naviostable">
      <div className="table-wrapper">

        <table>
          <thead>
            {/* Linha de cabeçalho com os nomes das colunas */}
            <tr>
              <th>Ação</th>
              {cabecalho.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
            {/* Linha de filtros */}
            <tr>
              <th></th>
              {cabecalho.map((_, index) => (
                <th key={index}>
                  <input
                    type="text"
                    placeholder="Filtrar"
                    onChange={(e) => handleFiltroChange(e, index)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.map((linha, i) => (
              <tr key={i}>
                <td>
                  <button onClick={() => adicionarAoDadostable(linha)}>
                    Escolher
                  </button>
                </td>
                {linha.map((celula, j) => (
                  <td key={j}>{celula}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NaviosTable;
