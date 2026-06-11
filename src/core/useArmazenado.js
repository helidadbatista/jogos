import { useCallback, useState } from 'react';

export function useArmazenado(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const bruto = window.localStorage.getItem(chave);
      if (bruto === null) return valorInicial;
      return JSON.parse(bruto);
    } catch {
      return valorInicial;
    }
  });

  const atualizar = useCallback((novo) => {
    setValor((prev) => {
      const proximo = typeof novo === 'function' ? novo(prev) : novo;
      try {
        window.localStorage.setItem(chave, JSON.stringify(proximo));
      } catch {}
      return proximo;
    });
  }, [chave]);

  return [valor, atualizar];
}
