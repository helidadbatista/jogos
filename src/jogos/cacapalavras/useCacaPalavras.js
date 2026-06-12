import { useCallback, useEffect, useMemo, useState } from 'react';
import palavrasData from '../../core/palavras.json';
import { gerarCaca } from './geradorCacaPalavras.js';

const CONFIGS = {
  facil: { alvoPalavras: 5, tamanho: 8, direcoes: ['horizontal', 'vertical'] },
  medio: { alvoPalavras: 7, tamanho: 10, direcoes: ['horizontal', 'vertical', 'horizontalInv', 'verticalInv'] },
  dificil: { alvoPalavras: 10, tamanho: 12, direcoes: ['horizontal', 'vertical', 'horizontalInv', 'verticalInv', 'diagonal', 'diagonalInv', 'diagonal2', 'diagonalInv2'] },
};

function montarPool(idade) {
  const todas = [];
  for (const [, info] of Object.entries(palavrasData.temas)) {
    const lista = info.idades?.[idade] ?? [];
    for (const p of lista) {
      if (!p.palavra.includes(' ')) {
        todas.push({ ...p, temaNome: info.nome, temaEmoji: info.emoji });
      }
    }
  }
  return todas;
}

function gerarLinha(startRow, startCol, endRow, endCol) {
  const dr = endRow - startRow;
  const dc = endCol - startCol;
  if (dr === 0 && dc === 0) return [{ row: startRow, col: startCol }];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const stepR = dr === 0 ? 0 : Math.sign(dr);
  const stepC = dc === 0 ? 0 : Math.sign(dc);
  const cells = [];
  for (let i = 0; i < len; i++) {
    cells.push({ row: startRow + stepR * i, col: startCol + stepC * i });
  }
  return cells;
}

export function useCacaPalavras({ idade, dificuldade }) {
  const config = CONFIGS[dificuldade] ?? CONFIGS.medio;

  const cacada = useMemo(() => {
    const pool = montarPool(idade);
    return gerarCaca({ pool, alvoPalavras: config.alvoPalavras, tamanho: config.tamanho, direcoes: config.direcoes });
  }, [idade, dificuldade]);

  const [encontradas, setEncontradas] = useState(new Set());
  const [selecao, setSelecao] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setEncontradas(new Set());
    setSelecao(null);
    setFeedback(null);
  }, [cacada]);

  const cellsEncontradas = useMemo(() => {
    if (!cacada) return new Set();
    const set = new Set();
    for (const idx of encontradas) {
      const p = cacada.colocadas[idx];
      for (const c of p.cells) set.add(`${c.row},${c.col}`);
    }
    return set;
  }, [cacada, encontradas]);

  const cellsSelecao = useMemo(() => {
    if (!selecao || !selecao.start || !selecao.end) return [];
    return gerarLinha(selecao.start.row, selecao.start.col, selecao.end.row, selecao.end.col) ?? [];
  }, [selecao]);

  const iniciarSelecao = useCallback((row, col) => {
    setSelecao({ start: { row, col }, end: { row, col } });
    setFeedback(null);
  }, []);

  const atualizarSelecao = useCallback((row, col) => {
    setSelecao((s) => (s ? { ...s, end: { row, col } } : null));
  }, []);

  const finalizarSelecao = useCallback(() => {
    if (!cacada || !selecao || !selecao.start || !selecao.end) { setSelecao(null); return null; }
    const cells = gerarLinha(selecao.start.row, selecao.start.col, selecao.end.row, selecao.end.col);
    setSelecao(null);
    if (!cells || cells.length < 2) return null;
    const letras = cells.map((c) => cacada.grade[c.row][c.col]).join('');
    const reverso = letras.split('').reverse().join('');
    for (let i = 0; i < cacada.colocadas.length; i++) {
      if (encontradas.has(i)) continue;
      const p = cacada.colocadas[i];
      if (p.palavraNorm === letras || p.palavraNorm === reverso) {
        setEncontradas((prev) => new Set(prev).add(i));
        setFeedback({ tipo: 'acerto', palavra: p.palavra });
        setTimeout(() => setFeedback(null), 1200);
        return { acertou: true, palavra: p.palavra };
      }
    }
    setFeedback({ tipo: 'erro' });
    setTimeout(() => setFeedback(null), 800);
    return { acertou: false };
  }, [cacada, selecao, encontradas]);

  const cancelarSelecao = useCallback(() => setSelecao(null), []);

  const totalPalavras = cacada?.colocadas.length ?? 0;
  const totalEncontradas = encontradas.size;
  const venceu = totalPalavras > 0 && totalEncontradas === totalPalavras;

  const revelar = useCallback(() => {
    if (!cacada) return;
    const todas = new Set();
    for (let i = 0; i < cacada.colocadas.length; i++) todas.add(i);
    setEncontradas(todas);
  }, [cacada]);

  return {
    cacada,
    encontradas,
    cellsEncontradas,
    cellsSelecao,
    selecao,
    feedback,
    iniciarSelecao,
    atualizarSelecao,
    finalizarSelecao,
    cancelarSelecao,
    revelar,
    totalPalavras,
    totalEncontradas,
    venceu,
  };
}
