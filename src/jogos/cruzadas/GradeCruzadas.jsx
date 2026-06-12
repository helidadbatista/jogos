export default function GradeCruzadas({
  cruzada,
  cellChars,
  erros,
  cellAtiva,
  palavraAtiva,
  cellsDaPalavraAtiva,
  onSelecionarCelula,
}) {
  if (!cruzada) return null;
  const { grade } = cruzada;

  const numeroPorCell = new Map();
  for (const p of cruzada.colocadas) {
    const k = `${p.row},${p.col}`;
    if (!numeroPorCell.has(k)) numeroPorCell.set(k, p.numero);
  }

  const cellsAtivasSet = new Set(cellsDaPalavraAtiva.map((c) => `${c.row},${c.col}`));

  return (
    <div
      className="grade-cruzadas"
      style={{
        gridTemplateColumns: `repeat(${grade[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${grade.length}, 1fr)`,
      }}
    >
      {grade.map((row, r) =>
        row.map((cell, c) => {
          if (cell === null) {
            return <div key={`${r}-${c}`} className="celula celula-vazia" aria-hidden />;
          }
          const k = `${r},${c}`;
          const numero = numeroPorCell.get(k);
          const ativa = cellAtiva && cellAtiva.row === r && cellAtiva.col === c;
          const naPalavraAtiva = cellsAtivasSet.has(k);
          const erro = erros[k];
          const valor = cellChars[k] ?? '';
          const cls = ['celula', 'celula-letra'];
          if (ativa) cls.push('celula-ativa');
          else if (naPalavraAtiva) cls.push('celula-palavra');
          if (erro) cls.push('celula-erro');
          return (
            <button
              type="button"
              key={k}
              className={cls.join(' ')}
              onClick={() => onSelecionarCelula(r, c)}
              aria-label={`linha ${r + 1} coluna ${c + 1}`}
            >
              {numero && <span className="celula-numero">{numero}</span>}
              <span className="celula-valor">{valor}</span>
            </button>
          );
        })
      )}
    </div>
  );
}
