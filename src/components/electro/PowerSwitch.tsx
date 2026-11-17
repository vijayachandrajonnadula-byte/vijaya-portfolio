import { useId } from 'react';
import { quirks } from '../../data/quirks';
import '../../styles/electro.css';

/**
 * The theme toggle: a sun and a moon on one track, with the word "Theme" beside it on wider screens (Recognition over
 * recall: the icon pair says what it controls, the thumb sits under the one that is active). It is still a real switch:
 * role="switch", dark is "on", and the caller owns the theme (src/components/layout/theme.ts). The tooltip is a real
 * element so keyboard and touch users get it too. The accessible name contains the visible word ("Theme: dark mode").
 * onToggle gets the switch centre so the theme change can reveal from it.
 */
export default function PowerSwitch({ dark, onToggle }: { dark: boolean; onToggle: (origin?: { x: number; y: number }) => void }) {
  const tipId = useId();
  return (
    <span className="el-power-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Theme: dark mode"
        aria-describedby={tipId}
        className="nav__theme el-power"
        data-on={dark}
        onClick={e => {
          const r = e.currentTarget.getBoundingClientRect();
          onToggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }}
      >
        <span className="el-power__t" aria-hidden="true">Theme</span>
        <span className="el-power__track" aria-hidden="true">
          <svg className="el-power__ic el-power__ic--sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg className="el-power__ic el-power__ic--moon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
          <span className="el-power__thumb" />
        </span>
      </button>
      <span role="tooltip" id={tipId} className="el-tip">{quirks.theme.tip}</span>
    </span>
  );
}
