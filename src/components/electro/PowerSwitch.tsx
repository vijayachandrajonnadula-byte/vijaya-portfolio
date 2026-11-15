import { useId } from 'react';
import { quirks } from '../../data/quirks';
import '../../styles/electro.css';

/**
 * The theme toggle as a small rocker switch with a status LED. Same behaviour as before: the caller owns the
 * theme (src/components/layout/theme.ts). Dark is "on". The tooltip is a real element so keyboard and touch
 * users get it too; the flip is a spring that drops to instant under reduced motion.
 * The accessible name is stable ("Dark mode"); aria-checked carries the state. onToggle gets the switch centre
 * so the theme change can reveal from it.
 */
export default function PowerSwitch({ dark, onToggle }: { dark: boolean; onToggle: (origin?: { x: number; y: number }) => void }) {
  const tipId = useId();
  return (
    <span className="el-power-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Dark mode"
        aria-describedby={tipId}
        className="nav__theme el-power"
        data-on={dark}
        onClick={e => {
          const r = e.currentTarget.getBoundingClientRect();
          onToggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }}
      >
        <span className="el-power__track" aria-hidden="true">
          <span className="el-power__mark el-power__mark--o" />
          <span className="el-power__mark el-power__mark--i" />
          <span className="el-power__rocker" />
        </span>
        <span className="el-power__led" aria-hidden="true" />
      </button>
      <span role="tooltip" id={tipId} className="el-tip">{quirks.theme.tip}</span>
    </span>
  );
}
