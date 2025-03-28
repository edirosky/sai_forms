import React from "react";
import InputMask from "react-input-mask";

export const LocalizacaoGGLatitude = ({ value, onChange, disabled }) => {
  let numeric = "";
  let hemisferio = "N"; // Padrão: hemisfério Norte

  if (value) {
    const parts = value.split(" ");
    numeric = parts[0] || "";
    hemisferio = parts[1] || "N";
  }

  const handleNumericChange = (e) => {
    const newNumeric = e.target.value;
    onChange({ target: { value: newNumeric + " " + hemisferio } });
  };

  const handleHemiChange = (e) => {
    const newHemi = e.target.value;
    onChange({ target: { value: numeric + " " + newHemi } });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <InputMask mask="99,999999" value={numeric} onChange={handleNumericChange} disabled={disabled}>
        {(inputProps) => <input {...inputProps} type="text" style={{ width: "100px" }} />}
      </InputMask>
      <select value={hemisferio} onChange={handleHemiChange} disabled={disabled} style={{ marginLeft: "4px" }}>
        <option value="N">N</option>
        <option value="S">S</option>
      </select>
    </div>
  );
};

export const LocalizacaoGGLongitude = ({ value, onChange, disabled }) => {
  let numeric = "";
  let hemisferio = "W"; // Padrão: hemisfério Oeste

  if (value) {
    const parts = value.split(" ");
    numeric = parts[0] || "";
    hemisferio = parts[1] || "W";
  }

  const handleNumericChange = (e) => {
    const newNumeric = e.target.value;
    onChange({ target: { value: newNumeric + " " + hemisferio } });
  };

  const handleHemiChange = (e) => {
    const newHemi = e.target.value;
    onChange({ target: { value: numeric + " " + newHemi } });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <InputMask mask="999,999999" value={numeric} onChange={handleNumericChange} disabled={disabled}>
        {(inputProps) => <input {...inputProps} type="text" style={{ width: "110px" }} />}
      </InputMask>
      <select value={hemisferio} onChange={handleHemiChange} disabled={disabled} style={{ marginLeft: "4px" }}>
        <option value="E">E</option>
        <option value="W">W</option>
      </select>
    </div>
  );
};
