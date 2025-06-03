import React, { useState, useEffect } from "react";

const NovosTable = () => {
  const [novosRegistros, setNovosRegistros] = useState(() => {
    const dadosSalvos = localStorage.getItem("novosTableDados");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [opcoesNacionalidade, setOpcoesNacionalidade] = useState([]);
  const [opcoesTipo, setOpcoesTipo] = useState([]);
  const [opcoesIlha, setOpcoesIlha] = useState([]);

  useEffect(() => {
    localStorage.setItem("novosTableDados", JSON.stringify(novosRegistros));
  }, [novosRegistros]);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmY3QHsDgxr-YD_5pvQla3QqEv54ek8sqB1HolsYgfOaFpTT7huZI-E7EVtt_TV0hD0Jq52j46y4vn/pub?gid=481503026&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split("\n");
        const nacionalidadeSet = new Set();
        const tipoSet = new Set();
        const ilhaSet = new Set();

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row[0]) nacionalidadeSet.add(row[0].trim());
          if (row[10]) tipoSet.add(row[10].trim());
          if (row.length > 11 && row[11]) ilhaSet.add(row[11].trim());
        }

        setOpcoesNacionalidade(Array.from(nacionalidadeSet));
        setOpcoesTipo(Array.from(tipoSet));
        setOpcoesIlha(Array.from(ilhaSet));
      })
      .catch((error) => console.error("Erro ao carregar CSV", error));
  }, []);

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
      },
    ]);
  };

  const atualizarCampo = (index, campo, valor) => {
    setNovosRegistros((prevRegistros) => {
      const novosDados = [...prevRegistros];
      novosDados[index][campo] = valor;
      return novosDados;
    });
  };

  const excluirLinha = (index) => {
    setNovosRegistros((prevRegistros) =>
      prevRegistros.filter((_, i) => i !== index)
    );
  };

  const enviarParaGoogleSheets = async () => {
    const registrosValidos = novosRegistros.filter(
      (registro) => registro.nome.trim() !== "" && registro.tipo.trim() !== ""
    );

    if (registrosValidos.length === 0) {
      alert("Nenhum registro válido. Preencha pelo menos os campos Nome e Tipo.");
      return;
    }

    const endpoint =
      "https://script.google.com/macros/s/AKfycbyJkfM9VZ3ebJFf5mxe0n7A_PA4erMBgUXu7RcFx6jyQ2C-J6XixuytvJgjS9VsXVuTHg/exec";
    
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrosValidos),
      });

      alert("Dados atualizados com sucesso!");
      setNovosRegistros([]);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao atualizar os dados:", error);
      alert("Houve um erro ao atualizar os dados.");
    }
  };

  return (
    <div className="table-wrapper">
      
      <button onClick={adicionarNovaLinha}>Adicionar Nova Embarcação</button>
      <button onClick={enviarParaGoogleSheets} style={{ marginLeft: "20px" }}>
        Atualizar Lista de Navios
      </button>

      {novosRegistros.length > 0 && (
        <table border="1">
          <thead>
            <tr style={{ backgroundColor: "#06a536", color: "white" }}>
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
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={registro.nome}
                    onChange={(e) =>
                      atualizarCampo(index, "nome", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={registro.registro}
                    onChange={(e) =>
                      atualizarCampo(index, "registro", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={registro.matricula}
                    onChange={(e) =>
                      atualizarCampo(index, "matricula", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={registro.tipo}
                    onChange={(e) =>
                      atualizarCampo(index, "tipo", e.target.value)
                    }
                  >
                    <option value="">Selecione...</option>
                    {opcoesTipo.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={registro.nacionalidade}
                    onChange={(e) =>
                      atualizarCampo(index, "nacionalidade", e.target.value)
                    }
                  >
                    <option value="">Selecione...</option>
                    {opcoesNacionalidade.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={registro.mestre}
                    onChange={(e) =>
                      atualizarCampo(index, "mestre", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={registro.ilha}
                    onChange={(e) =>
                      atualizarCampo(index, "ilha", e.target.value)
                    }
                  >
                    <option value="">Selecione...</option>
                    {opcoesIlha.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={registro.licenca}
                    onChange={(e) =>
                      atualizarCampo(index, "licenca", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => excluirLinha(index)}>
                    <span role="img" aria-label="Excluir">❌</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NovosTable;
