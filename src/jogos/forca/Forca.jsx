import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuForca from './screens/MenuForca.jsx';
import EscolhaContexto from './screens/EscolhaContexto.jsx';
import Jogo from './screens/Jogo.jsx';
import FimDeJogo from './screens/FimDeJogo.jsx';
import PrepararDuo from './screens/PrepararDuo.jsx';
import Passagem from './screens/Passagem.jsx';
import JogoDuo from './screens/JogoDuo.jsx';
import FimDuo from './screens/FimDuo.jsx';

export default function Forca({ idade, onGanharPontos }) {
  const navigate = useNavigate();
  const [tela, setTela] = useState('menu');
  const [dificuldade, setDificuldade] = useState(null);
  const [tema, setTema] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [reiniciarKey, setReiniciarKey] = useState(0);

  const [duo, setDuo] = useState({
    palavra: '',
    dica: '',
    jogadorEscritor: 1,
    placar: { 1: 0, 2: 0 },
  });

  const irHub = () => navigate('/');

  if (!idade) {
    return (
      <div className="tela">
        <h1 className="titulo">Defina a idade primeiro</h1>
        <button className="botao-principal" onClick={irHub}>← Voltar ao Início</button>
      </div>
    );
  }

  return (
    <>
      {tela === 'menu' && (
        <MenuForca
          idade={idade}
          onJogarSolo={() => setTela('contexto')}
          onJogarDuo={() => {
            setDuo({ palavra: '', dica: '', jogadorEscritor: 1, placar: { 1: 0, 2: 0 } });
            setTela('duo-preparar');
          }}
          onVoltarHub={irHub}
        />
      )}
      {tela === 'contexto' && (
        <EscolhaContexto
          tema={tema}
          setTema={setTema}
          dificuldade={dificuldade}
          setDificuldade={setDificuldade}
          onJogar={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
          onVoltar={() => setTela('menu')}
        />
      )}
      {tela === 'jogo' && (
        <Jogo
          key={reiniciarKey}
          idade={idade}
          dificuldade={dificuldade}
          tema={tema}
          onVoltar={() => setTela('menu')}
          onFim={(r) => {
            if (r.venceu && r.pontos) onGanharPontos(r.pontos.total);
            setResultado(r);
            setTela('fim');
          }}
        />
      )}
      {tela === 'fim' && (
        <FimDeJogo
          venceu={resultado?.venceu}
          palavra={resultado?.palavra}
          pontos={resultado?.pontos}
          onNovaRodada={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
          onTrocarContexto={() => setTela('contexto')}
          onInicio={() => setTela('menu')}
        />
      )}

      {tela === 'duo-preparar' && (
        <PrepararDuo
          jogadorAtual={duo.jogadorEscritor}
          onVoltar={() => setTela('menu')}
          onPronto={({ palavra, dica }) => {
            setDuo((d) => ({ ...d, palavra, dica }));
            setTela('duo-passagem');
          }}
        />
      )}
      {tela === 'duo-passagem' && (
        <Passagem
          proximoJogador={duo.jogadorEscritor === 1 ? 2 : 1}
          onContinuar={() => setTela('duo-jogo')}
        />
      )}
      {tela === 'duo-jogo' && (
        <JogoDuo
          key={reiniciarKey}
          palavra={duo.palavra}
          dica={duo.dica}
          placar={duo.placar}
          jogadorAdivinhando={duo.jogadorEscritor === 1 ? 2 : 1}
          onVoltar={() => setTela('menu')}
          onFim={(r) => {
            const adivinhador = duo.jogadorEscritor === 1 ? 2 : 1;
            const novoPlacar = { ...duo.placar };
            if (r.venceu && r.pontos) {
              novoPlacar[adivinhador] = (novoPlacar[adivinhador] ?? 0) + r.pontos.total;
              setDuo((d) => ({ ...d, placar: novoPlacar }));
            }
            setResultado({ ...r, placarFinal: novoPlacar });
            setTela('duo-fim');
          }}
        />
      )}
      {tela === 'duo-fim' && (
        <FimDuo
          venceu={resultado?.venceu}
          palavra={resultado?.palavra}
          pontos={resultado?.pontos}
          placar={resultado?.placarFinal ?? duo.placar}
          jogadorAdivinhando={duo.jogadorEscritor === 1 ? 2 : 1}
          onTrocarPapeis={() => {
            setDuo((d) => ({ ...d, palavra: '', dica: '', jogadorEscritor: d.jogadorEscritor === 1 ? 2 : 1 }));
            setReiniciarKey((k) => k + 1);
            setTela('duo-preparar');
          }}
          onMesmosPapeis={() => {
            setDuo((d) => ({ ...d, palavra: '', dica: '' }));
            setReiniciarKey((k) => k + 1);
            setTela('duo-preparar');
          }}
          onInicio={() => setTela('menu')}
        />
      )}
    </>
  );
}
