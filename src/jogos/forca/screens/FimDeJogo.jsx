import { sons } from '../../../core/sounds.js';

export default function FimDeJogo({ venceu, palavra, pontos, onNovaRodada, onTrocarContexto, onInicio }) {
  return (
    <div className={`tela tela-fim ${venceu ? 'fim-vitoria' : 'fim-derrota'}`}>
      <div className="fim-emoji">{venceu ? '🎉🦊🎊' : '🌱🥺'}</div>
      <h1 className="titulo">{venceu ? 'Você venceu!' : 'Quase lá!'}</h1>
      <p className="subtitulo">
        {venceu ? 'A palavra era:' : 'A palavra era:'} <strong>{palavra}</strong>
      </p>

      {pontos && venceu && pontos.total > 0 && (
        <div className="cartao-pontos">
          <div className="pontos-total">+{pontos.total} {pontos.total === 1 ? 'ponto' : 'pontos'}!</div>
        </div>
      )}

      <div className="acoes-fim">
        <button className="botao-principal" onClick={() => { sons.clique(); onNovaRodada(); }}>
          🔁 Outra palavra
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onTrocarContexto(); }}>
          🎨 Trocar tema/dificuldade
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onInicio(); }}>
          🏠 Menu inicial
        </button>
      </div>
    </div>
  );
}
