import { sons } from '../../../core/sounds.js';

export default function MenuForca({ idade, onJogarSolo, onJogarDuo, onVoltarHub }) {
  return (
    <div className="tela tela-inicio">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltarHub(); }}>← Início</button>
      <h1 className="titulo">🎯 Jogo da Forca</h1>
      <p className="subtitulo">Como você quer jogar?</p>

      <div className="cards cards-modos">
        <button className="card card-modo" onClick={() => { sons.clique(); onJogarSolo(); }}>
          <div className="card-emoji-grande">🎮</div>
          <div className="card-nome">Jogar sozinho</div>
          <div className="card-desc">
            {idade ? `Sua faixa: ${idade} anos` : 'Defina a idade no Hub'}
          </div>
        </button>
        <button className="card card-modo" onClick={() => { sons.clique(); onJogarDuo(); }}>
          <div className="card-emoji-grande">👫</div>
          <div className="card-nome">Com um amigo</div>
          <div className="card-desc">Um pensa na palavra, o outro adivinha</div>
        </button>
      </div>
    </div>
  );
}
