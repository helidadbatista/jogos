const MULT_IDADE = { '4-6': 1, '7-9': 2, '10-12': 3 };
const MULT_DIFICULDADE = { facil: 1, medio: 2, dificil: 3 };

export function calcularPontos({ idade, dificuldade, erros, maxErros, venceu }) {
  if (!venceu) {
    return { total: 0, base: 0, multIdade: 0, multDif: 0, bonus: 0, tentativasRestantes: 0 };
  }
  const multIdade = MULT_IDADE[idade] ?? 1;
  const multDif = MULT_DIFICULDADE[dificuldade] ?? 1;
  const base = 10 * multIdade * multDif;
  const tentativasRestantes = Math.max(0, maxErros - erros);
  const bonus = 5 * tentativasRestantes;
  return { total: base + bonus, base, multIdade, multDif, bonus, tentativasRestantes };
}

export function calcularPontosDuo({ erros, maxErros, venceu }) {
  if (!venceu) return { total: 0, base: 0, bonus: 0, tentativasRestantes: 0 };
  const base = 30;
  const tentativasRestantes = Math.max(0, maxErros - erros);
  const bonus = 5 * tentativasRestantes;
  return { total: base + bonus, base, bonus, tentativasRestantes };
}
