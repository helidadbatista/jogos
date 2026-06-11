export default function Palavra({ palavra, acertadas, revelar }) {
  return (
    <div className="palavra" aria-label="palavra-secreta">
      {palavra.split('').map((letra, i) => {
        if (letra === ' ') return <span key={i} className="letra-espaco" aria-hidden />;
        const mostra = revelar || acertadas.has(letra);
        return (
          <span key={i} className={`letra ${mostra ? 'visivel' : ''}`}>
            {mostra ? letra : ''}
          </span>
        );
      })}
    </div>
  );
}
