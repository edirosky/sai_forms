import { useState, useEffect } from "react";
import axios from "axios";

const URL1 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6IEKVLswVSPSlD5qKBtbTqwj7ciZOhr40a84inuVTeeXIyC8KueX8IaVW2tILpaVxp5p2OsoxBi6g/pub?output=csv";
const URL2 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWp4e6A2Xflt8UMptYHjHT_a09g1lmhyjN3xMTcbMiaAdaaZ_cexpCUe3-wDPpiF-s4IhXxlh6Lmep/pub?gid=0&single=true&output=csv";

export function useFetchNavios() {
  const [dadosNavios, setDadosNavios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNavios() {
      try {
        // Busca os dois CSVs em paralelo
        const [response1, response2] = await Promise.all([
          axios.get(URL1),
          axios.get(URL2),
        ]);

        // Divide cada resposta em linhas e depois em colunas
        const linhas1 = response1.data.split("\n").map((linha) => linha.split(","));
        const linhas2 = response2.data.split("\n").map((linha) => linha.split(","));

        // Se ambos possuem o mesmo cabeçalho, remova o do segundo CSV
        if (JSON.stringify(linhas1[0]) === JSON.stringify(linhas2[0])) {
          linhas2.shift();
        }

        // Concatena as linhas dos dois CSVs
        setDadosNavios([...linhas1, ...linhas2]);
      } catch (error) {
        console.error("Erro ao buscar dados dos navios:", error);
        setError("Falha ao carregar dados dos navios.");
      }
    }
    fetchNavios();
  }, []);

  return { dadosNavios, error };
}
