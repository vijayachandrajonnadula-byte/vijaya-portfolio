// Implements Figma page "Breadcrumbs": sets "Breadcrumb" (Variant x Divider), "BuildingBlocks/Breadcrumb Item", "BuildingBlocks/Breadcrumb Dividers".
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import ChevronRightSharp from '@mui/icons-material/ChevronRightSharp';
import MoreHorizSharp from '@mui/icons-material/MoreHorizSharp';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import { focusRing, pt, textStyle } from '../../../theme/pulseTokens';
import { fw, role } from '../../../theme/typography';

export interface BreadcrumbNode {
  /** Visible label. */
  node: string;
  /** Destination. Empty = the current (leaf) page, which is not clickable. */
  link: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  nodes: BreadcrumbNode[];
  onMenuClick?: (node: BreadcrumbNode) => void;
  /** arrow: chevron. slice: "/". @default "arrow" */
  separatorVariant?: 'arrow' | 'slice';
  /** Home icon before the first node. @default true */
  showHomeIcon?: boolean;
  /** default: text; withIcon: icon + text on every node; icon: icons only. @default "default" */
  variant?: 'default' | 'withIcon' | 'icon';
  /** Collapse the middle of a long trail behind a "..." button once there are more nodes than this. */
  maxItems?: number;
  /**
   * NOT FROM FIGMA. figma: parent nodes navy, leaf Medium (the Figma spec). app: the look of the live Pulse application: parent nodes
   * slate #64748b, the leaf bold (Bold). Logged in docs/figma-deviations.md. @default "figma"
   */
  appearance?: 'figma' | 'app';
}

const c = pt.uiElements.breadcrumbs.color;
const PARENT = '#1e3a6e'; // textParentNode
const LEAF = '#0f172a'; // LeafNode
const HOME = '#5f6f86';

function Divider({ kind, app }: { kind: 'arrow' | 'slice'; app?: boolean }) {
  return (
    <Box component="span" aria-hidden data-spec="breadcrumb divider" sx={{ display: 'inline-flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {kind === 'arrow' ? (
        app ? <ChevronRightSharp sx={{ fontSize: 16, color: c.divider }} /> : <ChevronRightRounded sx={{ fontSize: 16, color: c.divider }} />
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16"><line x1="4.5" y1="13" x2="11.5" y2="3" stroke="#5f6f86" strokeWidth="1" /></svg>
      )}
    </Box>
  );
}

const iconBox = { display: 'inline-flex', width: 18, height: 18, p: '2px', boxSizing: 'border-box', flexShrink: 0, '& svg': { fontSize: 14 } } as const;

/** Breadcrumb trail. The last node is the current page (leaf). Row height 24, gap 4, text Figtree Medium 14/20. */
export function Breadcrumbs({ nodes, onMenuClick, separatorVariant = 'arrow', showHomeIcon = true, variant = 'default', maxItems, appearance = 'figma' }: BreadcrumbsProps) {
  const app = appearance === 'app';
  const [expanded, setExpanded] = useState(false);
  const collapsed = !expanded && maxItems != null && nodes.length > maxItems && nodes.length > 2;
  // keep first and the last (maxItems - 1) nodes; the rest hide behind the ellipsis
  const keepTail = Math.max(1, (maxItems ?? nodes.length) - 1);
  const visible = nodes.map((n, i) => ({ n, i })).filter(({ i }) => !collapsed || i === 0 || i >= nodes.length - keepTail);
  const ellipsisAfter = collapsed ? 0 : -1;
  const text = { ...textStyle('textL'), fontWeight: role.breadcrumb }; // Figma textBreadcrumb: Medium, 12/20 (Inter)

  const items: ReactNode[] = [];
  if (showHomeIcon) {
    items.push(
      <Box component="li" key="home" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: 24 }}>
        <ButtonBase aria-label="Home" onClick={() => onMenuClick?.({ node: 'Home', link: '/' })} sx={{ borderRadius: pt.radius.xs, '&.Mui-focusVisible': { boxShadow: focusRing } }}>
          <Box sx={{ ...iconBox, color: HOME }}><HomeOutlined /></Box>
        </ButtonBase>
        <Divider kind={separatorVariant} app={app} />
      </Box>,
    );
  }
  visible.forEach(({ n, i }, vi) => {
    const leaf = i === nodes.length - 1 || !n.link;
    const showIcon = variant !== 'default';
    const icon = n.icon ?? <DiamondOutlined />;
    const labelHidden = variant === 'icon' && !leaf;
    items.push(
      <Box component="li" key={`${n.node}-${i}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: 24 }}>
        <ButtonBase
          disabled={leaf}
          aria-current={leaf ? 'page' : undefined}
          aria-label={labelHidden ? n.node : undefined}
          onClick={() => onMenuClick?.(n)}
          data-spec={leaf ? 'breadcrumb leaf' : 'breadcrumb parent'}
          sx={{
            gap: '4px',
            height: 24,
            borderRadius: pt.radius.xs,
            ...text,
            ...(app && leaf ? { fontWeight: fw.bold } : {}),
            color: leaf ? LEAF : app ? '#64748b' : PARENT,
            '& .PulseCrumb-text': { borderBottom: '1px solid transparent' },
            '&:hover .PulseCrumb-text': leaf ? undefined : { borderBottomColor: app ? '#64748b' : PARENT },
            '&.Mui-focusVisible': { boxShadow: focusRing },
            '&.Mui-disabled': { color: LEAF },
          }}
        >
          {showIcon && <Box sx={{ ...iconBox, color: leaf ? LEAF : PARENT }}>{icon}</Box>}
          {!labelHidden && <span className="PulseCrumb-text">{n.node}</span>}
        </ButtonBase>
        {vi < visible.length - 1 && <Divider kind={separatorVariant} app={app} />}
      </Box>,
    );
    if (vi === ellipsisAfter) {
      items.push(
        <Box component="li" key="ellipsis" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: 24 }}>
          <ButtonBase aria-label="Show hidden levels" onClick={() => setExpanded(true)} data-spec="breadcrumb ellipsis" sx={{ width: 24, height: 24, borderRadius: pt.radius.xs, color: '#111112', '&:hover': { background: c.cellHoverBg }, '&.Mui-focusVisible': { boxShadow: focusRing } }}>
            {app ? <MoreHorizSharp sx={{ fontSize: 16 }} /> : <MoreHorizRounded sx={{ fontSize: 16 }} />}
          </ButtonBase>
          <Divider kind={separatorVariant} app={app} />
        </Box>,
      );
    }
  });

  return (
    <Box component="nav" aria-label="Breadcrumb">
      <Box component="ol" sx={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', m: 0, p: 0, flexWrap: 'wrap' }}>
        {items}
      </Box>
    </Box>
  );
}
