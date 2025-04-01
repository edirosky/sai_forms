import React from "react";
import InputMask from "react-input-mask";
//import { convertLocation } from "../utils/convertLocation"; // Importando a função

export const LocalizacaoGGMMLatitude = ({ value, onChange, disabled }) => {
  // Valor esperado: "99 99,99 H" (H = N ou S)
  let numeric = "";
  let hemisferio = "N";

  if (value) {
    const parts = value.trim().split(" ");
    if (parts.length >= 3) {
      numeric = `${parts[0]} ${parts[1]}`;
      hemisferio = parts[2];
    } else if (parts.length === 2) {
      numeric = `${parts[0]} ${parts[1]}`;
    } else {
      numeric = parts[0] || "";
    }
  }

  const handleNumericChange = (e) => {
    const newNumeric = e.target.value.trim();
    onChange({ target: { value: newNumeric + (hemisferio ? ` ${hemisferio}` : " N") } });
  };

  const handleHemiChange = (e) => {
    const newHemi = e.target.value;
    onChange({ target: { value: `${numeric} ${newHemi}`.trim() } });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <InputMask mask="99 99,99" value={numeric} onChange={handleNumericChange} disabled={disabled}>
        {(inputProps) => <input {...inputProps} type="text" style={{ width: "80px" }} />}
      </InputMask>
      <select value={hemisferio} onChange={handleHemiChange} disabled={disabled} style={{ marginLeft: "4px" }}>
        <option value="N">N</option>
        <option value="S">S</option>
      </select>
    </div>
  );
};

export const LocalizacaoGGMMLongitude = ({ value, onChange, disabled }) => {
  // Valor esperado: "999 99,99 H" (H = E ou W)
  let numeric = "";
  let hemisferio = "W";

  if (value) {
    const parts = value.trim().split(" ");
    if (parts.length >= 3) {
      numeric = `${parts[0]} ${parts[1]}`;
      hemisferio = parts[2];
    } else if (parts.length === 2) {
      numeric = `${parts[0]} ${parts[1]}`;
    } else {
      numeric = parts[0] || "";
    }
  }

  const handleNumericChange = (e) => {
    const newNumeric = e.target.value.trim();
    onChange({ target: { value: newNumeric + (hemisferio ? ` ${hemisferio}` : " W") } });
  };

  const handleHemiChange = (e) => {
    const newHemi = e.target.value;
    onChange({ target: { value: `${numeric} ${newHemi}`.trim() } });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <InputMask mask="999 99,99" value={numeric} onChange={handleNumericChange} disabled={disabled}>
        {(inputProps) => <input {...inputProps} type="text" style={{ width: "90px" }} />}
      </InputMask>
      <select value={hemisferio} onChange={handleHemiChange} disabled={disabled} style={{ marginLeft: "4px" }}>
        <option value="E">E</option>
        <option value="W">W</option>
      </select>
    </div>
  );
};
