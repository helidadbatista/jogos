import { useEffect } from 'react';
import { sons } from '../../core/sounds.js';
import { useCacaPalavras } from './useCacaPalavras.js';
import GradeCaca from './GradeCaca.jsx';
import ListaPalavras from './ListaPalavras.jsx';

const ROTULO_DIFICULDADE = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
const ROTULO_IDADE = { '4-6': '🐣 4-6 anos', '7-9': '🐥 7-9 anos', '10-12': '🦅 10-12 anos' };

export default function JogoCaca({ idade, dificuldade, onVoltar, onFim }) {
  const j = useCacaPalavras({ idade, dificuldade });

  useEffect(() => {
    if (j.venceu) {
      sons.vitoria();
      const t = setTimeout(() => onFim({ venceu: true, total: j.totalPalavras, encontradas: j.totalEncontradas }), 800);
      return () => clearTimeout(t);
    }
  }, [j.venceu, j.totalPalavras, j.totalEncontradas, onFim]);

  function finalizar() {
    const r = j.finalizarSelecao();
    if (r?.acertou) sons.acerto();
    else if (r && !r.acertou) sons.erro();
  }

  function desistir() {
    if (!confirm('Desistir e ver onde estão as palavras?')) return;
    sons.derrota();
    j.revelar();
  }

  function continuarFim() {
    sons.clique();
    onFim({ venceu: false, total: j.totalPalavras, encontradas: j.encontradasAntesRevelar });
  }

  if (!j.cacada) {
    return (
      <div className="tela tela-jogo">
        <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Menu</button>
        <h1 className="titulo">Não foi possível montar o caça-palavras</h1>
      </div>
    );
  }

  return (
    <div className="tela tela-jogo tela-caca">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Menu</button>

      <div className="cabecalho-jogo">
        <span className="tag tag-idade">{ROTULO_IDADE[idade] ?? idade}</span>
        <span className="tag tag-dificuldade">{ROTULO_DIFICULDADE[dificuldade] ?? dificuldade}</span>
        <span className="tag tag-tema">⭐ {j.totalEncontradas} / {j.totalPalavras}</span>
      </div>

      {j.feedback?.tipo === 'acerto' && (
        <div className="caca-feedback caca-feedback-acerto">🎉 Achou: <strong>{j.feedback.palavra}</strong></div>
      )}

      <GradeCaca
        cacada={j.cacada}
        cellsEncontradas={j.cellsEncontradas}
        cellsSelecao={j.cellsSelecao}
        feedback={j.feedback}
        revelado={j.revelado}
        onIniciar={j.iniciarSelecao}
        onMover={j.atualizarSelecao}
        onFinalizar={finalizar}
        onCancelar={j.cancelarSelecao}
      />

      <ListaPalavras cacada={j.cacada} encontradas={j.encontradas} />

      <div className="acoes-cruzadas">
        {!j.revelado ? (
          <button className="botao-secundario" onClick={desistir}>🏳️ Desistir</button>
        ) : (
          <>
            <p className="aviso-revelado">
              Você encontrou {j.encontradasAntesRevelar} de {j.totalPalavras}. Veja onde estavam as outras!
            </p>
            <button className="botao-principal" onClick={continuarFim}>Continuar ➜</button>
          </>
        )}
      </div>
    </div>
  );
}
