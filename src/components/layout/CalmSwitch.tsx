import { useId } from 'react';
import { setCalm, useCalm } from '../../lib/calm';

/**
 * "Calm" switch in the header: turns off decorative motion everywhere (WCAG 2.3.3).
 * It is a real switch (role=switch, aria-checked), has a visible text label (Recognition over recall),
 * a 44px target (Fitts, WCAG 2.5.8) and a tooltip that is a real element, so keyboard and touch users get it too.
 * Colour is never the only signal: the label, the thumb position and a check mark all change.
 */
export default function CalmSwitch() {
  const calm = useCalm();
  const tipId = useId();
  return (
    <span className="calm-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={calm}
        aria-describedby={tipId}
        className="calm"
        onClick={() => setCalm(!calm)}
      >
        <svg className="calm__ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          {/* three calm waves; a flat line when calm is on */}
          {calm ? <path d="M3 12h18" /> : <path d="M3 12c2.2-5 3.8-5 6 0s3.8 5 6 0 3.8-5 6 0" />}
        </svg>
        <span className="calm__t">Calm</span>
        <span className="calm__track" aria-hidden="true"><span className="calm__thumb" /></span>
      </button>
      <span role="tooltip" id={tipId} className="el-tip">{calm ? 'Decorative motion is off. Press to turn it back on.' : 'Turn off decorative motion'}</span>
    </span>
  );
}
