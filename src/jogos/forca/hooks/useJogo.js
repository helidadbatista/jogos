import { useCallback, useEffect, useMemo, useState } from 'react';
import palavrasData from '../../../core/palavras.json';
import { useJogoCore } from './useJogoCore.js';

const MAX_ERROS_POR_IDADE = { '4-6': 8, '7-9': 6, '10-12': 6 };

function filtrarPorDificuldade(lista, dificuldade) {
  const ordenada = [...lista].sort((a, b) => a.palavra.length - b.palavra.length);
  if (dificuldade === 'facil') return ordenada.slice(0, Math.ceil(ordenada.length / 3));
  if (dificuldade === 'dificil') return ordenada.slice(-Math.ceil(ordenada.length / 3));
  return ordenada.slice(Math.floor(ordenada.length / 3), -Math.floor(ordenada.length / 3) || undefined);
}

function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

export function useJogo({ idade, dificuldade, tema }) {
  const maxErros = MAX_ERROS_POR_IDADE[idade] ?? 6;
  const dicaSempreVisivel = idade === '4-6';

  const pool = useMemo(() => {
    const todas = palavrasData.temas[tema]?.idades[idade] ?? [];
    const filtradas = filtrarPorDificuldade(todas, dificuldade);
    return filtradas.length ? filtradas : todas;
  }, [tema, idade, dificuldade]);

  const [rodada, setRodada] = useState(() => sortear(pool));

  useEffect(() => {
    setRodada(sortear(pool));
  }, [pool]);

  const core = useJogoCore({
    palavra: rodada.palavra,
    dica: rodada.dica,
    maxErros,
    dicaSempreVisivel,
  });

  const novaRodada = useCallback(() => {
    setRodada(sortear(pool));
  }, [pool]);

  return { ...core, novaRodada };
}
