const PONTOS_FORCA = { facil: 2, medio: 5, dificil: 10 };
const PONTOS_DUO = 5;
const PONTOS_POR_PALAVRA_SOLETRANDO = 1;

export function calcularPontos({ dificuldade, venceu }) {
  if (!venceu) return { total: 0 };
  return { total: PONTOS_FORCA[dificuldade] ?? 2 };
}

export function calcularPontosDuo({ venceu }) {
  if (!venceu) return { total: 0 };
  return { total: PONTOS_DUO };
}

export function calcularPontosSoletrando(acertos) {
  return acertos * PONTOS_POR_PALAVRA_SOLETRANDO;
}
