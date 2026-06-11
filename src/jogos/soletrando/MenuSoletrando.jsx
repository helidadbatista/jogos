import { useNavigate } from 'react-router-dom';
import { sons } from '../../core/sounds.js';
import { ttsDisponivel } from '../../core/falar.js';

const DIFS = [
  { id: 'facil', nome: 'Fácil', emoji: '🟢', desc: 'Palavras curtinhas' },
  { id: 'medio', nome: 'Médio', emoji: '🟡', desc: 'Palavras médias' },
  { id: 'dificil', nome: 'Difícil', emoji: '🔴', desc: 'Palavras grandes' },
];

export default function MenuSoletrando({ dificuldade, setDificuldade, onJogar }) {
  const navigate = useNavigate();
  const semTTS = !ttsDisponivel();

  return (
    <div className="tela tela-contexto">
      <button className="botao-voltar" onClick={() => { sons.clique(); navigate('/'); }}>← Hub</button>
      <h1 className="titulo">🔊 Soletrando</h1>
      <p className="subtitulo">Ouça a palavra com atenção e digite certinho!<br/>As palavras vêm misturadas, é surpresa! 🎲</p>

      {semTTS && (
        <div className="info-dica info-sem-dica" role="alert">
          ⚠️ Seu navegador não fala palavras. Tente Chrome ou Edge.
        </div>
      )}

      <section className="bloco">
        <h2>Escolha a dificuldade</h2>
        <div className="cards cards-pequenos">
          {DIFS.map((d) => (
            <button
              key={d.id}
              className={`card ${dificuldade === d.id ? 'card-selecionado' : ''}`}
              onClick={() => { sons.clique(); setDificuldade(d.id); }}
            >
              <div className="card-emoji">{d.emoji}</div>
              <div className="card-nome">{d.nome}</div>
              <div className="card-desc">{d.desc}</div>
            </button>
          ))}
        </div>
      </section>

      <button
        className="botao-principal"
        disabled={!dificuldade}
        onClick={() => { sons.clique(); onJogar(); }}
      >
        Começar ➜
      </button>
    </div>
  );
}
