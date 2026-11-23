/**
 * NOT FROM FIGMA. Grouped action list for a Flyout body (the Electronic Execution "Actions" flyout): group headers, then rows of
 * icon + label, with a short reason on rows that are not available. Pulse tokens only (#0f172a text, #566680 muted, #eef3fb hover,
 * #e2e8f0 divider). Keyboard: Tab enters the list, ArrowUp / ArrowDown / Home / End move between available rows, Enter / Space choose.
 * Logged in docs/figma-deviations.md.
 */
import { useEffect, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { focusRing, textStyle } from '../../../theme/pulseTokens';
import { fw } from '../../../theme/typography';

export interface ActionListItem {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Row cannot be chosen; `reason` explains why. */
  disabled?: boolean;
  reason?: string;
}

export interface ActionListGroup {
  label: string;
  items: ActionListItem[];
}

export interface ActionListProps {
  groups: ActionListGroup[];
  onSelect: (item: ActionListItem) => void;
  ariaLabel?: string;
  /** Focus the first available row on mount. @default false */
  autoFocus?: boolean;
  /** Denser rows for a screen with small text: 32px rows, 13/18 labels, 16px icons (default: 40px rows, 14/20, 20px icons). @default false */
  compact?: boolean;
}

export function ActionList({ groups, onSelect, ariaLabel = 'Actions', autoFocus = false, compact = false }: ActionListProps) {
  const root = useRef<HTMLDivElement>(null);
  const rows = () => Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button[data-action-row]:not(:disabled)') ?? []);

  useEffect(() => {
    if (autoFocus) rows()[0]?.focus();
  }, [autoFocus]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = rows();
    if (!list.length) return;
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = i < 0 ? 0 : Math.min(i + 1, list.length - 1);
    else if (e.key === 'ArrowUp') next = i < 0 ? list.length - 1 : Math.max(i - 1, 0);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next < 0) return;
    e.preventDefault();
    list[next]?.focus();
  };

  return (
    <Box ref={root} role="group" aria-label={ariaLabel} onKeyDown={onKeyDown} data-spec="action list" sx={{ display: 'flex', flexDirection: 'column' }}>
      {groups.map((g, gi) => (
        <Box key={g.label} role="group" aria-label={g.label} sx={{ display: 'flex', flexDirection: 'column', pt: gi === 0 ? 0 : '8px', mt: gi === 0 ? 0 : '8px', borderTop: gi === 0 ? 'none' : '1px solid #e2e8f0' }}>
          <Box data-spec="action list header" sx={{ ...textStyle('textS', 'semiBold'), fontSize: 11, lineHeight: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#566680', px: '8px', py: '6px' }}>
            {g.label}
          </Box>
          {g.items.map((it) => (
            <ButtonBase
              key={it.value}
              data-action-row
              disabled={it.disabled}
              onClick={() => onSelect(it)}
              sx={{
                width: '100%', minHeight: compact ? 32 : 40, boxSizing: 'border-box', justifyContent: 'flex-start', textAlign: 'left', gap: compact ? '10px' : '12px', px: '8px', borderRadius: 0,
                ...textStyle('textM', 'medium'), fontSize: compact ? 13 : 14, lineHeight: compact ? '18px' : '20px', fontWeight: fw.medium, color: '#0f172a',
                '& svg': { flexShrink: 0, color: '#566680' },
                '&:hover:not(.Mui-disabled)': { background: '#eef3fb' },
                '&.Mui-focusVisible': { boxShadow: focusRing, background: '#eef3fb' },
                '&.Mui-disabled': { color: '#94a3b8', '& svg': { color: '#cbd5e1' } },
              }}
            >
              {it.icon && <Box component="span" aria-hidden sx={{ display: 'inline-flex', width: compact ? 18 : 20, height: compact ? 18 : 20, alignItems: 'center', justifyContent: 'center', '& svg': compact ? { width: 16, height: 16 } : undefined }}>{it.icon}</Box>}
              <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{it.label}</Box>
              {it.reason && <Box component="span" sx={{ ...textStyle('textS', 'regular'), fontSize: compact ? 11 : 12, lineHeight: '16px', color: '#64748b', whiteSpace: 'nowrap' }}>{it.reason}</Box>}
            </ButtonBase>
          ))}
        </Box>
      ))}
    </Box>
  );
}
