import { useEffect, useRef, useState } from 'react';
import { sons } from '../core/sounds.js';

const FAIXAS = [
  { id: '4-6', nome: '4-6 anos', emoji: '🐣' },
  { id: '7-9', nome: '7-9 anos', emoji: '🐥' },
  { id: '10-12', nome: '10-12 anos', emoji: '🦅' },
];

export default function SeletorIdade({ idade, setIdade }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  const atual = FAIXAS.find((f) => f.id === idade);

  useEffect(() => {
    function onClickFora(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    }
    if (aberto) document.addEventListener('mousedown', onClickFora);
    return () => document.removeEventListener('mousedown', onClickFora);
  }, [aberto]);

  function escolher(id) {
    sons.clique();
    setIdade(id);
    setAberto(false);
  }

  if (!atual) return null;

  return (
    <div className="seletor-idade" ref={ref}>
      <button
        className="botao-toggle botao-idade"
        onClick={() => { sons.clique(); setAberto((a) => !a); }}
        aria-label={`Idade: ${atual.nome}. Tocar para trocar.`}
        title={`Idade: ${atual.nome}`}
      >
        {atual.emoji}
      </button>
      {aberto && (
        <div className="popover-idade" role="menu">
          <div className="popover-titulo">Trocar idade</div>
          {FAIXAS.map((f) => (
            <button
              key={f.id}
              className={`opcao-idade ${f.id === idade ? 'opcao-ativa' : ''}`}
              onClick={() => escolher(f.id)}
            >
              <span className="opcao-emoji">{f.emoji}</span>
              <span className="opcao-nome">{f.nome}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
