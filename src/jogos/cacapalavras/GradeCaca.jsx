import { useRef } from 'react';

export default function GradeCaca({
  cacada,
  cellsEncontradas,
  cellsSelecao,
  feedback,
  revelado,
  onIniciar,
  onMover,
  onFinalizar,
  onCancelar,
}) {
  const containerRef = useRef(null);

  if (!cacada) return null;
  const { grade } = cacada;
  const selSet = new Set(cellsSelecao.map((c) => `${c.row},${c.col}`));

  function cellFromPoint(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const cell = el.closest('[data-row]');
    if (!cell) return null;
    return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
  }

  function handlePointerDown(e) {
    if (revelado) return;
    e.preventDefault();
    const c = cellFromPoint(e.clientX, e.clientY);
    if (!c) return;
    containerRef.current?.setPointerCapture(e.pointerId);
    onIniciar(c.row, c.col);
  }

  function handlePointerMove(e) {
    if (revelado || cellsSelecao.length === 0) return;
    const c = cellFromPoint(e.clientX, e.clientY);
    if (!c) return;
    onMover(c.row, c.col);
  }

  function handlePointerUp(e) {
    if (revelado) return;
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
    onFinalizar();
  }

  function handlePointerCancel() {
    if (revelado) return;
    onCancelar();
  }

  return (
    <div
      ref={containerRef}
      className={`grade-caca ${feedback?.tipo === 'erro' ? 'grade-caca-shake' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${grade[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${grade.length}, 1fr)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {grade.map((row, r) =>
        row.map((letra, c) => {
          const k = `${r},${c}`;
          const cls = ['caca-celula'];
          if (cellsEncontradas.has(k)) cls.push('caca-encontrada');
          if (selSet.has(k)) cls.push('caca-selecao');
          if (feedback?.tipo === 'acerto' && selSet.has(k)) cls.push('caca-acerto-flash');
          return (
            <div key={k} data-row={r} data-col={c} className={cls.join(' ')}>
              {letra}
            </div>
          );
        })
      )}
    </div>
  );
}
