import { useState, useEffect } from "react";
import axios from "axios";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6IEKVLswVSPSlD5qKBtbTqwj7ciZOhr40a84inuVTeeXIyC8KueX8IaVW2tILpaVxp5p2OsoxBi6g/pub?output=csv";

export function useFetchNavios() {
  const [dadosNavios, setDadosNavios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchNavios();
  }, []);

  return { dadosNavios, error };
}
