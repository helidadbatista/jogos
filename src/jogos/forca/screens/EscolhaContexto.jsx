import palavras from '../../../core/palavras.json';
import { sons } from '../../../core/sounds.js';

const DIFS = [
  { id: 'facil', nome: 'Fácil', emoji: '🟢' },
  { id: 'medio', nome: 'Médio', emoji: '🟡' },
  { id: 'dificil', nome: 'Difícil', emoji: '🔴' },
];

export default function EscolhaContexto({ tema, setTema, dificuldade, setDificuldade, onJogar, onVoltar }) {
  const temas = Object.entries(palavras.temas);
  const pronto = !!tema && !!dificuldade;
  return (
    <div className="tela tela-contexto">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Voltar</button>
      <h1 className="titulo">Escolha tema e dificuldade</h1>

      <section className="bloco">
        <h2>Tema</h2>
        <div className="cards cards-tema">
          {temas.map(([id, t]) => (
            <button
              key={id}
              className={`card card-tema ${tema === id ? 'card-selecionado' : ''}`}
              onClick={() => { sons.clique(); setTema(id); }}
            >
              <div className="card-emoji-grande">{t.emoji}</div>
              <div className="card-nome">{t.nome}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="bloco">
        <h2>Dificuldade</h2>
        <div className="cards cards-pequenos">
          {DIFS.map((d) => (
            <button
              key={d.id}
              className={`card ${dificuldade === d.id ? 'card-selecionado' : ''}`}
              onClick={() => { sons.clique(); setDificuldade(d.id); }}
            >
              <div className="card-emoji">{d.emoji}</div>
              <div className="card-nome">{d.nome}</div>
            </button>
          ))}
        </div>
      </section>

      <button
        className="botao-principal"
        disabled={!pronto}
        onClick={() => { sons.clique(); onJogar(); }}
      >
        Jogar ➜
      </button>
    </div>
  );
}
