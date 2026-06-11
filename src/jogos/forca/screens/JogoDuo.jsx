import { useEffect } from 'react';
import Forca from '../components/Forca.jsx';
import Palavra from '../components/Palavra.jsx';
import Teclado from '../components/Teclado.jsx';
import Mascote from '../../../components/Mascote.jsx';
import { useJogoCore } from '../hooks/useJogoCore.js';
import { calcularPontosDuo } from '../../../core/scoring.js';
import { sons } from '../../../core/sounds.js';

export default function JogoDuo({ palavra, dica, placar, jogadorAdivinhando, onVoltar, onFim }) {
  const j = useJogoCore({
    palavra,
    dica,
    maxErros: 6,
    dicaSempreVisivel: false,
  });

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
      const pontos = calcularPontosDuo({
        erros: j.erros,
        maxErros: j.maxErros,
        venceu: j.venceu,
      });
      const t = setTimeout(
        () => onFim({ venceu: j.venceu, palavra: j.palavra, pontos }),
        1400
      );
      return () => clearTimeout(t);
    }
  }, [j.fim, j.venceu, j.palavra, j.erros, j.maxErros, onFim]);

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

      <div className="cabecalho-jogo">
        <span className="tag tag-idade">👤 Jogador {jogadorAdivinhando} adivinha</span>
        <span className="tag tag-tema">J1: {placar?.[1] ?? 0} pts</span>
        <span className="tag tag-dificuldade">J2: {placar?.[2] ?? 0} pts</span>
      </div>

      <div className="painel-superior">
        <Mascote estado={estadoMascote} />
        <Forca erros={j.erros} maxErros={j.maxErros} />
        <div className="info">
          <div className="info-erros">
            Tentativas: <strong>{j.maxErros - j.erros}</strong> / {j.maxErros}
          </div>
          {j.dica && j.dicaPedida && <div className="info-dica">💡 {j.dica}</div>}
          {j.dica && !j.dicaPedida && (
            <button
              className="botao-dica"
              onClick={() => j.pedirDica({ custaTentativa: false })}
              disabled={j.fim}
            >
              💡 Ver dica do Jogador 1
            </button>
          )}
          {!j.dica && <div className="info-dica info-sem-dica">Sem dica nessa rodada 🤐</div>}
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
