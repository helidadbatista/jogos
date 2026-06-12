export default function ListaPalavras({ cacada, encontradas }) {
  if (!cacada) return null;
  return (
    <div className="lista-palavras-caca">
      <h3>Encontre estas palavras:</h3>
      <div className="palavras-caca">
        {cacada.colocadas.map((p, i) => (
          <span
            key={i}
            className={`palavra-caca ${encontradas.has(i) ? 'palavra-caca-feita' : ''}`}
          >
            {p.palavra}
          </span>
        ))}
      </div>
    </div>
  );
}
