import { useCallback, useEffect, useMemo, useState } from 'react';
import { sons } from '../../../core/sounds.js';
import { normalizar } from '../../../core/texto.js';

export function useJogoCore({ palavra, dica, maxErros, dicaSempreVisivel }) {
  const [usadas, setUsadas] = useState(() => new Set());
  const [erros, setErros] = useState(0);
  const [dicaPedida, setDicaPedida] = useState(dicaSempreVisivel);

  useEffect(() => {
    setUsadas(new Set());
    setErros(0);
    setDicaPedida(dicaSempreVisivel);
  }, [palavra, dicaSempreVisivel]);

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

  const pedirDica = useCallback(
    ({ custaTentativa = true } = {}) => {
      if (dicaPedida || fim || !dica) return;
      sons.dica();
      setDicaPedida(true);
      if (custaTentativa && !dicaSempreVisivel) {
        setErros((e) => Math.min(maxErros, e + 1));
      }
    },
    [dicaPedida, fim, dica, dicaSempreVisivel, maxErros]
  );

  useEffect(() => {
    if (venceu) sons.vitoria();
    else if (perdeu) sons.derrota();
  }, [venceu, perdeu]);

  return {
    palavra,
    dica,
    dicaPedida,
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
