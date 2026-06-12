import { useNavigate } from 'react-router-dom';
import { sons } from '../../core/sounds.js';

const DIFS = [
  { id: 'facil', nome: 'Fácil', emoji: '🟢', desc: '5 palavras, horizontal e vertical' },
  { id: 'medio', nome: 'Médio', emoji: '🟡', desc: '7 palavras, vai e volta' },
  { id: 'dificil', nome: 'Difícil', emoji: '🔴', desc: '10 palavras, todas as direções' },
];

export default function MenuCaca({ dificuldade, setDificuldade, onJogar }) {
  const navigate = useNavigate();
  return (
    <div className="tela tela-contexto">
      <button className="botao-voltar" onClick={() => { sons.clique(); navigate('/'); }}>← Início</button>
      <h1 className="titulo">🔎 Caça-Palavras</h1>
      <p className="subtitulo">Arraste o dedo sobre as letras para marcar as palavras.</p>

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
