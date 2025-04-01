import React from "react";
import OperacaoTable from "./components/OperacaoTable";
import NaviosTable from "./components/NaviosTable";
import DadosTable from "./components/DadosTable";
import NovosTable from "./components/NovosTable";
import InfractionsModal from "./components/InfractionsModal";
import { useData } from "./hooks/useData";
import "./App.css";

function App() {
  const {
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
  } = useData();

  return (
    <div className="container">
      <h1>FORMULÁRIO PARA NAVIOS ABORDADOS/AVISTADOS/INVESTIGADOS</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      <OperacaoTable
        dadosOperacao={dadosOperacao}
        config={config}
        automaticEntidades={config.automaticEntidades}
        handleOperacaoChange={handleOperacaoChange}
      />

      <NaviosTable
        dadosFiltrados={dadosFiltrados}
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
        tipoInfracaoOptions={configDadosTable.tipoInfracaoOptions}
        config_DadosTable={configDadosTable}
      />

      <NovosTable
        dadosSelecionados={dadosSelecionados}
        tipoInfracaoOptions={configDadosTable.tipoInfracaoOptions}
        medidasTomadasOptions={configDadosTable.medidasTomadasOptions}
      />

      <button onClick={enviarDados} style={{ marginTop: "20px", padding: "10px 20px" }}>
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
      <button onClick={() => setShowInfractionsModal(true)} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Ver Lista de Infrações
      </button>

      {showInfractionsModal && (
        <InfractionsModal
          config_DadosTable={configDadosTable}
          onClose={() => setShowInfractionsModal(false)}
        />
      )}
    </div>
  );
}

export default App;
