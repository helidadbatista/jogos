import { useArmazenado } from './useArmazenado.js';

export function usePontuacao() {
  const [porJogo, setPorJogo] = useArmazenado('pontuacao', {});
  const total = Object.values(porJogo).reduce((s, v) => s + (v || 0), 0);

  function adicionar(jogo, valor) {
    if (!valor) return;
    setPorJogo((prev) => ({ ...prev, [jogo]: (prev[jogo] || 0) + valor }));
  }

  function zerar() {
    setPorJogo({});
  }

  return { total, porJogo, adicionar, zerar };
}
