import React, { useState, useEffect } from "react";

const NovosTable = () => {
  // Carrega os dados do localStorage ou inicia com um array vazio
  const [novosRegistros, setNovosRegistros] = useState(() => {
    const dadosSalvos = localStorage.getItem("novosTableDados");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // Sempre que novosRegistros mudar, salvamos no localStorage
  useEffect(() => {
    localStorage.setItem("novosTableDados", JSON.stringify(novosRegistros));
  }, [novosRegistros]);

  // Adiciona uma nova linha vazia na tabela
  const adicionarNovaLinha = () => {
    setNovosRegistros((prevRegistros) => [
      ...prevRegistros,
      {
        nome: "",
        registro: "",
        matricula: "",
        tipo: "",
        nacionalidade: "",
        mestre: "",
        ilha: "",
        licenca: "",
        data: "",
        hora: "",
        task: "",
        latitude: "",
        longitude: "",
        situacao: "",
        infracao: "",
        medidas: "",
        agencias: "",
        obs: "",
      },
    ]);
  };

  // Atualiza o valor digitado pelo usuário na célula correspondente
  const atualizarCampo = (index, campo, valor) => {
    setNovosRegistros((prevRegistros) => {
      const novosDados = [...prevRegistros];
      novosDados[index][campo] = valor;
      return novosDados;
    });
  };

  // Remove uma linha específica
  const excluirLinha = (index) => {
    setNovosRegistros((prevRegistros) =>
      prevRegistros.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="table-wrapper naviotable">
      <button onClick={adicionarNovaLinha}>Adicionar Nova Embarcação</button>

      {novosRegistros.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Nome da Embarcação</th>
              <th>Nº Registo/IMO</th>
              <th>Nº Matrícula/MMSI</th>
              <th>Tipo de Embarcação</th>
              <th>Nacionalidade</th>
              <th>Nome do Mestre</th>
              <th>Ilha</th>
              <th>Licença</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {novosRegistros.map((registro, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td><input type="text" value={registro.nome} onChange={(e) => atualizarCampo(index, "nome", e.target.value)} /></td>
                  <td><input type="text" value={registro.registro} onChange={(e) => atualizarCampo(index, "registro", e.target.value)} /></td>
                  <td><input type="text" value={registro.matricula} onChange={(e) => atualizarCampo(index, "matricula", e.target.value)} /></td>
                  <td><input type="text" value={registro.tipo} onChange={(e) => atualizarCampo(index, "tipo", e.target.value)} /></td>
                  <td><input type="text" value={registro.nacionalidade} onChange={(e) => atualizarCampo(index, "nacionalidade", e.target.value)} /></td>
                  <td><input type="text" value={registro.mestre} onChange={(e) => atualizarCampo(index, "mestre", e.target.value)} /></td>
                  <td><input type="text" value={registro.ilha} onChange={(e) => atualizarCampo(index, "ilha", e.target.value)} /></td>
                  <td><input type="text" value={registro.licenca} onChange={(e) => atualizarCampo(index, "licenca", e.target.value)} /></td>
                  <td>
                    <button onClick={() => excluirLinha(index)}>
                      <span role="img" aria-label="Excluir">❌</span>
                    </button>
                  </td>
                </tr>

                <tr>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Tipo de Task</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Situação</th>
                  <th>Tipo de Infração</th>
                  <th>Medidas Tomadas</th>
                  <th>Observações</th>
                </tr>

                <tr>
                  <td><input type="text" value={registro.data} onChange={(e) => atualizarCampo(index, "data", e.target.value)} /></td>
                  <td><input type="text" value={registro.hora} onChange={(e) => atualizarCampo(index, "hora", e.target.value)} /></td>
                  <td><input type="text" value={registro.task} onChange={(e) => atualizarCampo(index, "task", e.target.value)} /></td>
                  <td><input type="text" value={registro.latitude} onChange={(e) => atualizarCampo(index, "latitude", e.target.value)} /></td>
                  <td><input type="text" value={registro.longitude} onChange={(e) => atualizarCampo(index, "longitude", e.target.value)} /></td>
                  <td><input type="text" value={registro.situacao} onChange={(e) => atualizarCampo(index, "situacao", e.target.value)} /></td>
                  <td><input type="text" value={registro.infracao} onChange={(e) => atualizarCampo(index, "infracao", e.target.value)} /></td>
                  <td><input type="text" value={registro.medidas} onChange={(e) => atualizarCampo(index, "medidas", e.target.value)} /></td>
                  <td><input type="text" value={registro.obs} onChange={(e) => atualizarCampo(index, "obs", e.target.value)} /></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NovosTable;
