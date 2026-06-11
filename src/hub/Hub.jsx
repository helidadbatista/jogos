import { Link } from 'react-router-dom';
import { sons } from '../core/sounds.js';

const FAIXAS = [
  { id: '4-6', nome: '4-6 anos', emoji: '🐣' },
  { id: '7-9', nome: '7-9 anos', emoji: '🐥' },
  { id: '10-12', nome: '10-12 anos', emoji: '🦅' },
];

const JOGOS = [
  {
    id: 'forca',
    rota: '/forca',
    nome: 'Jogo da Forca',
    emoji: '🎯',
    desc: 'Adivinhe a palavra letra por letra',
    pronto: true,
  },
  {
    id: 'soletrando',
    rota: '/soletrando',
    nome: 'Soletrando',
    emoji: '🔊',
    desc: 'Ouça a palavra e digite certinho',
    pronto: true,
  },
];

export default function Hub({ idade, setIdade, pontosTotal, pontosPorJogo, onZerarPontos }) {
  return (
    <div className="tela tela-hub">
      <div className="barra-pontos">
        <span className="badge-pontos">⭐ {pontosTotal} pontos</span>
        {pontosTotal > 0 && (
          <button className="link-zerar" onClick={() => { sons.clique(); onZerarPontos(); }}>
            🔄 Zerar
          </button>
        )}
      </div>

      <h1 className="titulo">🎈 Brincadeiras de Palavras 🎈</h1>
      <p className="subtitulo">Escolha sua idade e venha brincar!</p>

      <section className="bloco">
        <h2>Qual a sua idade?</h2>
        <div className="cards cards-pequenos">
          {FAIXAS.map((f) => (
            <button
              key={f.id}
              className={`card ${idade === f.id ? 'card-selecionado' : ''}`}
              onClick={() => { sons.clique(); setIdade(f.id); }}
            >
              <div className="card-emoji">{f.emoji}</div>
              <div className="card-nome">{f.nome}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="bloco">
        <h2>Escolha um jogo</h2>
        <div className="cards cards-jogos">
          {JOGOS.map((j) => (
            <Link
              key={j.id}
              to={idade ? j.rota : '#'}
              className={`card card-jogo ${!idade ? 'card-desabilitado' : ''}`}
              onClick={(e) => {
                if (!idade) { e.preventDefault(); return; }
                sons.clique();
              }}
            >
              <div className="card-emoji-grande">{j.emoji}</div>
              <div className="card-nome">{j.nome}</div>
              <div className="card-desc">{j.desc}</div>
              <div className="card-pontos">⭐ {pontosPorJogo[j.id] ?? 0}</div>
            </Link>
          ))}
        </div>
        {!idade && <p className="aviso-idade">↑ Escolha a idade primeiro para liberar os jogos</p>}
      </section>
    </div>
  );
}
