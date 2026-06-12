import { sons } from '../../core/sounds.js';

export default function FimCruzadas({ venceu, totalCells, totalCorretas, pontos, onNovaRodada, onTrocarContexto, onInicio }) {
  return (
    <div className={`tela tela-fim ${venceu ? 'fim-vitoria' : 'fim-derrota'}`}>
      <div className="fim-emoji">{venceu ? '🧩✨' : '🌱'}</div>
      <h1 className="titulo">{venceu ? 'Cruzadinha completa!' : 'Quase lá!'}</h1>
      <p className="subtitulo">
        Você acertou <strong>{totalCorretas}</strong> de <strong>{totalCells}</strong> letras
      </p>

      {pontos > 0 && (
        <div className="cartao-pontos">
          <div className="pontos-total">+{pontos} {pontos === 1 ? 'ponto' : 'pontos'}!</div>
        </div>
      )}

      <div className="acoes-fim">
        <button className="botao-principal" onClick={() => { sons.clique(); onNovaRodada(); }}>
          🔁 Outra cruzadinha
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onTrocarContexto(); }}>
          🎨 Trocar dificuldade
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onInicio(); }}>
          🏠 Início
        </button>
      </div>
    </div>
  );
}
