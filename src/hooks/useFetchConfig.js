import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";

const GOOGLE_SHEET_CONFIG_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmY3QHsDgxr-YD_5pvQla3QqEv54ek8sqB1HolsYgfOaFpTT7huZI-E7EVtt_TV0hD0Jq52j46y4vn/pub?gid=481503026&single=true&output=csv";

export function useFetchConfig() {
  const [config, setConfig] = useState({
    nacionalidadeEntidade: [],
    operacoes: [],
    entidades: [],
    automaticEntidades: [],
    tiposEntidade: [],
    situacoes: [],
    tiposEmbarcacao: [],
  });
  const [configDadosTable, setConfigDadosTable] = useState({
    tipoInfracaoOptions: [],
    medidasTomadasOptions: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await axios.get(GOOGLE_SHEET_CONFIG_URL);
        const parsed = Papa.parse(response.data, { header: false });
        const linhas = parsed.data;
        const dados = linhas.slice(1); // Remove o cabeçalho

        setConfig({
          nacionalidadeEntidade: dados.map((row) => row[0]).filter(Boolean),
          operacoes: dados.map((row) => row[2]).filter(Boolean),
          entidades: dados.map((row) => row[4]).filter(Boolean),
          automaticEntidades: dados.map((row) => row[3]).filter(Boolean),
          tiposEntidade: dados.map((row) => row[6]).filter(Boolean),
          situacoes: dados.map((row) => row[8]).filter(Boolean),
          tiposEmbarcacao: dados.map((row) => row[10]).filter(Boolean),
        });

        setConfigDadosTable({
          tipoInfracaoOptions: dados
            .map((row) =>
              row[12] && row[13] ? { value: row[12], description: row[13] } : null
            )
            .filter((item) => item !== null),
          medidasTomadasOptions: dados
            .map((row) => (row[17] ? row[17].trim() : ""))
            .filter(Boolean),
        });
      } catch (error) {
        console.error("Erro ao buscar configuração:", error);
        setError("Falha ao carregar configurações.");
      }
    }
    fetchConfig();
  }, []);

  return { config, configDadosTable, error };
}
