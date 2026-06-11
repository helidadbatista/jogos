import { sons } from '../../../core/sounds.js';

export default function Passagem({ proximoJogador = 2, onContinuar }) {
  return (
    <div className="tela tela-passagem">
      <div className="passagem-emoji">🤝</div>
      <h1 className="titulo">Passe o aparelho!</h1>
      <p className="subtitulo">
        Agora é a vez do <strong>Jogador {proximoJogador}</strong>.
        <br />
        Não espie a tela do outro 😉
      </p>
      <button className="botao-principal" onClick={() => { sons.clique(); onContinuar(); }}>
        Sou o Jogador {proximoJogador}, estou pronto!
      </button>
    </div>
  );
}
