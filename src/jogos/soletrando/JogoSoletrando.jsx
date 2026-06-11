import { useCallback, useEffect, useState } from 'react';
import Mascote from '../../components/Mascote.jsx';
import Teclado from '../../components/Teclado.jsx';
import { sons } from '../../core/sounds.js';
import { falar } from '../../core/falar.js';
import { useSoletrando } from './useSoletrando.js';

const ROTULO_DIFICULDADE = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
const ROTULO_IDADE = { '4-6': '🐣 4-6 anos', '7-9': '🐥 7-9 anos', '10-12': '🦅 10-12 anos' };

export default function JogoSoletrando({ idade, dificuldade, onVoltar, onFim }) {
  const j = useSoletrando({ idade, dificuldade });
  const [resposta, setResposta] = useState('');
  const [dicasReveladas, setDicasReveladas] = useState(0);

  const totalDicas = j.dicas.length;
  const inicialReveladas = idade === '4-6' ? Math.min(1, totalDicas) : 0;

  useEffect(() => {
    if (j.atual) {
      setResposta('');
      setDicasReveladas(inicialReveladas);
      const t = setTimeout(() => {
        falar(j.atual.palavra);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [j.atual, idade, inicialReveladas]);

  useEffect(() => {
    if (j.fim) {
      const t = setTimeout(() => onFim({ acertos: j.totalAcertos, total: j.total, acertosLista: j.acertos }), 800);
      return () => clearTimeout(t);
    }
  }, [j.fim, j.totalAcertos, j.total, j.acertos, onFim]);

  const feedback = j.feedbackUltimo;

  const adicionarLetra = useCallback((letra) => {
    if (feedback) return;
    setResposta((r) => (r.length >= 20 ? r : r + letra));
  }, [feedback]);

  const apagarLetra = useCallback(() => {
    if (feedback) return;
    setResposta((r) => r.slice(0, -1));
  }, [feedback]);

  function confirmar() {
    if (feedback) {
      sons.clique();
      j.proxima();
      return;
    }
    if (!resposta.trim()) return;
    const acertou = j.tentar(resposta);
    if (acertou) sons.acerto();
    else sons.erro();
  }

  function pedirDica() {
    if (dicasReveladas >= totalDicas) return;
    sons.dica();
    setDicasReveladas((n) => n + 1);
  }

  useEffect(() => {
    function onKey(e) {
      if (feedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          confirmar();
        }
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        apagarLetra();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmar();
        return;
      }
      const letra = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letra)) {
        adicionarLetra(letra);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function ouvir() {
    sons.clique();
    falar(j.atual.palavra);
  }

  if (!j.atual) return null;

  const estadoMascote = feedback ? (feedback.acertou ? 'festa' : 'triste') : 'feliz';
  const textoExibido = feedback ? feedback.resposta : resposta;
  const dicasParaMostrar = idade === '4-6'
    ? j.dicas.slice(-1)
    : j.dicas.slice(0, dicasReveladas);
  const podePedirDica = idade !== '4-6' && dicasReveladas < totalDicas;

  return (
    <div className="tela tela-jogo">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Menu</button>

      <div className="cabecalho-jogo">
        <span className="tag tag-idade">{ROTULO_IDADE[idade] ?? idade}</span>
        <span className="tag tag-dificuldade">{ROTULO_DIFICULDADE[dificuldade] ?? dificuldade}</span>
      </div>

      <div className="progresso-soletrando">
        Palavra {j.indice + 1} de {j.total} &nbsp;|&nbsp; Acertos: <strong>{j.totalAcertos}</strong>
      </div>

      <div className="painel-superior painel-soletrando">
        <Mascote estado={estadoMascote} />
        <div className="botoes-tts">
          <button type="button" className="botao-principal" onClick={ouvir}>
            🔊 Ouvir de novo
          </button>
          {podePedirDica && (
            <button type="button" className="botao-dica" onClick={pedirDica}>
              💡 {dicasReveladas === 0 ? 'Ver dica' : `Mais uma dica (${dicasReveladas + 1}/${totalDicas})`}
            </button>
          )}
          {dicasParaMostrar.length > 0 && (
            <div className="dicas-lista">
              {dicasParaMostrar.map((d, i) => (
                <div key={i} className="info-dica">💡 {d}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`visor-soletrando ${feedback ? (feedback.acertou ? 'visor-acerto' : 'visor-erro') : ''}`} aria-label="resposta">
        {textoExibido || <span className="visor-placeholder">Use o teclado abaixo</span>}
        {!feedback && textoExibido && <span className="cursor-piscante" />}
      </div>

      {feedback && (
        <div className={`feedback ${feedback.acertou ? 'feedback-acerto' : 'feedback-erro'}`}>
          {feedback.acertou ? (
            <>🎉 Mandou bem! A palavra é <strong>{feedback.palavra}</strong></>
          ) : (
            <>🌱 A palavra certa era <strong>{feedback.palavra}</strong></>
          )}
        </div>
      )}

      <Teclado
        modoLivre
        onLetra={adicionarLetra}
        onApagar={apagarLetra}
        desativado={!!feedback}
      />

      <button type="button" className="botao-principal" onClick={confirmar}>
        {feedback ? 'Próxima ➜' : 'Confirmar'}
      </button>
    </div>
  );
}
