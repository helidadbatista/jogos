import { useMemo, useState } from 'react';
import palavrasData from '../../core/palavras.json';

const TAMANHO_RODADA = 5;

function filtrarPorDificuldade(lista, dificuldade) {
  const ordenada = [...lista].sort((a, b) => a.palavra.length - b.palavra.length);
  if (dificuldade === 'facil') return ordenada.slice(0, Math.ceil(ordenada.length / 3));
  if (dificuldade === 'dificil') return ordenada.slice(-Math.ceil(ordenada.length / 3));
  return ordenada.slice(Math.floor(ordenada.length / 3), -Math.floor(ordenada.length / 3) || undefined);
}

function embaralhar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
    return embaralhar(fonte).slice(0, TAMANHO_RODADA);
  }, [idade, dificuldade]);

  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState([]);
  const [feedbackUltimo, setFeedbackUltimo] = useState(null);

  const atual = palavras[indice];
  const fim = indice >= palavras.length;

  function tentar(resposta) {
    if (!atual) return null;
    const normalizada = (resposta || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-Z ]/g, '')
      .trim();
    const certa = atual.palavra.trim();
    const acertou = normalizada === certa;
    setAcertos((a) => [...a, { palavra: certa, resposta: normalizada, acertou }]);
    setFeedbackUltimo({ acertou, palavra: certa, resposta: normalizada });
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
