import { normalizar } from '../../core/texto.js';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const DIRECOES = {
  horizontal: [0, 1],
  horizontalInv: [0, -1],
  vertical: [1, 0],
  verticalInv: [-1, 0],
  diagonal: [1, 1],
  diagonalInv: [-1, -1],
  diagonal2: [1, -1],
  diagonalInv2: [-1, 1],
};

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

function tentarColocar(grade, palavraNorm, info, colocadas, tamanho, direcoesPermitidas) {
  for (let tentativa = 0; tentativa < 80; tentativa++) {
    const direcaoNome = direcoesPermitidas[Math.floor(Math.random() * direcoesPermitidas.length)];
    const [dr, dc] = DIRECOES[direcaoNome];
    const len = palavraNorm.length;
    const row = Math.floor(Math.random() * tamanho);
    const col = Math.floor(Math.random() * tamanho);
    let ok = true;
    const cells = [];
    for (let i = 0; i < len; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= tamanho || c < 0 || c >= tamanho) { ok = false; break; }
      const valor = grade[r][c];
      if (valor !== null && valor !== palavraNorm[i]) { ok = false; break; }
      cells.push({ row: r, col: c });
    }
    if (!ok) continue;
    for (let i = 0; i < len; i++) {
      grade[cells[i].row][cells[i].col] = palavraNorm[i];
    }
    colocadas.push({
      palavra: info.palavra,
      palavraNorm,
      dicas: info.dicas ?? (info.dica ? [info.dica] : []),
      temaNome: info.temaNome,
      temaEmoji: info.temaEmoji,
      cells,
      direcao: direcaoNome,
      encontrada: false,
    });
    return true;
  }
  return false;
}

export function gerarCaca({ pool, alvoPalavras = 7, tamanho = 10, direcoes }) {
  if (!pool || pool.length === 0) return null;
  const direcoesPermitidas = direcoes ?? ['horizontal', 'vertical'];
  for (let semente = 0; semente < 12; semente++) {
    const grade = criarGrade(tamanho);
    const colocadas = [];
    const candidatos = embaralhar(pool)
      .map((p) => ({ ...p, _norm: normalizar(p.palavra).replace(/[^A-Z]/g, '') }))
      .filter((p) => p._norm.length >= 3 && p._norm.length <= tamanho)
      .sort((a, b) => b._norm.length - a._norm.length)
      .slice(0, alvoPalavras * 3);

    for (const p of candidatos) {
      if (colocadas.length >= alvoPalavras) break;
      tentarColocar(grade, p._norm, p, colocadas, tamanho, direcoesPermitidas);
    }

    if (colocadas.length >= Math.min(alvoPalavras, 3)) {
      for (let r = 0; r < tamanho; r++) {
        for (let c = 0; c < tamanho; c++) {
          if (grade[r][c] === null) {
            grade[r][c] = ALPHA[Math.floor(Math.random() * ALPHA.length)];
          }
        }
      }
      return { grade, colocadas, tamanho };
    }
  }
  return null;
}
