const FILAS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function Teclado({
  usadas,
  acertadas,
  onLetra,
  desativado,
  modoLivre = false,
  onApagar,
}) {
  const usadasSet = usadas ?? new Set();
  const acertadasSet = acertadas ?? new Set();

  return (
    <div className="teclado">
      {FILAS.map((fila, i) => (
        <div key={i} className="fila-tecla">
          {fila.map((letra) => {
            const usada = !modoLivre && usadasSet.has(letra);
            const acertou = !modoLivre && acertadasSet.has(letra);
            const cls = ['tecla'];
            if (acertou) cls.push('tecla-acerto');
            else if (usada) cls.push('tecla-erro');
            return (
              <button
                key={letra}
                className={cls.join(' ')}
                disabled={(!modoLivre && usada) || desativado}
                onClick={() => onLetra(letra)}
                aria-label={`letra ${letra}`}
              >
                {letra}
              </button>
            );
          })}
          {i === FILAS.length - 1 && onApagar && (
            <button
              type="button"
              className="tecla tecla-apagar"
              onClick={onApagar}
              disabled={desativado}
              aria-label="apagar última letra"
              title="Apagar"
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
