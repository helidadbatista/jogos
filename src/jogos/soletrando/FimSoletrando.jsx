import { sons } from '../../core/sounds.js';

export default function FimSoletrando({ acertos, total, acertosLista, pontos, onNovaRodada, onTrocarContexto, onInicio }) {
  const taxa = total > 0 ? acertos / total : 0;
  const emoji = taxa === 1 ? '🏆🎉' : taxa >= 0.6 ? '🎊' : '🌱';
  const titulo = taxa === 1 ? 'Perfeito!' : taxa >= 0.6 ? 'Mandou bem!' : 'Continue treinando!';

  return (
    <div className={`tela tela-fim ${taxa >= 0.6 ? 'fim-vitoria' : 'fim-derrota'}`}>
      <div className="fim-emoji">{emoji}</div>
      <h1 className="titulo">{titulo}</h1>
      <p className="subtitulo">
        Você acertou <strong>{acertos}</strong> de <strong>{total}</strong> palavras
      </p>

      {pontos > 0 && (
        <div className="cartao-pontos">
          <div className="pontos-total">+{pontos} pontos!</div>
          <div className="pontos-breakdown">
            <span className="pontos-subtle">{acertos} × pontos por acerto (idade + dificuldade)</span>
          </div>
        </div>
      )}

      <div className="resumo-soletrando">
        {acertosLista?.map((a, i) => (
          <div key={i} className={`resumo-linha ${a.acertou ? 'ok' : 'ko'}`}>
            <span>{a.acertou ? '✅' : '❌'}</span>
            <span className="resumo-palavra">{a.palavra}</span>
            {!a.acertou && a.resposta && (
              <span className="resumo-resposta">você escreveu: {a.resposta}</span>
            )}
          </div>
        ))}
      </div>

      <div className="acoes-fim">
        <button className="botao-principal" onClick={() => { sons.clique(); onNovaRodada(); }}>
          🔁 Outra rodada
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onTrocarContexto(); }}>
          🎨 Trocar tema/dificuldade
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onInicio(); }}>
          🏠 Hub
        </button>
      </div>
    </div>
  );
}
