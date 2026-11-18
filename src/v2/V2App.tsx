import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import './tokens.css';
import './v2.css';
import './styles/s1-film.css';
import './styles/s1-title.css';
import { useCalm } from '../lib/calm';
import { beats, type BeatKind } from './data/brief';
import { Beat } from './components/Beat';
import { Grain, SkipLink } from './components/bits';
import Article from './components/Article';
import HUD from './components/HUD';
import IndexOverlay, { FILE_CARD } from './components/IndexOverlay';
import RawFile from './components/RawFile';
import ReadingMode from './components/ReadingMode';
import { useConductor } from './components/useConductor';
import { goTo, useCurrentBeat } from './film';
import type { SceneProps } from './scenes/types';
import TitleScene from './scenes/TitleScene';
import StatementScene from './scenes/StatementScene';
import PrincipleScene from './scenes/PrincipleScene';
import ListScene from './scenes/ListScene';
import ContactScene from './scenes/ContactScene';
import SignoffScene from './scenes/SignoffScene';

/** beat.kind -> scene. Scene agents replace the scene FILES; this mapping stays here. */
const SCENES: Record<BeatKind, ComponentType<SceneProps>> = {
  title: TitleScene,
  statement: StatementScene,
  principle: PrincipleScene,
  list: ListScene,
  contact: ContactScene,
  signoff: SignoffScene,
};

/**
 * `/`: VIJAY.md. Film mode (sticky scenes on native scroll) or reading mode (plain article).
 * Reading mode = the system asks for reduced motion, or the address has ?read.
 */
export default function V2App() {
  const calm = useCalm();
  const [params] = useSearchParams();
  const reading = calm || params.has('read');

  // this page wears its own colours: pin the light tokens for the shared contact widget without touching the saved choice
  useEffect(() => {
    const root = document.documentElement;
    const theme = root.dataset.theme;
    root.dataset.v2 = 'on';
    root.dataset.theme = 'light';
    return () => { delete root.dataset.v2; if (theme) root.dataset.theme = theme; };
  }, []);

  const [raw, setRaw] = useState(false);
  const rawBtn = (
    <RawFile open={raw} onClose={() => setRaw(false)} calm={calm} />
  );

  if (reading) {
    return (
      <div className="v2 v2-reading" data-chapter="paper">
        <SkipLink />
        <ReadingMode calm={calm} onRaw={() => setRaw(true)} />
        {rawBtn}
      </div>
    );
  }
  return <Film raw={raw} setRaw={setRaw} calm={calm} rawNode={rawBtn} />;
}

function Film({ raw, setRaw, calm, rawNode }: { raw: boolean; setRaw: (v: boolean) => void; calm: boolean; rawNode: React.ReactNode }) {
  const [indexOpen, setIndexOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const cur = useCurrentBeat();

  const toggleIndex = useCallback((o?: { x: number; y: number }) => {
    setIndexOpen(v => {
      if (!v) setOrigin(o ?? { x: window.innerWidth - 60, y: 30 });
      return !v;
    });
  }, []);
  const openRaw = useCallback(() => { setIndexOpen(false); setRaw(true); }, [setRaw]);
  useConductor({ blocked: indexOpen || raw, onIndex: toggleIndex, onRaw: openRaw });

  // a link with #beat-id in the address lands on that beat
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const i = beats.findIndex(b => b.id === id);
    if (i > 0) window.setTimeout(() => goTo(i, { instant: true }), 60);
  }, []);

  const pick = (id: string) => {
    if (id === FILE_CARD) { openRaw(); return; }
    setIndexOpen(false);
    const i = beats.findIndex(b => b.id === id);
    window.setTimeout(() => goTo(i), calm ? 0 : 260);
  };

  return (
    <div className="v2 v2-filmroot" data-chapter={beats[cur]!.chapter}>
      <SkipLink />
      <Grain />
      <HUD indexOpen={indexOpen} onIndex={o => toggleIndex(o)} onRaw={openRaw} />
      <main className="v2-film" id="film">
        <Article film />
        {beats.map((b, i) => {
          const Scene = SCENES[b.kind];
          return (
            <Beat key={b.id} id={b.id} colour={b.chapter} prev={beats[i - 1]?.chapter} length={b.length}>
              <Scene beat={b} index={i} total={beats.length} />
            </Beat>
          );
        })}
      </main>
      <IndexOverlay open={indexOpen} origin={origin} onClose={() => setIndexOpen(false)} onPick={pick} calm={calm} />
      {rawNode}
    </div>
  );
}
