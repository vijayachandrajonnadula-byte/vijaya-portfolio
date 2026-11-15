import { useEffect, useState } from 'react';
import { Box } from '../../../components/mui';
import { ChromeToast } from '../../../components/navigation/ExecutionChrome/ExecutionChrome';
import { ui } from '../ui';

type Kind = 'success' | 'error' | 'warn' | 'ai';
const TONE = { success: 'success', error: 'error', warn: 'warn', ai: 'info', default: 'info' } as const;
const SHOW_MS = 2600;
const FADE_MS = 200;

/**
 * Execution toast: the banner of the real application (ChromeToast: 400px wide, 48px tall, green tint with green text for success).
 * Centred over the work area, 32px above the bottom (settles 4px as it fades in over 0.2s), hides after 2.6s. Colours by kind: success (green),
 * error (red), warn (amber), ai and the default (blue).
 */
export default function Toast({ id, kind, text }: { id: number; kind: Kind | 'default'; text: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const hide = window.setTimeout(() => setShown(false), SHOW_MS);
    const clear = window.setTimeout(() => ui.clearToast(), SHOW_MS + FADE_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hide);
      window.clearTimeout(clear);
    };
  }, [id]);
  return (
    <Box
      data-spec="toast"
      sx={{
        position: 'fixed', bottom: 32, left: { xs: '50%', md: 'calc(50% + 45px)' }, zIndex: 1500, pointerEvents: 'none', opacity: shown ? 1 : 0, transform: `translateX(-50%) translateY(${shown ? 0 : 4}px)`, transition: `all ${FADE_MS}ms ease`,
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <ChromeToast kind={TONE[kind]}>{text}</ChromeToast>
    </Box>
  );
}
