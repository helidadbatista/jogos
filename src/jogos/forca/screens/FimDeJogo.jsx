import { sons } from '../../../core/sounds.js';

export default function FimDeJogo({ venceu, palavra, pontos, onNovaRodada, onTrocarContexto, onInicio }) {
  return (
    <div className={`tela tela-fim ${venceu ? 'fim-vitoria' : 'fim-derrota'}`}>
      <div className="fim-emoji">{venceu ? '🎉🦊🎊' : '🌱🥺'}</div>
      <h1 className="titulo">{venceu ? 'Você venceu!' : 'Quase lá!'}</h1>
      <p className="subtitulo">
        {venceu ? 'A palavra era:' : 'A palavra era:'} <strong>{palavra}</strong>
      </p>

      {pontos && venceu && (
        <div className="cartao-pontos">
          <div className="pontos-total">+{pontos.total} pontos!</div>
          <div className="pontos-breakdown">
            <span>10 base</span>
            <span>× {pontos.multIdade} idade</span>
            <span>× {pontos.multDif} dificuldade</span>
            <span>= {pontos.base}</span>
          </div>
          <div className="pontos-breakdown">
            <span>+ {pontos.bonus} bônus</span>
            <span className="pontos-subtle">({pontos.tentativasRestantes} tentativas sobrando × 5)</span>
          </div>
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
