const usados = new Map();

function chave(jogo, idade, dificuldade) {
  return `${jogo}::${idade}::${dificuldade}`;
}

function obterSet(jogo, idade, dificuldade) {
  const k = chave(jogo, idade, dificuldade);
  if (!usados.has(k)) usados.set(k, new Set());
  return usados.get(k);
}

function embaralhar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function escolherUma(jogo, idade, dificuldade, pool) {
  if (!pool || pool.length === 0) return null;
  const set = obterSet(jogo, idade, dificuldade);
  let disponiveis = pool.filter((p) => !set.has(p.palavra));
  if (disponiveis.length === 0) {
    set.clear();
    disponiveis = pool;
  }
  const escolhida = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  set.add(escolhida.palavra);
  return escolhida;
}

export function escolherVarias(jogo, idade, dificuldade, pool, n) {
  if (!pool || pool.length === 0) return [];
  const set = obterSet(jogo, idade, dificuldade);
  let disponiveis = pool.filter((p) => !set.has(p.palavra));
  if (disponiveis.length < n) {
    set.clear();
    disponiveis = pool;
  }
  const escolhidas = embaralhar(disponiveis).slice(0, n);
  escolhidas.forEach((e) => set.add(e.palavra));
  return escolhidas;
}

export function resetarUsadas(jogo) {
  if (!jogo) {
    usados.clear();
    return;
  }
  const prefix = `${jogo}::`;
  for (const k of Array.from(usados.keys())) {
    if (k.startsWith(prefix)) usados.delete(k);
  }
}
