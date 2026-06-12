import { useCallback, useEffect, useMemo, useState } from 'react';
import palavrasData from '../../core/palavras.json';
import { normalizar } from '../../core/texto.js';
import { gerarCruzada } from './geradorCruzadas.js';

const CONFIGS = {
  facil: { alvoPalavras: 4, tamanho: 9 },
  medio: { alvoPalavras: 6, tamanho: 11 },
  dificil: { alvoPalavras: 8, tamanho: 13 },
};

function montarPool(idade, dificuldade) {
  const todas = [];
  for (const [, info] of Object.entries(palavrasData.temas)) {
    const lista = info.idades?.[idade] ?? [];
    for (const p of lista) {
      const semEspaco = !p.palavra.includes(' ');
      if (semEspaco) {
        todas.push({ ...p, temaNome: info.nome, temaEmoji: info.emoji });
      }
    }
  }
  if (dificuldade === 'facil') {
    return todas.filter((p) => p.palavra.length <= 7);
  }
  if (dificuldade === 'medio') {
    return todas.filter((p) => p.palavra.length >= 4 && p.palavra.length <= 10);
  }
  return todas;
}

export function useCruzadas({ idade, dificuldade }) {
  const config = CONFIGS[dificuldade] ?? CONFIGS.medio;

  const cruzada = useMemo(() => {
    const pool = montarPool(idade, dificuldade);
    return gerarCruzada({ pool, alvoPalavras: config.alvoPalavras, tamanho: config.tamanho });
  }, [idade, dificuldade, config.alvoPalavras, config.tamanho]);

  const [cellChars, setCellChars] = useState({});
  const [palavraAtivaIdx, setPalavraAtivaIdx] = useState(0);
  const [posicaoAtiva, setPosicaoAtiva] = useState(0);
  const [erros, setErros] = useState({});
  const [revelado, setRevelado] = useState(false);
  const [errosOriginais, setErrosOriginais] = useState({});
  const [corretasAoRevelar, setCorretasAoRevelar] = useState(0);

  useEffect(() => {
    setCellChars({});
    setPalavraAtivaIdx(0);
    setPosicaoAtiva(0);
    setErros({});
    setRevelado(false);
    setErrosOriginais({});
    setCorretasAoRevelar(0);
  }, [cruzada]);

  const palavraAtiva = cruzada?.colocadas[palavraAtivaIdx] ?? null;

  const cellsDaPalavraAtiva = useMemo(() => {
    if (!palavraAtiva) return [];
    const cells = [];
    for (let i = 0; i < palavraAtiva.palavraNorm.length; i++) {
      const row = palavraAtiva.dir === 'h' ? palavraAtiva.row : palavraAtiva.row + i;
      const col = palavraAtiva.dir === 'h' ? palavraAtiva.col + i : palavraAtiva.col;
      cells.push({ row, col });
    }
    return cells;
  }, [palavraAtiva]);

  const cellAtiva = cellsDaPalavraAtiva[posicaoAtiva] ?? null;

  function chave(row, col) { return `${row},${col}`; }

  const palavrasNaCelula = useCallback(
    (row, col) => {
      if (!cruzada) return [];
      return cruzada.colocadas
        .map((p, idx) => ({ p, idx }))
        .filter(({ p }) => {
          if (p.dir === 'h') {
            return p.row === row && col >= p.col && col < p.col + p.palavraNorm.length;
          }
          return p.col === col && row >= p.row && row < p.row + p.palavraNorm.length;
        });
    },
    [cruzada]
  );

  const selecionarCelula = useCallback(
    (row, col) => {
      const palavras = palavrasNaCelula(row, col);
      if (palavras.length === 0) return;
      let escolhida = palavras.find((x) => x.idx === palavraAtivaIdx);
      if (!escolhida || palavras.length === 1) {
        escolhida = palavras[0];
      } else if (palavras.length > 1) {
        const outras = palavras.filter((x) => x.idx !== palavraAtivaIdx);
        if (outras.length > 0) escolhida = outras[0];
      }
      const p = escolhida.p;
      const pos = p.dir === 'h' ? col - p.col : row - p.row;
      setPalavraAtivaIdx(escolhida.idx);
      setPosicaoAtiva(pos);
    },
    [palavrasNaCelula, palavraAtivaIdx]
  );

  const selecionarPalavra = useCallback((idx) => {
    setPalavraAtivaIdx(idx);
    setPosicaoAtiva(0);
  }, []);

  const adicionarLetra = useCallback(
    (letra) => {
      if (!cellAtiva) return;
      const k = chave(cellAtiva.row, cellAtiva.col);
      setCellChars((prev) => ({ ...prev, [k]: letra }));
      setErros((prev) => {
        if (!prev[k]) return prev;
        const novo = { ...prev };
        delete novo[k];
        return novo;
      });
      setPosicaoAtiva((p) => Math.min(p + 1, cellsDaPalavraAtiva.length - 1));
    },
    [cellAtiva, cellsDaPalavraAtiva.length]
  );

  const apagarLetra = useCallback(() => {
    if (!cellAtiva) return;
    const k = chave(cellAtiva.row, cellAtiva.col);
    if (cellChars[k]) {
      setCellChars((prev) => {
        const novo = { ...prev };
        delete novo[k];
        return novo;
      });
    } else if (posicaoAtiva > 0) {
      const prev = cellsDaPalavraAtiva[posicaoAtiva - 1];
      const prevK = chave(prev.row, prev.col);
      setCellChars((p) => {
        const novo = { ...p };
        delete novo[prevK];
        return novo;
      });
      setPosicaoAtiva((p) => Math.max(0, p - 1));
    }
  }, [cellAtiva, cellChars, posicaoAtiva, cellsDaPalavraAtiva]);

  const verificar = useCallback(() => {
    if (!cruzada) return { todasCertas: false };
    const novosErros = {};
    let todasCertas = true;
    for (let r = 0; r < cruzada.grade.length; r++) {
      for (let c = 0; c < cruzada.grade[r].length; c++) {
        const certa = cruzada.grade[r][c];
        if (certa === null) continue;
        const k = chave(r, c);
        const digitada = cellChars[k];
        if (digitada !== certa) {
          novosErros[k] = true;
          todasCertas = false;
        }
      }
    }
    setErros(novosErros);
    return { todasCertas, totalErros: Object.keys(novosErros).length };
  }, [cruzada, cellChars]);

  const todasPreenchidas = useMemo(() => {
    if (!cruzada) return false;
    for (let r = 0; r < cruzada.grade.length; r++) {
      for (let c = 0; c < cruzada.grade[r].length; c++) {
        if (cruzada.grade[r][c] !== null) {
          if (!cellChars[chave(r, c)]) return false;
        }
      }
    }
    return true;
  }, [cruzada, cellChars]);

  const totalCells = useMemo(() => {
    if (!cruzada) return 0;
    let n = 0;
    for (const row of cruzada.grade) for (const c of row) if (c !== null) n++;
    return n;
  }, [cruzada]);

  const totalCorretas = useMemo(() => {
    if (!cruzada) return 0;
    let n = 0;
    for (let r = 0; r < cruzada.grade.length; r++) {
      for (let c = 0; c < cruzada.grade[r].length; c++) {
        const certa = cruzada.grade[r][c];
        if (certa !== null && cellChars[chave(r, c)] === certa) n++;
      }
    }
    return n;
  }, [cruzada, cellChars]);

  const revelar = useCallback(() => {
    if (!cruzada) return;
    const novosChars = {};
    const novosErros = {};
    let corretas = 0;
    for (let r = 0; r < cruzada.grade.length; r++) {
      for (let c = 0; c < cruzada.grade[r].length; c++) {
        const certa = cruzada.grade[r][c];
        if (certa === null) continue;
        const k = chave(r, c);
        const digitada = cellChars[k];
        novosChars[k] = certa;
        if (digitada !== certa) {
          novosErros[k] = true;
        } else {
          corretas++;
        }
      }
    }
    setCellChars(novosChars);
    setErrosOriginais(novosErros);
    setCorretasAoRevelar(corretas);
    setErros({});
    setRevelado(true);
  }, [cruzada, cellChars]);

  return {
    cruzada,
    cellChars,
    erros,
    errosOriginais,
    revelado,
    corretasAoRevelar,
    palavraAtivaIdx,
    palavraAtiva,
    cellAtiva,
    cellsDaPalavraAtiva,
    selecionarCelula,
    selecionarPalavra,
    adicionarLetra,
    apagarLetra,
    verificar,
    revelar,
    todasPreenchidas,
    totalCells,
    totalCorretas,
  };
}
