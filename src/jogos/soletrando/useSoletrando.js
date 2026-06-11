import { useMemo, useState } from 'react';
import palavrasData from '../../core/palavras.json';
import { escolherVarias } from '../../core/palavrasUsadas.js';
import { normalizar } from '../../core/texto.js';

const TAMANHO_RODADA = 5;

function filtrarPorDificuldade(lista, dificuldade) {
  const ordenada = [...lista].sort((a, b) => a.palavra.length - b.palavra.length);
  if (dificuldade === 'facil') return ordenada.slice(0, Math.ceil(ordenada.length / 3));
  if (dificuldade === 'dificil') return ordenada.slice(-Math.ceil(ordenada.length / 3));
  return ordenada.slice(Math.floor(ordenada.length / 3), -Math.floor(ordenada.length / 3) || undefined);
}

export function useSoletrando({ idade, dificuldade }) {
  const palavras = useMemo(() => {
    const todasMisturadas = [];
    for (const [, temaInfo] of Object.entries(palavrasData.temas)) {
      const desseTema = temaInfo.idades?.[idade] ?? [];
      todasMisturadas.push(...desseTema);
    }
    const filtradas = filtrarPorDificuldade(todasMisturadas, dificuldade);
    const fonte = filtradas.length ? filtradas : todasMisturadas;
    return escolherVarias('soletrando', idade, dificuldade, fonte, TAMANHO_RODADA);
  }, [idade, dificuldade]);

  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState([]);
  const [feedbackUltimo, setFeedbackUltimo] = useState(null);

  const atual = palavras[indice];
  const fim = indice >= palavras.length;

  function tentar(resposta) {
    if (!atual) return null;
    const respostaNorm = normalizar(resposta || '')
      .replace(/[^A-Z ]/g, '')
      .trim();
    const certa = atual.palavra.trim();
    const certaNorm = normalizar(certa).replace(/[^A-Z ]/g, '').trim();
    const acertou = respostaNorm === certaNorm;
    setAcertos((a) => [...a, { palavra: certa, resposta: respostaNorm, acertou }]);
    setFeedbackUltimo({ acertou, palavra: certa, resposta: respostaNorm });
    return acertou;
  }

  function proxima() {
    setFeedbackUltimo(null);
    setIndice((i) => i + 1);
  }

  function reiniciar() {
    setIndice(0);
    setAcertos([]);
    setFeedbackUltimo(null);
  }

  const totalAcertos = acertos.filter((a) => a.acertou).length;

  return {
    palavras,
    atual,
    dica: atual?.dica,
    indice,
    total: palavras.length,
    acertos,
    totalAcertos,
    feedbackUltimo,
    fim,
    tentar,
    proxima,
    reiniciar,
  };
}
