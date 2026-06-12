import { normalizar } from '../../core/texto.js';

function embaralhar(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function criarGrade(tamanho) {
  return Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
}

function colocarPalavra(grade, palavraNorm, row, col, dir) {
  for (let i = 0; i < palavraNorm.length; i++) {
    if (dir === 'h') grade[row][col + i] = palavraNorm[i];
    else grade[row + i][col] = palavraNorm[i];
  }
}

function podeColocar(grade, palavraNorm, row, col, dir, tamanho) {
  if (row < 0 || col < 0) return false;
  if (dir === 'h' && col + palavraNorm.length > tamanho) return false;
  if (dir === 'v' && row + palavraNorm.length > tamanho) return false;
  if (dir === 'h') {
    if (col > 0 && grade[row][col - 1] !== null) return false;
    if (col + palavraNorm.length < tamanho && grade[row][col + palavraNorm.length] !== null) return false;
  } else {
    if (row > 0 && grade[row - 1][col] !== null) return false;
    if (row + palavraNorm.length < tamanho && grade[row + palavraNorm.length][col] !== null) return false;
  }
  for (let i = 0; i < palavraNorm.length; i++) {
    const r = dir === 'h' ? row : row + i;
    const c = dir === 'h' ? col + i : col;
    const cell = grade[r][c];
    if (cell === null) {
      if (dir === 'h') {
        if (r > 0 && grade[r - 1][c] !== null) return false;
        if (r < tamanho - 1 && grade[r + 1][c] !== null) return false;
      } else {
        if (c > 0 && grade[r][c - 1] !== null) return false;
        if (c < tamanho - 1 && grade[r][c + 1] !== null) return false;
      }
    } else if (cell !== palavraNorm[i]) {
      return false;
    }
  }
  return true;
}

function tentarColocar(grade, candidato, colocadas, tamanho) {
  const palavraNorm = normalizar(candidato.palavra).replace(/[^A-Z]/g, '');
  if (palavraNorm.length > tamanho) return false;
  for (let i = 0; i < palavraNorm.length; i++) {
    const letra = palavraNorm[i];
    for (const col of colocadas) {
      const colNorm = normalizar(col.palavra).replace(/[^A-Z]/g, '');
      for (let j = 0; j < colNorm.length; j++) {
        if (colNorm[j] !== letra) continue;
        const intRow = col.dir === 'h' ? col.row : col.row + j;
        const intCol = col.dir === 'h' ? col.col + j : col.col;
        const novaDir = col.dir === 'h' ? 'v' : 'h';
        const novaRow = novaDir === 'h' ? intRow : intRow - i;
        const novaCol = novaDir === 'h' ? intCol - i : intCol;
        if (podeColocar(grade, palavraNorm, novaRow, novaCol, novaDir, tamanho)) {
          colocarPalavra(grade, palavraNorm, novaRow, novaCol, novaDir);
          colocadas.push({
            palavra: candidato.palavra,
            palavraNorm,
            dicas: candidato.dicas ?? (candidato.dica ? [candidato.dica] : []),
            temaNome: candidato.temaNome,
            temaEmoji: candidato.temaEmoji,
            row: novaRow,
            col: novaCol,
            dir: novaDir,
          });
          return true;
        }
      }
    }
  }
  return false;
}

function tentarGerar(pool, alvo, tamanho) {
  const grade = criarGrade(tamanho);
  const colocadas = [];
  const primeira = pool[0];
  const palavraNorm = normalizar(primeira.palavra).replace(/[^A-Z]/g, '');
  if (palavraNorm.length > tamanho) return null;
  const startCol = Math.floor((tamanho - palavraNorm.length) / 2);
  const startRow = Math.floor(tamanho / 2);
  colocarPalavra(grade, palavraNorm, startRow, startCol, 'h');
  colocadas.push({
    palavra: primeira.palavra,
    palavraNorm,
    dicas: primeira.dicas ?? (primeira.dica ? [primeira.dica] : []),
    temaNome: primeira.temaNome,
    temaEmoji: primeira.temaEmoji,
    row: startRow,
    col: startCol,
    dir: 'h',
  });
  for (let i = 1; i < pool.length && colocadas.length < alvo; i++) {
    tentarColocar(grade, pool[i], colocadas, tamanho);
  }
  return colocadas.length >= Math.min(alvo, 3) ? { grade, colocadas, tamanho } : null;
}

function recortarGrade(resultado) {
  const { grade, colocadas } = resultado;
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  for (let r = 0; r < grade.length; r++) {
    for (let c = 0; c < grade[r].length; c++) {
      if (grade[r][c] !== null) {
        if (r < minR) minR = r;
        if (c < minC) minC = c;
        if (r > maxR) maxR = r;
        if (c > maxC) maxC = c;
      }
    }
  }
  if (minR === Infinity) return resultado;
  const novaGrade = [];
  for (let r = minR; r <= maxR; r++) {
    novaGrade.push(grade[r].slice(minC, maxC + 1));
  }
  const novasColocadas = colocadas.map((p) => ({
    ...p,
    row: p.row - minR,
    col: p.col - minC,
  }));
  return {
    grade: novaGrade,
    colocadas: novasColocadas,
    linhas: novaGrade.length,
    colunas: novaGrade[0].length,
  };
}

function numerarPalavras(resultado) {
  const colocadas = [...resultado.colocadas].sort((a, b) => a.row - b.row || a.col - b.col);
  let numero = 1;
  const usados = new Map();
  for (const p of colocadas) {
    const chave = `${p.row},${p.col}`;
    if (!usados.has(chave)) {
      usados.set(chave, numero++);
    }
    p.numero = usados.get(chave);
  }
  return { ...resultado, colocadas };
}

export function gerarCruzada({ pool, alvoPalavras = 6, tamanho = 13 }) {
  if (!pool || pool.length === 0) return null;
  for (let tentativa = 0; tentativa < 40; tentativa++) {
    const embaralhado = embaralhar(pool).slice(0, Math.max(alvoPalavras * 3, 15));
    embaralhado.sort((a, b) => b.palavra.length - a.palavra.length);
    const r = tentarGerar(embaralhado, alvoPalavras, tamanho);
    if (r) return numerarPalavras(recortarGrade(r));
  }
  return null;
}
