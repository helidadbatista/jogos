import { sons } from '../../../core/sounds.js';

export default function FimDuo({ venceu, palavra, pontos, placar, jogadorAdivinhando, onTrocarPapeis, onMesmosPapeis, onInicio }) {
  const vencedor = venceu ? jogadorAdivinhando : (jogadorAdivinhando === 2 ? 1 : 2);
  return (
    <div className={`tela tela-fim ${venceu ? 'fim-vitoria' : 'fim-derrota'}`}>
      <div className="fim-emoji">{venceu ? '🏆' : '🌱'}</div>
      <h1 className="titulo">Jogador {vencedor} venceu!</h1>
      <p className="subtitulo">
        A palavra era: <strong>{palavra}</strong>
      </p>

      {pontos && venceu && pontos.total > 0 && (
        <div className="cartao-pontos">
          <div className="pontos-total">Jogador {jogadorAdivinhando} ganhou +{pontos.total} {pontos.total === 1 ? 'ponto' : 'pontos'}</div>
        </div>
      )}

      <div className="placar-duo">
        <div className={`placar-jogador ${vencedor === 1 ? 'placar-vencedor' : ''}`}>
          <div className="placar-label">👤 Jogador 1</div>
          <div className="placar-valor">{placar?.[1] ?? 0}</div>
        </div>
        <div className="placar-separador">x</div>
        <div className={`placar-jogador ${vencedor === 2 ? 'placar-vencedor' : ''}`}>
          <div className="placar-label">👤 Jogador 2</div>
          <div className="placar-valor">{placar?.[2] ?? 0}</div>
        </div>
      </div>

      <div className="acoes-fim">
        <button className="botao-principal" onClick={() => { sons.clique(); onTrocarPapeis(); }}>
          🔁 Trocar papéis
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onMesmosPapeis(); }}>
          🔂 Mesmos papéis
        </button>
        <button className="botao-secundario" onClick={() => { sons.clique(); onInicio(); }}>
          🏠 Menu inicial
        </button>
      </div>
    </div>
  );
}
