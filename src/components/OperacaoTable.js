import React from "react";

const OperacaoTable = ({
  dadosOperacao = [], // Garante um array padrão para evitar erros de índice
  config = {},       // Configuração com as opções
  automaticEntidades = [],
  handleOperacaoChange,
}) => {
  // Desestruturação segura das configurações
  const {
    operacoes = [],
    entidades = [],
    tiposEntidade = [],
    nacionalidadeEntidade = [],
  } = config;

  // Função para determinar as configurações automáticas para Tipo e Nacionalidade
  const getAutoSettings = (selectedValue) => {
    // Se a entidade for "OUTRO", não aplica a configuração automática
    if (selectedValue === "OUTRO") {
      return { disableAuto: false, tipo: "", nacionalidade: "" };
    }
    // Procura o índice da entidade selecionada na lista de entidades
    const idx = entidades.indexOf(selectedValue);
    if (idx !== -1 && automaticEntidades[idx]) {
      const autoValue = automaticEntidades[idx];
      if (autoValue === "SIM/NAVIO") {
        return { disableAuto: true, tipo: "NAVIO", nacionalidade: "Cabo Verde" };
      } else if (autoValue === "SIM/AERONAVE") {
        return { disableAuto: true, tipo: "AERONAVE", nacionalidade: "Cabo Verde" };
      }
    }
    return { disableAuto: false, tipo: "", nacionalidade: "" };
  };

  // Calcula as configurações com base na entidade selecionada
  const { disableAuto, tipo: computedTipo, nacionalidade: computedNacionalidade } =
    dadosOperacao[1] ? getAutoSettings(dadosOperacao[1]) : { disableAuto: false, tipo: "", nacionalidade: "" };

  // Função para tratar a mudança no dropdown de Entidade
  const onEntidadeChange = (e) => {
    const selectedValue = e.target.value;
    // Atualiza a entidade (índice 1)
    handleOperacaoChange(e, 1);

    // Obtém as configurações automáticas com base na entidade selecionada
    const { disableAuto, tipo, nacionalidade } = getAutoSettings(selectedValue);
    if (disableAuto) {
      // Se houver configuração automática, atualiza os índices correspondentes
      handleOperacaoChange({ target: { value: tipo } }, 3);
      handleOperacaoChange({ target: { value: nacionalidade } }, 4);
    } else {
      // Se for "OUTRO", limpa os campos (ou permite que sejam escolhidos manualmente)
      handleOperacaoChange({ target: { value: "" } }, 3);
      handleOperacaoChange({ target: { value: "" } }, 4);
    }
  };

  return (
    <div className="operacaotable">
      <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Operação</th>
          <th>Entidade</th>
          <th>Nome da Entidade</th>
          <th>Tipo de Entidade</th>
          <th>Nacionalidade de Entidade</th>
          <th>Outras Agências</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Operação */}
          <td>
            <select
              value={dadosOperacao[0] || ""}
              onChange={(e) => handleOperacaoChange(e, 0)}
            >
              <option value="">Selecione</option>
              {operacoes.map((opcao, i) => (
                <option key={i} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </td>

          {/* Entidade */}
          <td>
            <select value={dadosOperacao[1] || ""} onChange={onEntidadeChange}>
              <option value="">Selecione</option>
              {entidades.map((opcao, i) => (
                <option key={i} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </td>

          {/* Nome da Entidade */}
          <td>
            <input
              type="text"
              value={dadosOperacao[2] || ""}
              onChange={(e) => handleOperacaoChange(e, 2)}
              placeholder="Informe Nome"
              disabled={dadosOperacao[1] !== "OUTRO"}
            />
          </td>

          {/* Tipo de Entidade */}
          <td>
            {disableAuto ? (
              // Campo bloqueado com valor pré-definido
              <input type="text" value={computedTipo} readOnly disabled />
            ) : (
              // Permite seleção manual (caso não haja configuração automática)
              <select
                value={dadosOperacao[3] || ""}
                onChange={(e) => handleOperacaoChange(e, 3)}
              >
                <option value="">Selecione</option>
                {tiposEntidade.map((opcao, i) => (
                  <option key={i} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            )}
          </td>

          {/* Nacionalidade de Entidade */}
          <td>
            {disableAuto ? (
              // Campo bloqueado com valor pré-definido
              <input type="text" value={computedNacionalidade} readOnly disabled />
            ) : (
              // Permite seleção manual
              <select
                value={dadosOperacao[4] || ""}
                onChange={(e) => handleOperacaoChange(e, 4)}
              >
                <option value="">Selecione</option>
                {nacionalidadeEntidade.map((opcao, i) => (
                  <option key={i} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            )}
          </td>

          {/* Outras Agências */}
          <td>
            <input
              type="text"
              value={dadosOperacao[5] || ""}
              onChange={(e) => handleOperacaoChange(e, 5)}
              placeholder="Informe outras agências"
            />
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    </div>

  );
};

export default OperacaoTable;
