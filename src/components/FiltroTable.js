import React from "react";

const FiltroTable = ({ dadosNavios, handleFiltroChange }) => {
  return (
    <div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {dadosNavios.length > 0 &&
                dadosNavios[0].map((coluna, index) => (
                  <th key={index}>{coluna}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {dadosNavios.length > 0 &&
                dadosNavios[0].map((_, index) => (
                  <td key={index}>
                    <input
                      type="text"
                      placeholder="Filtrar"
                      onChange={(e) => handleFiltroChange(e, index)}
                    />
                  </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FiltroTable;
