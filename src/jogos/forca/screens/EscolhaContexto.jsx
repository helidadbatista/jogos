import { sons } from '../../../core/sounds.js';

const DIFS = [
  { id: 'facil', nome: 'Fácil', emoji: '🟢', desc: 'Palavras curtinhas' },
  { id: 'medio', nome: 'Médio', emoji: '🟡', desc: 'Palavras médias' },
  { id: 'dificil', nome: 'Difícil', emoji: '🔴', desc: 'Palavras grandes' },
];

export default function EscolhaContexto({ dificuldade, setDificuldade, onJogar, onVoltar }) {
  return (
    <div className="tela tela-contexto">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Voltar</button>
      <h1 className="titulo">Escolha a dificuldade</h1>
      <p className="subtitulo">As palavras vêm sorteadas de todos os temas! 🎲</p>

      <section className="bloco">
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
        Jogar ➜
      </button>
    </div>
  );
}
