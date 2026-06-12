import { useCallback, useEffect } from 'react';
import Teclado from '../../components/Teclado.jsx';
import { sons } from '../../core/sounds.js';
import { useCruzadas } from './useCruzadas.js';
import GradeCruzadas from './GradeCruzadas.jsx';
import ListaDicas from './ListaDicas.jsx';

const ROTULO_DIFICULDADE = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
const ROTULO_IDADE = { '4-6': '🐣 4-6 anos', '7-9': '🐥 7-9 anos', '10-12': '🦅 10-12 anos' };

export default function JogoCruzadas({ idade, dificuldade, onVoltar, onFim }) {
  const j = useCruzadas({ idade, dificuldade });

  const handleLetra = useCallback(
    (letra) => {
      sons.acerto();
      j.adicionarLetra(letra);
    },
    [j]
  );

  function verificar() {
    sons.clique();
    const r = j.verificar();
    if (r.todasCertas && j.todasPreenchidas) {
      sons.vitoria();
      setTimeout(() => onFim({ venceu: true, totalCells: j.totalCells, totalCorretas: j.totalCorretas }), 600);
    } else if (r.totalErros > 0) {
      sons.erro();
    }
  }

  function desistir() {
    if (!confirm('Desistir da rodada e ver as respostas?')) return;
    sons.derrota();
    onFim({ venceu: false, totalCells: j.totalCells, totalCorretas: j.totalCorretas });
  }

  useEffect(() => {
    if (j.todasPreenchidas) {
      const r = j.verificar();
      if (r.todasCertas) {
        sons.vitoria();
        const t = setTimeout(() => onFim({ venceu: true, totalCells: j.totalCells, totalCorretas: j.totalCorretas }), 600);
        return () => clearTimeout(t);
      }
    }
  }, [j.todasPreenchidas]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Backspace') {
        e.preventDefault();
        j.apagarLetra();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        verificar();
        return;
      }
      const letra = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letra)) {
        handleLetra(letra);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!j.cruzada) {
    return (
      <div className="tela tela-jogo">
        <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Menu</button>
        <h1 className="titulo">Não foi possível montar a cruzadinha</h1>
        <p className="subtitulo">Tente outra dificuldade ou idade.</p>
      </div>
    );
  }

  const dicaAtiva = j.palavraAtiva?.dicas?.[0];
  const dirRotulo = j.palavraAtiva?.dir === 'h' ? 'horizontal' : 'vertical';

  return (
    <div className="tela tela-jogo tela-cruzadas">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Menu</button>

      <div className="cabecalho-jogo">
        <span className="tag tag-idade">{ROTULO_IDADE[idade] ?? idade}</span>
        <span className="tag tag-dificuldade">{ROTULO_DIFICULDADE[dificuldade] ?? dificuldade}</span>
        <span className="tag tag-tema">⭐ {j.totalCorretas} / {j.totalCells}</span>
      </div>

      {j.palavraAtiva && (
        <div className="dica-ativa">
          <span className="dica-ativa-numero">{j.palavraAtiva.numero} {dirRotulo}:</span>
          <span className="dica-ativa-texto">{dicaAtiva}</span>
        </div>
      )}

      <GradeCruzadas
        cruzada={j.cruzada}
        cellChars={j.cellChars}
        erros={j.erros}
        cellAtiva={j.cellAtiva}
        palavraAtiva={j.palavraAtiva}
        cellsDaPalavraAtiva={j.cellsDaPalavraAtiva}
        onSelecionarCelula={j.selecionarCelula}
      />

      <Teclado modoLivre onLetra={handleLetra} onApagar={j.apagarLetra} />

      <div className="acoes-cruzadas">
        <button className="botao-principal" onClick={verificar}>✅ Verificar</button>
        <button className="botao-secundario" onClick={desistir}>🏳️ Desistir</button>
      </div>

      <ListaDicas
        cruzada={j.cruzada}
        palavraAtivaIdx={j.palavraAtivaIdx}
        onSelecionarPalavra={(idx) => { sons.clique(); j.selecionarPalavra(idx); }}
      />
    </div>
  );
}
