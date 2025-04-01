import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useFetchConfig } from "./useFetchConfig";
import { useFetchNavios } from "./useFetchNavios";
import { useLocalStorage } from "./useLocalStorage";

export function useData() {
  // Estados persistentes com hook customizado
  const [dadosOperacao, setDadosOperacao] = useLocalStorage("dadosOperacao", ["", "", "", "", ""]);
  const [dadosSelecionados, setDadosSelecionados] = useLocalStorage("dadosSelecionados", []);
  const [activeLocationFormat, setActiveLocationFormat] = useLocalStorage("activeLocationFormat", "GG");

  // Estados locais
  const [filtros, setFiltros] = useState({});
  const [loading, setLoading] = useState(true);
  const [showInfractionsModal, setShowInfractionsModal] = useState(false);
  const navigate = useNavigate();

  // Hooks de busca
  const { config, configDadosTable, error: errorConfig } = useFetchConfig();
  const { dadosNavios, error: errorNavios } = useFetchNavios();

  const error = errorConfig || errorNavios;

  useEffect(() => {
    if (dadosNavios.length > 0 && config.nacionalidadeEntidade.length > 0) {
      setLoading(false);
    }
  }, [dadosNavios, config]);

  // Lógica de filtragem
  const dadosFiltrados = dadosNavios.filter((linha, i) => {
    if (i === 0) return true; // Mantém o cabeçalho
    return linha.every((celula, j) => {
      const filtro = filtros[j];
      if (!filtro) return true;
      const valorCelula = celula ? String(celula).toLowerCase() : "";
      return valorCelula.includes(filtro.toLowerCase());
    });
  });

  const handleFiltroChange = (e, colunaIndex) => {
    const valor = e.target.value;
    setFiltros((prev) => ({ ...prev, [colunaIndex]: valor }));
  };

  // Funções de manipulação dos dados
  const adicionarAoDadostable = (linha) => {
    if (linha[0] && linha[0].trim().toLowerCase() === "nome da embarcação".toLowerCase()) return;
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
        localizacaoGG: "",
        localizacaoGGMM: "",
        localizacaoGGMMSS: "",
        latitude: "",
        longitude: "",
        situacao: "",
        tipoInfracao: [],
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
    const combinedData = dadosSelecionados.map((row) => [
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
      row.latitude,
      row.longitude,
      row.situacao,
      Array.isArray(row.tipoInfracao) ? row.tipoInfracao.join(", ") : row.tipoInfracao,
      row.medidasTomadas,
      operacaoData.outrasAgencias,
      row.observacoes,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...combinedData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, "dados_exportados.xlsx");
  };

  return {
    dadosOperacao,
    setDadosOperacao,
    dadosSelecionados,
    setDadosSelecionados,
    dadosNavios,
    filtros,
    setFiltros,
    loading,
    error,
    config,
    configDadosTable,
    activeLocationFormat,
    setActiveLocationFormat,
    showInfractionsModal,
    setShowInfractionsModal,
    handleFiltroChange,
    dadosFiltrados,
    adicionarAoDadostable,
    handleCellEdit,
    updateCellValue,
    updateRowDisabled,
    removerLinha,
    resetarDados,
    handleOperacaoChange,
    enviarDados,
  };
}
