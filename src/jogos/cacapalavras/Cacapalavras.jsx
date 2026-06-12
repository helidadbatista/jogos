import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCaca from './MenuCaca.jsx';
import JogoCaca from './JogoCaca.jsx';
import FimCaca from './FimCaca.jsx';

const PONTOS = { facil: 2, medio: 5, dificil: 10 };

export default function Cacapalavras({ idade, onGanharPontos }) {
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
        <MenuCaca
          dificuldade={dificuldade}
          setDificuldade={setDificuldade}
          onJogar={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
        />
      )}
      {tela === 'jogo' && (
        <JogoCaca
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
        <FimCaca
          venceu={resultado?.venceu}
          total={resultado?.total ?? 0}
          encontradas={resultado?.encontradas ?? 0}
          pontos={resultado?.pontos ?? 0}
          onNovaRodada={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
          onTrocarContexto={() => setTela('menu')}
          onInicio={() => navigate('/')}
        />
      )}
    </>
  );
}
