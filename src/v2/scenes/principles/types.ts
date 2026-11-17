import type { Beat } from '../../data/brief';

/**
 * Each of the 7 principles owns ONE art component (Art1..Art7) that fills the right-hand stage area of the principle scene
 * (the text column is rendered by PrincipleScene.tsx and is not yours). Contract:
 *  - fill the art slot (position: absolute; inset: 0) or render inside it; never wider than the stage at 390px
 *  - Clay is the protagonist: use <Character> via ClayActor or your own pose composition; the art tells THIS principle's metaphor
 *  - drive motion from useBeat() (progress/enter/read/active); no animation when !active
 *  - decorative: aria-hidden; interactive toys must be keyboard operable with visible labels
 */
export interface ArtProps {
  beat: Beat;
}