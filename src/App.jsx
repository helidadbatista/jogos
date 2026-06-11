import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Hub from './hub/Hub.jsx';
import Forca from './jogos/forca/Forca.jsx';
import Soletrando from './jogos/soletrando/Soletrando.jsx';
import { useArmazenado } from './core/useArmazenado.js';
import { usePontuacao } from './core/usePontuacao.js';
import { setMuted, isMuted, sons } from './core/sounds.js';

export default function App() {
  const [idade, setIdade] = useArmazenado('forca:idade', null);
  const { total, porJogo, adicionar, zerar } = usePontuacao();
  const [mudo, setMudoState] = useState(isMuted());

  function toggleMudo() {
    const novo = !mudo;
    setMuted(novo);
    setMudoState(novo);
    if (!novo) sons.clique();
  }

  return (
    <HashRouter>
      <div className="app">
        <button
          className="botao-som"
          onClick={toggleMudo}
          aria-label={mudo ? 'ativar som' : 'desativar som'}
          title={mudo ? 'Ativar som' : 'Desativar som'}
        >
          {mudo ? '🔇' : '🔊'}
        </button>

        <Routes>
          <Route
            path="/"
            element={
              <Hub
                idade={idade}
                setIdade={setIdade}
                pontosTotal={total}
                pontosPorJogo={porJogo}
                onZerarPontos={zerar}
              />
            }
          />
          <Route
            path="/forca"
            element={<Forca idade={idade} onGanharPontos={(v) => adicionar('forca', v)} />}
          />
          <Route
            path="/soletrando"
            element={<Soletrando idade={idade} onGanharPontos={(v) => adicionar('soletrando', v)} />}
          />
        </Routes>
      </div>
    </HashRouter>
  );
}
