import { useEffect, useRef, useState } from 'react';
import Mascote from '../../components/Mascote.jsx';
import { sons } from '../../core/sounds.js';
import { falar } from '../../core/falar.js';
import { useSoletrando } from './useSoletrando.js';

const ROTULO_DIFICULDADE = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
const ROTULO_IDADE = { '4-6': '🐣 4-6 anos', '7-9': '🐥 7-9 anos', '10-12': '🦅 10-12 anos' };

export default function JogoSoletrando({ idade, dificuldade, onVoltar, onFim }) {
  const j = useSoletrando({ idade, dificuldade });
  const [resposta, setResposta] = useState('');
  const [mostrarDica, setMostrarDica] = useState(idade === '4-6');
  const inputRef = useRef(null);

  useEffect(() => {
    if (j.atual) {
      setResposta('');
      setMostrarDica(idade === '4-6');
      const t = setTimeout(() => {
        falar(j.atual.palavra);
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [j.atual, idade]);

  useEffect(() => {
    if (j.fim) {
      const t = setTimeout(() => onFim({ acertos: j.totalAcertos, total: j.total, acertosLista: j.acertos }), 800);
      return () => clearTimeout(t);
    }
  }, [j.fim, j.totalAcertos, j.total, j.acertos, onFim]);

  function ouvir() {
    sons.clique();
    falar(j.atual.palavra);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (j.feedbackUltimo) {
      sons.clique();
      j.proxima();
      return;
    }
    if (!resposta.trim()) return;
    const acertou = j.tentar(resposta);
    if (acertou) sons.acerto();
    else sons.erro();
  }

  if (!j.atual) return null;

  const feedback = j.feedbackUltimo;
  const estadoMascote = feedback ? (feedback.acertou ? 'festa' : 'triste') : 'feliz';

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
          {(idade !== '4-6') && !mostrarDica && (
            <button type="button" className="botao-dica" onClick={() => setMostrarDica(true)}>
              💡 Ver dica
            </button>
          )}
          {mostrarDica && j.dica && (
            <div className="info-dica">💡 {j.dica}</div>
          )}
        </div>
      </div>

      <form className="form-soletrando" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="input-grande input-soletrando"
          value={feedback ? feedback.resposta : resposta}
          onChange={(e) => setResposta(e.target.value)}
          placeholder="Escreva aqui..."
          autoFocus
          disabled={!!feedback}
          maxLength={20}
        />
        {feedback ? (
          <div className={`feedback ${feedback.acertou ? 'feedback-acerto' : 'feedback-erro'}`}>
            {feedback.acertou ? (
              <>🎉 Mandou bem! A palavra é <strong>{feedback.palavra}</strong></>
            ) : (
              <>🌱 A palavra certa era <strong>{feedback.palavra}</strong></>
            )}
          </div>
        ) : null}
        <button type="submit" className="botao-principal">
          {feedback ? 'Próxima ➜' : 'Confirmar'}
        </button>
      </form>
    </div>
  );
}
