const FILAS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function Teclado({ usadas, acertadas, onLetra, desativado }) {
  return (
    <div className="teclado">
      {FILAS.map((fila, i) => (
        <div key={i} className="fila-tecla">
          {fila.map((letra) => {
            const usada = usadas.has(letra);
            const acertou = acertadas.has(letra);
            const cls = ['tecla'];
            if (acertou) cls.push('tecla-acerto');
            else if (usada) cls.push('tecla-erro');
            return (
              <button
                key={letra}
                className={cls.join(' ')}
                disabled={usada || desativado}
                onClick={() => onLetra(letra)}
                aria-label={`letra ${letra}`}
              >
                {letra}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
