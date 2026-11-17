import type { Beat } from '../data/brief';

/**
 * The contract between V2App and every scene. A scene is rendered INSIDE <Beat>, so it can call useBeat()
 * from '../components/Beat' for { progress, enter, read, active }. It fills the 100svh sticky stage
 * (position: relative; width/height 100%). Chapter colours come from CSS: --bg, --ink, --dim, --acc (see tokens.css).
 * Scenes own their own files only; the beat -> scene mapping lives in V2App.tsx.
 *
 * Rules every scene keeps:
 *  - decorative text is aria-hidden (the real text is the hidden <article>); real links/buttons stay focusable
 *  - no wheel/touch interception, no continuous animation off-screen (gate on useBeat().active)
 *  - nothing is wider than the stage at 390px
 */
export interface SceneProps {
  beat: Beat;
  /** Position of this beat in the film (0-based) and the number of beats. */
  index: number;
  total: number;
}
