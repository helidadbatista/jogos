import { useCallback, useEffect, useMemo, useState } from 'react';
import palavrasData from '../../../core/palavras.json';
import { escolherUma } from '../../../core/palavrasUsadas.js';
import { useJogoCore } from './useJogoCore.js';

const MAX_ERROS_POR_IDADE = { '4-6': 8, '7-9': 6, '10-12': 6 };

function filtrarPorDificuldade(lista, dificuldade) {
  const ordenada = [...lista].sort((a, b) => a.palavra.length - b.palavra.length);
  if (dificuldade === 'facil') return ordenada.slice(0, Math.ceil(ordenada.length / 3));
  if (dificuldade === 'dificil') return ordenada.slice(-Math.ceil(ordenada.length / 3));
  return ordenada.slice(Math.floor(ordenada.length / 3), -Math.floor(ordenada.length / 3) || undefined);
}

export function useJogo({ idade, dificuldade }) {
  const maxErros = MAX_ERROS_POR_IDADE[idade] ?? 6;
  const dicaSempreVisivel = idade === '4-6';

  const pool = useMemo(() => {
    const todas = [];
    for (const [temaId, temaInfo] of Object.entries(palavrasData.temas)) {
      const desseTema = temaInfo.idades?.[idade] ?? [];
      desseTema.forEach((p) =>
        todas.push({
          ...p,
          temaId,
          temaNome: temaInfo.nome,
          temaEmoji: temaInfo.emoji,
        })
      );
    }
    const filtradas = filtrarPorDificuldade(todas, dificuldade);
    return filtradas.length ? filtradas : todas;
  }, [idade, dificuldade]);

  const [rodada, setRodada] = useState(() => escolherUma('forca', idade, dificuldade, pool));

  useEffect(() => {
    setRodada(escolherUma('forca', idade, dificuldade, pool));
  }, [pool, idade, dificuldade]);

  const core = useJogoCore({
    palavra: rodada?.palavra ?? '',
    dicas: rodada?.dicas ?? (rodada?.dica ? [rodada.dica] : []),
    maxErros,
    dicaSempreVisivel,
  });

  const novaRodada = useCallback(() => {
    setRodada(escolherUma('forca', idade, dificuldade, pool));
  }, [pool, idade, dificuldade]);

  return {
    ...core,
    novaRodada,
    temaId: rodada?.temaId,
    temaNome: rodada?.temaNome,
    temaEmoji: rodada?.temaEmoji,
  };
}
