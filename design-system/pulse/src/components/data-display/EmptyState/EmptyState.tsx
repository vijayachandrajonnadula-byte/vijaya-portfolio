// Pulse "Empty States" page: Type (No Records / No Search / No Filter / Error) x Size (Small / Medium / Large).
// Layout from the spec: 400 wide column, gap 16, illustration 120/160/200 px tall, heading 24px, text 20px, small Button.
// The illustrations are simplified redraws (the Figma vectors are not reproduced path-for-path).
import { fw } from '../../../theme/typography';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Button } from '../../actions/Button/Button';
import { pt } from '../../../theme/pulseTokens';

export type EmptyStateType = 'noRecords' | 'noSearch' | 'noFilter' | 'error';
export type EmptyStateSize = 'small' | 'medium' | 'large';

export interface EmptyStateProps {
  /** @default "noRecords" */
  type?: EmptyStateType;
  /** Illustration height: 120 / 160 / 200. @default "medium" */
  size?: EmptyStateSize;
  title?: ReactNode;
  description?: ReactNode;
  /** Alias of `description`. */
  metaData?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  /** Replaces the built-in illustration. */
  illustration?: ReactNode;
  /** Legacy alias of `size`. */
  illustrationSize?: EmptyStateSize;
}

const heights = { small: 120, medium: 160, large: 200 } as const;

const copy: Record<EmptyStateType, { title: string; description: string; action?: string }> = {
  noRecords: { title: 'No records yet', description: 'Create your first record to get started.', action: 'Create' },
  noSearch: { title: 'No results found', description: 'Try a different keyword or check the spelling.' },
  noFilter: { title: 'No matching results', description: 'No records match the applied filters.', action: 'Clear filters' },
  error: { title: 'Something went wrong', description: 'We could not load the data. Please try again.', action: 'Retry' },
};

const { accent } = pt.colors;

function Illustration({ type, height }: { type: EmptyStateType; height: number }) {
  const blob = type === 'noRecords' ? pt.colors.neutral[100] : '#f7f7f8';
  return (
    <svg data-spec={`empty-art-${type}`} width={height} height={height} viewBox="0 0 200 200" fill="none" aria-hidden role="img">
      <circle cx="100" cy="100" r="94" fill={blob} />
      <circle cx="34" cy="64" r="5" fill="#cecbf6" opacity=".8" />
      <circle cx="170" cy="52" r="6" fill={accent.orange[300]} opacity=".6" />
      <circle cx="160" cy="150" r="4" fill={accent.green[300]} opacity=".7" />
      <circle cx="46" cy="148" r="4" fill={accent.orange[200]} opacity=".7" />
      {type === 'error' ? (
        <>
          {[58, 86, 114].map((y, i) => (
            <g key={y}>
              <rect x="50" y={y} width="100" height="22" rx="5" fill="#fff" stroke={['#f5c4b3', '#cecbf6', '#b5d4f4'][i]} strokeWidth="1.5" />
              <circle cx="62" cy={y + 11} r="3.5" fill={['#df3327', '#6d63bc', '#2eb0cc'][i]} />
              <rect x="106" y={y + 8} width="34" height="6" rx="3" fill={[accent.orange[100], accent.purple[50], accent.blue[100]][i]} />
            </g>
          ))}
          <path d="M126 104 L152 148 H100 Z" fill={accent.orange[400]} stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
          <path d="M126 119v14M126 139v2" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="62" y="48" width="76" height="98" rx="8" fill={accent.blue[25]} stroke={accent.blue[400]} strokeWidth="1.5" />
          <rect x="66" y="54" width="80" height="102" rx="8" fill="#fff" stroke="#a9a3d8" strokeWidth="2" />
          <circle cx="86" cy="76" r="10" fill={accent.purple[50]} stroke="#a9a3d8" />
          <rect x="102" y="70" width="32" height="6" rx="3" fill={accent.purple[200]} />
          <rect x="82" y="100" width="52" height="6" rx="3" fill={accent.blue[300]} opacity=".6" />
          <rect x="82" y="114" width="40" height="6" rx="3" fill={accent.green[300]} opacity=".7" />
          <rect x="82" y="128" width="30" height="6" rx="3" fill={accent.orange[300]} opacity=".6" />
          {type === 'noRecords' && (
            <>
              <circle cx="136" cy="140" r="20" fill={accent.green[500]} />
              <path d="M136 130v20M126 140h20" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          {type === 'noSearch' && (
            <>
              <circle cx="128" cy="130" r="16" fill="#eae8fc" stroke="#534ab7" strokeWidth="3" />
              <path d="M140 142l16 16" stroke="#534ab7" strokeWidth="5" strokeLinecap="round" />
            </>
          )}
          {type === 'noFilter' && (
            <>
              <circle cx="136" cy="140" r="20" fill={pt.colors.brand[500]} />
              <path d="M126 133h20l-7 8v8l-6-3v-5z" fill="#fff" />
            </>
          )}
        </>
      )}
    </svg>
  );
}

/** Placeholder shown when a page, list or grid has nothing to display. */
export function EmptyState({ type = 'noRecords', size, illustrationSize, title, description, metaData, actionLabel, onAction, illustration }: EmptyStateProps) {
  const h = heights[size ?? illustrationSize ?? 'medium'];
  const d = copy[type];
  const text = description ?? metaData ?? d.description;
  const action = actionLabel ?? (onAction ? d.action : undefined);
  return (
    <Box data-spec="empty-state" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: pt.spacing.xxxl, width: '100%', maxWidth: 400, mx: 'auto', boxSizing: 'border-box' }}>
      {illustration ?? <Illustration type={type} height={h} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: pt.spacing.xs, width: '100%' }}>
        <Box sx={{ fontSize: 16, lineHeight: '24px', fontWeight: fw.semiBold, color: pt.formElements.headings.defaultTextColor }}>{title ?? d.title}</Box>
        <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.formElements.content.secondaryTextColor }}>{text}</Box>
      </Box>
      {action && (
        <Button size="small" onClick={onAction}>
          {action}
        </Button>
      )}
    </Box>
  );
}

/** Convenience wrapper: the four Figma types by name. */
export function EmptyRecord(props: Omit<EmptyStateProps, 'type'> & { type?: EmptyStateType }) {
  return <EmptyState {...props} />;
}

