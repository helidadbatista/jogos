import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCruzadas from './MenuCruzadas.jsx';
import JogoCruzadas from './JogoCruzadas.jsx';
import FimCruzadas from './FimCruzadas.jsx';

const PONTOS = { facil: 2, medio: 5, dificil: 10 };

export default function Cruzadas({ idade, onGanharPontos }) {
  const navigate = useNavigate();
  const [tela, setTela] = useState('menu');
  const [dificuldade, setDificuldade] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [reiniciarKey, setReiniciarKey] = useState(0);

  if (!idade) {
    return (
      <div className="tela">
        <h1 className="titulo">Defina a idade primeiro</h1>
        <button className="botao-principal" onClick={() => navigate('/')}>← Voltar ao Início</button>
      </div>
    );
  }

  return (
    <>
      {tela === 'menu' && (
        <MenuCruzadas
          dificuldade={dificuldade}
          setDificuldade={setDificuldade}
          onJogar={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
        />
      )}
      {tela === 'jogo' && (
        <JogoCruzadas
          key={reiniciarKey}
          idade={idade}
          dificuldade={dificuldade}
          onVoltar={() => setTela('menu')}
          onFim={(r) => {
            const ganhos = r.venceu ? (PONTOS[dificuldade] ?? 2) : 0;
            if (ganhos) onGanharPontos(ganhos);
            setResultado({ ...r, pontos: ganhos });
            setTela('fim');
          }}
        />
      )}
      {tela === 'fim' && (
        <FimCruzadas
          venceu={resultado?.venceu}
          totalCells={resultado?.totalCells ?? 0}
          totalCorretas={resultado?.totalCorretas ?? 0}
          pontos={resultado?.pontos ?? 0}
          onNovaRodada={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
          onTrocarContexto={() => setTela('menu')}
          onInicio={() => navigate('/')}
        />
      )}
    </>
  );
}
