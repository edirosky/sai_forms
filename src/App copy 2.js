import React, { useEffect, useState } from "react";
import axios from "axios";
import OperacaoTable from "./components/OperacaoTable";
import NaviosTable from "./components/NaviosTable";
import DadosTable from "./components/DadosTable";
import NovosTable from "./components/NovosTable";

import "./App.css";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // Para exportação

import { useNavigate } from "react-router-dom";



const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6IEKVLswVSPSlD5qKBtbTqwj7ciZOhr40a84inuVTeeXIyC8KueX8IaVW2tILpaVxp5p2OsoxBi6g/pub?output=csv";
const GOOGLE_SHEET_CONFIG_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmY3QHsDgxr-YD_5pvQla3QqEv54ek8sqB1HolsYgfOaFpTT7huZI-E7EVtt_TV0hD0Jq52j46y4vn/pub?gid=481503026&single=true&output=csv";

function App() {





  // Estados com persistência via localStorage
  const [dadosOperacao, setDadosOperacao] = useState(() => {
    const saved = localStorage.getItem("dadosOperacao");
    return saved ? JSON.parse(saved) : ["", "", "", "", ""];
  });
  const [dadosSelecionados, setDadosSelecionados] = useState(() => {
    const saved = localStorage.getItem("dadosSelecionados");
    return saved ? JSON.parse(saved) : [];
  });
  const [dadosNavios, setDadosNavios] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Configurações para OperacaoTable
  const [config, setConfig] = useState({
    nacionalidadeEntidade: [],
    operacoes: [],
    entidades: [],
    automaticEntidades: [],
    tiposEntidade: [],
    situacoes: [],
    tiposEmbarcacao: [],
  });

  // Configurações para DadosTable
  const [config_DadosTable, setConfig_DadosTable] = useState({
    tipoInfracaoOptions: [],
    medidasTomadasOptions: [],
  });

  const [activeLocationFormat, setActiveLocationFormat] = useState(() => {
    return localStorage.getItem("activeLocationFormat") || "GG";
  });

  // Estado para exibir o modal da Lista de Infrações
  const [showInfractionsModal, setShowInfractionsModal] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await axios.get(GOOGLE_SHEET_CONFIG_URL);
        const parsed = Papa.parse(response.data, { header: false });
        const linhas = parsed.data;
        const dados = linhas.slice(1); // remove o cabeçalho
    
        // Configurações para OperacaoTable
        setConfig({
          nacionalidadeEntidade: dados.map((row) => row[0]).filter(Boolean),
          operacoes: dados.map((row) => row[2]).filter(Boolean),
          entidades: dados.map((row) => row[4]).filter(Boolean),
          automaticEntidades: dados.map((row) => row[3]).filter(Boolean), // Coluna D
          tiposEntidade: dados.map((row) => row[6]).filter(Boolean),
          situacoes: dados.map((row) => row[8]).filter(Boolean),
          tiposEmbarcacao: dados.map((row) => row[10]).filter(Boolean),
        });
    
        // Configurações para DadosTable
        setConfig_DadosTable({
          tipoInfracaoOptions: dados
            .map((row) =>
              row[12] && row[13] ? { value: row[12], description: row[13] } : null
            )
            .filter((item) => item !== null),
            medidasTomadasOptions: dados
  .map((row) => row[17] ? row[17].trim() : "")
  .filter(Boolean),

        
        });
      } catch (error) {
        console.error("Erro ao buscar configuração:", error);
        setError("Falha ao carregar configurações.");
      }
    }
  
    async function fetchNavios() {
      try {
        const response = await axios.get(GOOGLE_SHEET_URL);
        const linhasNavios = response.data.split("\n").map((linha) => linha.split(","));
        setDadosNavios(linhasNavios);
      } catch (error) {
        console.error("Erro ao buscar dados dos navios:", error);
        setError("Falha ao carregar dados dos navios.");
      }
    }
    Promise.all([fetchConfig(), fetchNavios()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("dadosOperacao", JSON.stringify(dadosOperacao));
  }, [dadosOperacao]);
  useEffect(() => {
    localStorage.setItem("dadosSelecionados", JSON.stringify(dadosSelecionados));
  }, [dadosSelecionados]);
  useEffect(() => {
    localStorage.setItem("activeLocationFormat", activeLocationFormat);
  }, [activeLocationFormat]);

  const handleFiltroChange = (e, colunaIndex) => {
    const valor = e.target.value;
    setFiltros((prev) => ({ ...prev, [colunaIndex]: valor }));
  };


  const dadosFiltrados = dadosNavios.filter((linha, i) => {
    if (i === 0) return true; // Cabeçalho permanece
    return linha.every((celula, j) => {
      const filtro = filtros[j];
      if (!filtro) return true;
      const valorCelula = celula ? String(celula).toLowerCase() : "";
      return valorCelula.includes(filtro.toLowerCase());
    });
  });


  const navigate = useNavigate();

  const adicionarAoDadostable = (linha) => {
    if (
      linha[0] &&
      linha[0].trim().toLowerCase() === "nome da embarcação".toLowerCase()
    ) {
      return;
    }
    setDadosSelecionados((prev) => [
      ...prev,
      {
        nomeEmbarcacao: linha[0],
        tipoDeTask: "",
        numRegisto: linha[1],
        numMatricula: linha[2],
        tipoEmbarcacao: linha[3],
        nacionalidade: linha[4],
        nomeMestre: linha[5],
        ilha: linha[6],
        licenca: linha[7],
        // Inicialmente, os campos de localização ficam vazios.
        localizacaoGG: "",
        localizacaoGGMM: "",
        localizacaoGGMMSS: "",
        // Utilizamos os campos latitude e longitude para a entrada do usuário.
        latitude: "",
        longitude: "",
        situacao: "",
        tipoInfracao: [], // Para multi-seleção
        medidasTomadas: "",
        observacoes: "",
        disabled: false,
        data: new Date().toISOString().substring(0, 10),
        hora: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
    ]);
  };








  const handleCellEdit = (e, rowIndex, cellKey) => {
    const novoValor = e.target.innerText;
    setDadosSelecionados((prev) => {
      const novosDados = [...prev];
      novosDados[rowIndex][cellKey] = novoValor;
      return novosDados;
    });
  };

  const updateCellValue = (rowIndex, field, value) => {
    setDadosSelecionados((prev) => {
      const novosDados = [...prev];
      novosDados[rowIndex][field] = value;
      return novosDados;
    });
  };

  const updateRowDisabled = (rowIndex, status) => {
    setDadosSelecionados((prev) => {
      const novosDados = [...prev];
      novosDados[rowIndex].disabled = status;
      return novosDados;
    });
  };

  const removerLinha = (rowIndex) => {
    setDadosSelecionados((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const resetarDados = () => {
    if (window.confirm("Tem certeza que deseja resetar os dados e começar do zero?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleOperacaoChange = (e, index) => {
    const novoValor = e.target.value;
    setDadosOperacao((prev) => {
      const novosDados = [...prev];
      novosDados[index] = novoValor;
      return novosDados;
    });
  };

  const enviarDados = () => {
    if (dadosOperacao.every((field) => field.trim() === "")) {
      alert("Por favor, altere os dados de operação antes de enviar.");
      return;
    }
    const notReadyRows = dadosSelecionados.filter((row) => !row.disabled);
    if (notReadyRows.length > 0) {
      alert("Todas as linhas devem estar no estado 'Pronto' antes de enviar.");
      return;
    }
    const operacaoData = {
      operacao: dadosOperacao[0] || "",
      entidade: dadosOperacao[1] || "",
      tipoOperacao: dadosOperacao[2] || "",
      nacionalidadeOperacao: dadosOperacao[3] || "",
      outrasAgencias: dadosOperacao[4] || "",
    };
    // Cabeçalhos para o Excel – Note que mesmo os campos removidos na tabela (display) são exportados.
    const headers = [
      "Operação",
      "Entidade",
      "Tipo",
      "Nacionalidade",
      "Nome da Embarcação",
      "Nº Registo/IMO",
      "Nº Matrícula/MMSI",
      "Tipo de Embarcacao",
      "Nacionalidade",
      "Nome do Mestre",
      "Ilha",
      "Licença",
      "Data",
      "Hora",
      "Tipo de Task",
      "Latitude",
      "Longitude",
      "Situação",
      "Tipo de Infração",
      "Medidas Tomadas",
      "Outras Agências",
      "OBS",
    ];
    const combinedData = dadosSelecionados.map((row) => {
      //const lat = convertLocation(row.latitude, true);
      //const lon = convertLocation(row.longitude, false);
      return [
        operacaoData.operacao,
        operacaoData.entidade,
        operacaoData.tipoOperacao,
        operacaoData.nacionalidadeOperacao,
        row.nomeEmbarcacao,
        row.numRegisto,
        row.numMatricula,
        row.tipoEmbarcacao,
        row.nacionalidade,
        row.nomeMestre,
        row.ilha,
        row.licenca,
        row.data,
        row.hora,
        row.tipoDeTask,
        //lat,
        //lon,
        row.latitude,
        row.longitude,
        row.situacao,
        Array.isArray(row.tipoInfracao) ? row.tipoInfracao.join(", ") : row.tipoInfracao,
        row.medidasTomadas,
        operacaoData.outrasAgencias,
        row.observacoes,
      ];
    });
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...combinedData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, "dados_exportados.xlsx");
  };

  return (
    <div className="container">
      <h1>FORMULÁRIO PARA NAVIOS ABORDADOS/AVISTADOS/INVESTIGADOS</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : null}

      <OperacaoTable
        dadosOperacao={dadosOperacao}
        config={config}
        automaticEntidades={config.automaticEntidades}
        handleOperacaoChange={handleOperacaoChange}
      />


<NaviosTable
  dadosFiltrados={dadosFiltrados} // Correção: usar dadosFiltrados em vez de dadosNavios
  adicionarAoDadostable={adicionarAoDadostable}
  handleFiltroChange={handleFiltroChange}
/>

<DadosTable
  dadosSelecionados={dadosSelecionados}
  handleCellEdit={handleCellEdit}
  updateCellValue={updateCellValue}
  updateRowDisabled={updateRowDisabled}
  removerLinha={removerLinha}
  activeLocationFormat={activeLocationFormat}
  setActiveLocationFormat={setActiveLocationFormat}
  setDadosSelecionados={setDadosSelecionados}
  tipoInfracaoOptions={config_DadosTable.tipoInfracaoOptions}
  config_DadosTable={config_DadosTable}  // Passa o objeto com medidasTomadasOptions
/>

<NovosTable
  dadosSelecionados={dadosSelecionados}
  tipoInfracaoOptions={config_DadosTable.tipoInfracaoOptions}
  medidasTomadasOptions={config_DadosTable.medidasTomadasOptions}
/>


      <button
        onClick={enviarDados}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Enviar/Download de dados
      </button>
      <button
        onClick={resetarDados}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
        }}
      >
        Resetar Dados
      </button>

      {/* Botão para exibir a Lista de Infrações */}
      <button
        onClick={() => setShowInfractionsModal(true)}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Ver Lista de Infrações
      </button>

      {/* Modal para exibir a Lista de Infrações */}
      {showInfractionsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "4px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <h2>Lista de Infrações</h2>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {config_DadosTable.tipoInfracaoOptions.map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <strong>{item.value}</strong>: {item.description}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowInfractionsModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
