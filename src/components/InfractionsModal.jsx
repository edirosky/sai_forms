import React from "react";

function InfractionsModal({ config_DadosTable, onClose }) {
  return (
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
            <li key={index} style={{ marginBottom: "10px", whiteSpace: "pre-wrap" }}>
              <strong>{item.value}</strong>: {item.description}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default InfractionsModal;
