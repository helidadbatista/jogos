import { useCallback, useEffect, useMemo, useState } from 'react';
import { sons } from '../../../core/sounds.js';
import { normalizar } from '../../../core/texto.js';

export function useJogoCore({ palavra, dicas, maxErros, dicaSempreVisivel }) {
  const dicasArr = useMemo(() => Array.isArray(dicas) ? dicas.filter(Boolean) : (dicas ? [dicas] : []), [dicas]);
  const inicialReveladas = dicaSempreVisivel ? Math.min(1, dicasArr.length) : 0;
  const [usadas, setUsadas] = useState(() => new Set());
  const [erros, setErros] = useState(0);
  const [dicasReveladas, setDicasReveladas] = useState(inicialReveladas);

  useEffect(() => {
    setUsadas(new Set());
    setErros(0);
    setDicasReveladas(dicaSempreVisivel ? Math.min(1, dicasArr.length) : 0);
  }, [palavra, dicaSempreVisivel, dicasArr.length]);

  const letrasDaPalavra = useMemo(() => {
    const s = new Set();
    for (const c of palavra) if (c !== ' ') s.add(normalizar(c));
    return s;
  }, [palavra]);

  const acertadas = useMemo(() => {
    const s = new Set();
    for (const l of usadas) if (letrasDaPalavra.has(l)) s.add(l);
    return s;
  }, [usadas, letrasDaPalavra]);

  const venceu = useMemo(
    () => [...letrasDaPalavra].every((l) => acertadas.has(l)),
    [letrasDaPalavra, acertadas]
  );
  const perdeu = erros >= maxErros;
  const fim = venceu || perdeu;

  const tentarLetra = useCallback(
    (letra) => {
      if (fim || usadas.has(letra) || letra === ' ') return;
      setUsadas((prev) => new Set(prev).add(letra));
      if (letrasDaPalavra.has(letra)) {
        sons.acerto();
      } else {
        sons.erro();
        setErros((e) => e + 1);
      }
    },
    [fim, usadas, letrasDaPalavra]
  );

  const dicasVisiveis = useMemo(() => {
    if (dicasArr.length === 0) return [];
    if (dicaSempreVisivel) {
      return dicasArr.slice(-1);
    }
    return dicasArr.slice(0, dicasReveladas);
  }, [dicasArr, dicasReveladas, dicaSempreVisivel]);

  const podePedirDica = !dicaSempreVisivel && dicasReveladas < dicasArr.length && !fim;
  const dicaAtualNumero = dicasReveladas;

  const pedirDica = useCallback(
    ({ custaTentativa = true } = {}) => {
      if (!podePedirDica) return;
      sons.dica();
      setDicasReveladas((n) => n + 1);
      if (custaTentativa) {
        setErros((e) => Math.min(maxErros, e + 1));
      }
    },
    [podePedirDica, maxErros]
  );

  useEffect(() => {
    if (venceu) sons.vitoria();
    else if (perdeu) sons.derrota();
  }, [venceu, perdeu]);

  return {
    palavra,
    dicas: dicasArr,
    dicasVisiveis,
    dicasReveladas,
    totalDicas: dicasArr.length,
    podePedirDica,
    dicaAtualNumero,
    dicaSempreVisivel,
    usadas,
    acertadas,
    erros,
    maxErros,
    venceu,
    perdeu,
    fim,
    tentarLetra,
    pedirDica,
  };
}
