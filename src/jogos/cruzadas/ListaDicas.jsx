export default function ListaDicas({ cruzada, palavraAtivaIdx, onSelecionarPalavra }) {
  if (!cruzada) return null;
  const horizontais = cruzada.colocadas
    .map((p, idx) => ({ ...p, idx }))
    .filter((p) => p.dir === 'h')
    .sort((a, b) => a.numero - b.numero);
  const verticais = cruzada.colocadas
    .map((p, idx) => ({ ...p, idx }))
    .filter((p) => p.dir === 'v')
    .sort((a, b) => a.numero - b.numero);

  function botaoDica(p) {
    const ativa = palavraAtivaIdx === p.idx;
    const dicaCurta = p.dicas?.[0] ?? '';
    return (
      <button
        key={p.idx}
        type="button"
        className={`item-dica ${ativa ? 'item-dica-ativa' : ''}`}
        onClick={() => onSelecionarPalavra(p.idx)}
      >
        <span className="dica-numero">{p.numero}.</span>
        <span className="dica-texto">{dicaCurta}</span>
      </button>
    );
  }

  return (
    <div className="lista-dicas">
      {horizontais.length > 0 && (
        <div className="grupo-dicas">
          <h3>➡️ Horizontais</h3>
          {horizontais.map(botaoDica)}
        </div>
      )}
      {verticais.length > 0 && (
        <div className="grupo-dicas">
          <h3>⬇️ Verticais</h3>
          {verticais.map(botaoDica)}
        </div>
      )}
    </div>
  );
}
