import React, { useState } from "react";
import { LocalizacaoGGLatitude, LocalizacaoGGLongitude } from "./LocalizacaoGG";
import { LocalizacaoGGMMLatitude, LocalizacaoGGMMLongitude } from "./LocalizacaoGGMM";
import { LocalizacaoGGMMSSLatitude, LocalizacaoGGMMSSLongitude } from "./LocalizacaoGGMMSS";




const DadosTable = ({
  dadosSelecionados,
  handleCellEdit,
  updateCellValue,
  updateRowDisabled,
  removerLinha,
  activeLocationFormat,       // "GG", "GGMM" ou "GGMMSS"
  setActiveLocationFormat,    // Função para alterar o formato ativo
  setDadosSelecionados,       // Função para atualizar todos os registros
  tipoInfracaoOptions,  
  config_DadosTable      // Array de objetos: { value, description }
}) => {
  if (!dadosSelecionados.length)
    return (
      <p>
        Nenhuma embarcação selecionada. Use o filtro para buscar por embarcação e clique "ESCOLHER" para inserir a Embarcação!
      </p>
    );

  // Função para alternar o modelo de posição e converter os valores existentes
  const toggleModel = () => {
    const cycleFormat = (currentFormat) => {
      switch (currentFormat) {
        case "GG":
          return "GGMM";
        case "GGMM":
          return "GGMMSS";
        case "GGMMSS":
          return "GG";
        default:
          return "GG";
      }
    };
  
    const newFormat = cycleFormat(activeLocationFormat);
  
    const parseCoordinateDigit = (value, format, isLatitude) => {
      if (!value || value.trim() === "") return null;
      let trimmed = value.trim().replace(/\D/g, ''); // Remove todos os não dígitos
  
      if (format === "GG") {
        const degDigits = isLatitude ? 2 : 3;
        const expectedLength = degDigits + 6;
        if (trimmed.length < expectedLength) {
          trimmed = trimmed.padStart(expectedLength, "0");
        }
        if (trimmed.length !== expectedLength) return null;
        
        const deg = parseInt(trimmed.substring(0, degDigits), 10);
        const frac = parseInt(trimmed.substring(degDigits), 10) / 1e6;
        return deg + frac;
  
      } else if (format === "GGMM") {
        const degDigits = isLatitude ? 2 : 3;
        const expectedLength = degDigits + 4;
        if (trimmed.length < expectedLength) {
          trimmed = trimmed.padStart(expectedLength, "0");
        }
        if (trimmed.length !== expectedLength) return null;
        
        const deg = parseInt(trimmed.substring(0, degDigits), 10);
        const minInt = parseInt(trimmed.substring(degDigits, degDigits + 2), 10);
        const minFrac = parseInt(trimmed.substring(degDigits + 2), 10) / 100;
        return deg + (minInt + minFrac) / 60;
  
      } else if (format === "GGMMSS") {
        const degDigits = isLatitude ? 2 : 3;
        const expectedLength = degDigits + 4;
        if (trimmed.length < expectedLength) {
          trimmed = trimmed.padStart(expectedLength, "0");
        }
        if (trimmed.length !== expectedLength) return null;
        
        const deg = parseInt(trimmed.substring(0, degDigits), 10);
        const min = parseInt(trimmed.substring(degDigits, degDigits + 2), 10);
        const sec = parseInt(trimmed.substring(degDigits + 2), 10);
        return deg + min / 60 + sec / 3600;
      }
      return null;
    };
  
    const formatCoordinateDigit = (decimal, targetFormat, isLatitude) => {
      if (decimal === null) return "";
      
      if (targetFormat === "GG") {
        let deg = Math.floor(decimal);
        let frac = Math.round((decimal - deg) * 1e6);
        
        // Ajuste de overflow
        if (frac === 1e6) {
          frac = 0;
          deg += 1;
        }
        
        const degDigits = isLatitude ? 2 : 3;
        return `${String(deg).padStart(degDigits, "0")},${String(frac).padStart(6, "0")}`;
  
      } else if (targetFormat === "GGMM") {
        let deg = Math.floor(decimal);
        let minutes = (decimal - deg) * 60;
        let minInt = Math.floor(minutes);
        let minFrac = Math.round((minutes - minInt) * 100);
  
        // Ajuste de overflow
        if (minFrac >= 100) {
          minFrac -= 100;
          minInt += 1;
          if (minInt >= 60) {
            minInt -= 60;
            deg += 1;
          }
        }
        
        const degDigits = isLatitude ? 2 : 3;
        return `${String(deg).padStart(degDigits, "0")} ${String(minInt).padStart(2, "0")},${String(minFrac).padStart(2, "0")}`;
  
      } else if (targetFormat === "GGMMSS") {
        let deg = Math.floor(decimal);
        let minutesTotal = (decimal - deg) * 60;
        let min = Math.floor(minutesTotal);
        let sec = Math.round((minutesTotal - min) * 60);
  
        // Ajuste de overflow
        if (sec === 60) {
          sec = 0;
          min += 1;
          if (min === 60) {
            min = 0;
            deg += 1;
          }
        }
        
        const degDigits = isLatitude ? 2 : 3;
        return `${String(deg).padStart(degDigits, "0")} ${String(min).padStart(2, "0")} ${String(sec).padStart(2, "0")}`;
      }
      return "";
    };
  
    const updatedRows = dadosSelecionados.map((row) => {
      const latDecimal = parseCoordinateDigit(row.latitude, activeLocationFormat, true);
      const lonDecimal = parseCoordinateDigit(row.longitude, activeLocationFormat, false);
      const newLat = formatCoordinateDigit(latDecimal, newFormat, true);
      const newLon = formatCoordinateDigit(lonDecimal, newFormat, false);
      return { ...row, latitude: newLat, longitude: newLon };
    });
  
    setDadosSelecionados(updatedRows);
    setActiveLocationFormat(newFormat);
  };

  // Estilo para os campos com área de texto (Medidas Tomadas, OBS)
  const textAreaStyle = {
    minWidth: "150px",
    maxWidth: "300px",
    minHeight: "50px",
    maxHeight: "150px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all"
  };

  // Componente customizado para dropdown multi-seleção com checkboxes e tooltip
  const MultiSelectDropdown = ({ value, options, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleCheckboxChange = (e) => {
      const optionValue = e.target.value;
      let newValue;
      if (e.target.checked) {
        newValue = [...value, optionValue];
      } else {
        newValue = value.filter((v) => v !== optionValue);
      }
      onChange(newValue);
    };

    // Exibe os valores selecionados como uma lista separada por vírgula
    const selectedText = options
      .filter((option) => value.includes(option.value))
      .map((option) => option.value)
      .join(", ");

    return (
      <div className="multi-select-dropdown" style={{ position: "relative", width: "200px" }}>
        <div
          onClick={toggleDropdown}
          style={{
            border: "1px solid #ccc",
            padding: "5px",
            cursor: disabled ? "not-allowed" : "pointer",
            backgroundColor: disabled ? "#f5f5f5" : "white"
          }}
        >
          {selectedText || "Selecione..."}
        </div>
        {isOpen && (
          <div
            className="dropdown-options"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              border: "1px solid #ccc",
              backgroundColor: "white",
              zIndex: 1000,
              maxHeight: "150px",
              overflowY: "auto"
            }}
          >
            {options.map((option) => (
              <label
                key={option.value}
                title={option.description} // Exibe a descrição como tooltip
                style={{ display: "block", padding: "5px", cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={value.includes(option.value)}
                  onChange={handleCheckboxChange}
                />
                {" "}{option.value}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dadostable">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {/* Apenas as colunas que devem ser exibidas */}
              <th>Nome da Embarcação</th>
              <th>Nº Registo/IMO</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Tipo de Task</th>
              {/* Botão para alternar modelo de posição */}
              <th colSpan="2">
                <button onClick={toggleModel}>
                  ALTERNAR FORMATO POSIÇÕES, selecionado: {activeLocationFormat}
                </button>
                <br />
                Latitude / Longitude
              </th>
              <th>Situação</th>
              <th>Tipo de Infração</th>
              <th>Medidas Tomadas</th>
              <th>OBS</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dadosSelecionados.map((dado, rowIndex) => (
              <tr key={rowIndex}>
                {/* Apenas as colunas que devem ser exibidas */}
                <td>{dado.nomeEmbarcacao}</td>
                <td>{dado.numRegisto}</td>
                <td>
                  <input
                    type="date"
                    value={dado.data}
                    onChange={(e) => updateCellValue(rowIndex, "data", e.target.value)}
                    disabled={dado.disabled}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={dado.hora}
                    onChange={(e) => updateCellValue(rowIndex, "hora", e.target.value)}
                    disabled={dado.disabled}
                  />
                </td>
                <td>
                  {dado.disabled ? (
                    <span>{dado.tipoDeTask}</span>
                  ) : (
                    <select
                      value={dado.tipoDeTask}
                      onChange={(e) => updateCellValue(rowIndex, "tipoDeTask", e.target.value)}
                      disabled={dado.disabled}
                    >
                      <option value="">Selecione...</option>
                      <option value="Abordado">Abordado</option>
                      <option value="Avistado">Avistado</option>
                      <option value="Investigado">Investigado</option>
                    </select>
                  )}
                </td>
                {/* Coluna para Latitude */}
                <td>
                  {activeLocationFormat === "GG" ? (
                    <LocalizacaoGGLatitude
                      value={dado.latitude || ""}
                      onChange={(e) => updateCellValue(rowIndex, "latitude", e.target.value)}
                      disabled={dado.disabled}
                    />
                  ) : activeLocationFormat === "GGMM" ? (
                    <LocalizacaoGGMMLatitude
                      value={dado.latitude || ""}
                      onChange={(e) => updateCellValue(rowIndex, "latitude", e.target.value)}
                      disabled={dado.disabled}
                    />
                  ) : activeLocationFormat === "GGMMSS" ? (
                    <LocalizacaoGGMMSSLatitude
                      value={dado.latitude || ""}
                      onChange={(e) => updateCellValue(rowIndex, "latitude", e.target.value)}
                      disabled={dado.disabled}
                    />
                  ) : (
                    <input
                      type="text"
                      value=""
                      disabled
                      placeholder="Inativo"
                      style={{ width: "80px" }}
                    />
                  )}
                </td>
                {/* Coluna para Longitude */}
                <td>
                  {activeLocationFormat === "GG" ? (
                    <LocalizacaoGGLongitude
                      value={dado.longitude || ""}
                      onChange={(e) => updateCellValue(rowIndex, "longitude", e.target.value)}
                      disabled={dado.disabled}
                    />
                  ) : activeLocationFormat === "GGMM" ? (
                    <LocalizacaoGGMMLongitude
                      value={dado.longitude || ""}
                      onChange={(e) => updateCellValue(rowIndex, "longitude", e.target.value)}
                      disabled={dado.disabled}
                    />
                  ) : activeLocationFormat === "GGMMSS" ? (
                    <LocalizacaoGGMMSSLongitude
                      value={dado.longitude || ""}
                      onChange={(e) => updateCellValue(rowIndex, "longitude", e.target.value)}
                      disabled={dado.disabled}
                    />
                  ) : (
                    <input
                      type="text"
                      value=""
                      disabled
                      placeholder="Inativo"
                      style={{ width: "80px" }}
                    />
                  )}
                </td>
                {/* Dropdown para Situação */}
                <td>
                  {dado.disabled ? (
                    <span>{dado.situacao}</span>
                  ) : (
                    <select
                      value={dado.situacao}
                      onChange={(e) => updateCellValue(rowIndex, "situacao", e.target.value)}
                      disabled={dado.disabled}
                    >
                      <option value="">Selecione...</option>
                      <option value="Irregular">Irregular</option>
                      <option value="Ilegal">Ilegal</option>
                      <option value="Legal">Legal</option>
                    </select>
                  )}
                </td>
                {/* Coluna para Tipo de Infração */}
                <td>
                  {dado.disabled ? (
                    <span>
                      {Array.isArray(dado.tipoInfracao)
                        ? dado.tipoInfracao.join(", ")
                        : dado.tipoInfracao}
                    </span>
                  ) : (
                    <MultiSelectDropdown
                      value={Array.isArray(dado.tipoInfracao) ? dado.tipoInfracao : []}
                      options={tipoInfracaoOptions}
                      onChange={(selectedValues) =>
                        updateCellValue(rowIndex, "tipoInfracao", selectedValues)
                      }
                      disabled={dado.disabled}
                    />
                  )}
                </td>
                {/* Coluna para Medidas Tomadas */}
                <td>
  {dado.disabled ? (
    <span>{dado.medidasTomadas || "Nenhuma medida tomada."}</span>
  ) : (
    <select
      value={dado.medidasTomadas || ""}
      onChange={(e) => updateCellValue(rowIndex, "medidasTomadas", e.target.value)}
      disabled={dado.disabled}
    >
      <option value="">Selecione...</option>
      {config_DadosTable?.medidasTomadasOptions?.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  )}
</td>

               {/* Coluna para OBS */}
                <td>
                  <textarea
                    value={dado.observacoes}
                    onChange={(e) => updateCellValue(rowIndex, "observacoes", e.target.value)}
                    disabled={dado.disabled}
                    style={textAreaStyle}
                    rows={3}
                  />
                </td>
                {/* Coluna para Ações */}
                <td>
                  <button onClick={() => updateRowDisabled(rowIndex, !dado.disabled)}>
                    {dado.disabled ? "Editar" : "Pronto"}
                  </button>
                  <button onClick={() => removerLinha(rowIndex)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DadosTable;
