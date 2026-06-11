import { useEffect } from 'react';
import Forca from '../components/Forca.jsx';
import Palavra from '../components/Palavra.jsx';
import Teclado from '../components/Teclado.jsx';
import Mascote from '../../../components/Mascote.jsx';
import { useJogo } from '../hooks/useJogo.js';
import palavrasData from '../../../core/palavras.json';
import { calcularPontos } from '../../../core/scoring.js';
import { sons } from '../../../core/sounds.js';

const ROTULO_DIFICULDADE = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
const ROTULO_IDADE = { '4-6': '🐣 4-6 anos', '7-9': '🐥 7-9 anos', '10-12': '🦅 10-12 anos' };

export default function Jogo({ idade, dificuldade, tema, onVoltar, onFim }) {
  const j = useJogo({ idade, dificuldade, tema });

  useEffect(() => {
    function onKey(e) {
      const letra = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letra)) j.tentarLetra(letra);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [j]);

  useEffect(() => {
    if (j.fim) {
      const pontos = calcularPontos({ dificuldade, venceu: j.venceu });
      const t = setTimeout(
        () => onFim({ venceu: j.venceu, palavra: j.palavra, pontos }),
        1400
      );
      return () => clearTimeout(t);
    }
  }, [j.fim, j.venceu, j.palavra, j.erros, j.maxErros, idade, dificuldade, onFim]);

  const estadoMascote = j.venceu
    ? 'festa'
    : j.perdeu
    ? 'triste'
    : j.erros > j.maxErros / 2
    ? 'pensando'
    : 'feliz';

  return (
    <div className="tela tela-jogo">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Menu</button>

      <div className="cabecalho-jogo" aria-label="contexto da rodada">
        <span className="tag tag-tema">
          {palavrasData.temas[tema]?.emoji} {palavrasData.temas[tema]?.nome}
        </span>
        <span className="tag tag-idade">{ROTULO_IDADE[idade] ?? idade}</span>
        <span className="tag tag-dificuldade">{ROTULO_DIFICULDADE[dificuldade] ?? dificuldade}</span>
      </div>

      <div className="painel-superior">
        <Mascote estado={estadoMascote} />
        <Forca erros={j.erros} maxErros={j.maxErros} />
        <div className="info">
          <div className="info-erros">
            Tentativas: <strong>{j.maxErros - j.erros}</strong> / {j.maxErros}
          </div>
          {(j.dicaSempreVisivel || j.dicaPedida) && (
            <div className="info-dica">💡 {j.dica}</div>
          )}
          {!j.dicaSempreVisivel && !j.dicaPedida && (
            <button className="botao-dica" onClick={j.pedirDica} disabled={j.fim}>
              💡 Pedir dica
            </button>
          )}
        </div>
      </div>

      <Palavra palavra={j.palavra} acertadas={j.acertadas} revelar={j.perdeu} />

      <Teclado
        usadas={j.usadas}
        acertadas={j.acertadas}
        onLetra={j.tentarLetra}
        desativado={j.fim}
      />
    </div>
  );
}
