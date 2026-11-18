import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Character from '../../../components/studio/Character';
import { useBeat } from '../../components/Beat';
import { PARTS, Part } from './art3/Parts';
import { seg, smooth, tri, useScrub } from './art1/kit';
import type { ArtProps } from './types';
import '../../styles/s2a-base.css';
import '../../styles/s2a-3.css';

const vars = (p: number) => ({ '--p': p, '--f': smooth(seg(p, 0.3, 0.6)), '--lift': tri(seg(p, 0.28, 0.62)), '--g': smooth(seg(p, 0.56, 0.8)) });

/** The wireframe that flips into a working card as the page scrolls. */
function FlipCard() {
  return (
    <div className="a3-flipwrap">
      <div className="a3-flip">
        <div className="a3-face a3-wire">
          <svg viewBox="0 0 100 56" className="a3-x" preserveAspectRatio="none"><rect x="1" y="1" width="98" height="54" /><path d="M1 1 99 55M99 1 1 55" /></svg>
          <i className="a3-wl" /><i className="a3-wl a3-wl--s" /><i className="a3-wbtn" />
        </div>
        <div className="a3-face a3-works">
          <div className="a3-chart"><i style={{ '--h': 0.45 } as never} /><i style={{ '--h': 0.8 } as never} /><i style={{ '--h': 0.6 } as never} /><i style={{ '--h': 1 } as never} /></div>
          <i className="a3-wl" /><i className="a3-wl a3-wl--s" />
          <div className="a3-row"><i className="a3-sbtn"><svg viewBox="0 0 12 12"><path d="M2.5 6.4 5 8.8 9.6 3.4" /></svg></i><i className="a3-stog" /></div>
        </div>
      </div>
      <p className="a3-state s2a-mono"><span className="a3-state__a">grey boxes</span><span className="a3-state__b">it works</span></p>
    </div>
  );
}

/** 3. prototype to find the truth: a breadboard bench of toys you can throw, and a wireframe that becomes a working thing. */
export default function Art3(_: ArtProps) {
  const { progress, active } = useBeat();
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<Element | null>(null);
  const [touched, setTouched] = useState(false);
  const [nonce, setNonce] = useState(0);
  useScrub(root, progress, active, vars);
  // the live toys sit outside the aria-hidden art slot so keyboard and screen-reader users can reach them
  useEffect(() => { setHost(mark.current?.closest('.v2-scene') ?? null); }, []);

  return (
    <>
      <div ref={root} className="s2a s2a3" style={{ '--p': 0 } as never}>
        <div className="s2a-clay a3-clay"><Character pose="point" size={400} track={active} power={active ? 'bright' : 'on'} /></div>
        <div className="a3-bench">
          <div className="a3-board"><i className="a3-rail a3-rail--t" /><i className="a3-rail a3-rail--b" /><i className="a3-chan" /></div>
          <FlipCard />
        </div>
        <div ref={mark} hidden />
      </div>
      {host ? createPortal(
        <div className="s2a3-live">
          <div className="s2a s2a3">
            <div ref={live} className="a3-bench">
              {PARTS.map(d => <Part key={d.id} def={d} boxRef={live} nonce={nonce} active={active} onTouch={() => setTouched(true)} />)}
              <div className="a3-hint s2a-mono">
                {touched
                  ? <button type="button" className="a3-tidy" tabIndex={active ? 0 : -1} onClick={() => setNonce(n => n + 1)}>tidy up</button>
                  : <span className="a3-throw"><svg viewBox="0 0 40 24" aria-hidden="true"><path d="M38 4C24 2 12 8 4 18M4 18l1-9M4 18l9-2" /></svg>throw me</span>}
              </div>
            </div>
          </div>
        </div>, host) : null}
    </>
  );
}
