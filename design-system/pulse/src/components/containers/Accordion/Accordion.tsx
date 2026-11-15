// Pulse "Accordion" page: BuildingBlocks/Accordion Header (Size x Interaction x Orientation) + Accordion (Default / Expanded).
// Header: 255x{54|58|62}, row, pad 8/10/12 x 16, radius 4/6/6, fill uiElements/Accordion/color/defaultBg, hover+active #e3ebf8,
// active radius is top-only (the body attaches below). Disabled = 38% opacity. Edit Title swaps the title for a TextField.
import { fw } from '../../../theme/typography';
import { useId, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import type { SxProps, Theme } from '@mui/material/styles';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import { IconButton } from '../../actions/IconButton/IconButton';
import { TextField } from '../../form/TextField/TextField';
import { Chip } from '../../data-display/Chip/Chip';
import type { FamilyColor } from '../../_shared/families';
import { disabledOpacity, focusRing, pt } from '../../../theme/pulseTokens';

const ac = pt.uiElements.accordion;
const headingFont = "'Inter Variable', Inter, sans-serif";

/** padY / gap / radius / icon from BuildingBlocks/Accordion Header. xxsmall is the legacy compact size. */
const metrics = {
  xxsmall: { padY: 4, gap: 8, radius: '4px', icon: 14, title: 12 },
  small: { padY: 8, gap: 8, radius: '4px', icon: 14, title: 12 },
  medium: { padY: 10, gap: 10, radius: '6px', icon: 16, title: 13 },
  large: { padY: 12, gap: 10, radius: '6px', icon: 16, title: 14 },
} as const;

export interface AccordionProps {
  summary: ReactNode;
  /** Secondary line under the title. */
  metadata?: ReactNode;
  /** Controlled open state. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
  disabled?: boolean;
  icon?: ReactNode;
  /** "Right Other Icon". */
  endIcon?: ReactNode;
  /** Chips shown in the header. */
  chips?: { label: string; color?: FamilyColor }[];
  badgeContent?: number;
  badgeColor?: FamilyColor;
  /** Shows the delete icon; called when pressed. */
  onDelete?: () => void;
  /** Shows the edit icon; called with the new title when the edit is confirmed (Interaction=Edit Title). */
  onTitleChange?: (title: string) => void;
  /** fill: tinted header. no-fill: transparent header. @default "fill" */
  border?: 'fill' | 'no-fill';
  /** @default "medium" */
  size?: 'xxsmall' | 'small' | 'medium' | 'large';
  /** vertical: narrow bar with the body expanding sideways. @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Remove the body padding. */
  disableBodyPadding?: boolean;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

const asArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : sx ? [sx] : []);

/** Collapsible panel: header (title, metadata, icons, chips, badge) plus a slot body. */
export function Accordion({
  summary,
  metadata,
  isOpen,
  defaultOpen = false,
  onChange,
  disabled,
  icon,
  endIcon,
  chips,
  badgeContent,
  badgeColor: _badgeColor,
  onDelete,
  onTitleChange,
  border = 'fill',
  size = 'medium',
  orientation = 'horizontal',
  disableBodyPadding,
  children,
  sx,
}: AccordionProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const open = isOpen ?? internal;
  const m = metrics[size];
  const id = useId();
  const vertical = orientation === 'vertical';
  const toggle = () => {
    if (disabled || editing) return;
    if (isOpen === undefined) setInternal(!open);
    onChange?.(!open);
  };
  const fill = border === 'fill';
  const headerBg = fill ? (open ? ac.color.activeBg : ac.color.defaultBg) : 'transparent';
  const iconBox = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, '& svg': { fontSize: m.icon } } as const;

  const titleNode = editing ? (
    // Figma Edit Title: the Pulse TextField (Small, 32px) replaces the title.
    <Box onClick={(e) => e.stopPropagation()}>
      <TextField
        autoFocus
        fullWidth
        size="small"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        inputProps={{
          'aria-label': 'Accordion title',
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              onTitleChange?.(draft);
              setEditing(false);
            }
            if (e.key === 'Escape') setEditing(false);
          },
        }}
      />
    </Box>
  ) : (
    <Box sx={{ fontSize: m.title, lineHeight: '20px', fontWeight: fw.semiBold, color: ac.color.defaultTextColor }}>{summary}</Box>
  );

  const header = (
    <Box
      data-spec={`accordion-header ${size}`}
      sx={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'center' : 'center',
        gap: `${m.gap}px`,
        boxSizing: 'border-box',
        padding: `${m.padY}px 16px`,
        background: headerBg,
        borderRadius: open && !vertical && fill ? `${m.radius} ${m.radius} 0 0` : open && vertical && fill ? `${m.radius} 0 0 ${m.radius}` : m.radius,
        height: vertical ? '100%' : undefined,
        minWidth: 0,
        transition: 'background-color 120ms',
        ...(fill ? { '&:hover': { background: ac.color.hoverBg } } : { '&:hover': { background: ac.color.hoverBg } }),
      }}
    >
      <ButtonBase
        id={`${id}-header`}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        disabled={disabled}
        onClick={toggle}
        disableRipple
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          alignItems: vertical ? 'center' : 'center',
          justifyContent: 'flex-start',
          gap: `${m.gap}px`,
          textAlign: 'left',
          font: 'inherit',
          borderRadius: m.radius,
          '&.Mui-focusVisible': { boxShadow: focusRing },
          '&.Mui-disabled': { opacity: 1 },
        }}
      >
        {icon && <Box sx={iconBox}>{icon}</Box>}
        <Box sx={{ minWidth: 0, flex: vertical ? undefined : 1, display: 'flex', flexDirection: 'column', gap: '-4px', ...(vertical && { writingMode: 'vertical-rl', transform: 'rotate(180deg)' }) }}>
          <Box sx={{ py: '2px' }}>{editing ? null : titleNode}</Box>
          {metadata && !editing && <Box sx={{ mt: '-4px', fontFamily: headingFont, fontSize: 12, lineHeight: '18px', color: pt.formElements.content.secondaryTextColor }}>{metadata}</Box>}
        </Box>
      </ButtonBase>
      {editing && <Box sx={{ flex: 1, minWidth: 0 }}>{titleNode}</Box>}
      {!editing && chips && chips.length > 0 && (
        <Box sx={{ display: 'flex', gap: pt.spacing.m, flexShrink: 0, flexDirection: vertical ? 'column' : 'row' }}>
          {chips.map((c) => <Chip key={c.label} label={c.label} color={c.color ?? 'blue'} size="xsmall" />)}
        </Box>
      )}
      {!editing && endIcon && <Box sx={iconBox}>{endIcon}</Box>}
      {!editing && onTitleChange && (
        <IconButton ariaLabel="Edit title" size="xsmall" disabled={disabled} onClick={() => { setDraft(typeof summary === 'string' ? summary : ''); setEditing(true); }}>
          <EditOutlined />
        </IconButton>
      )}
      {editing && (
        <>
          <IconButton ariaLabel="Confirm edit" size="xsmall" onClick={() => { onTitleChange?.(draft); setEditing(false); }}>
            <CheckRounded />
          </IconButton>
          <IconButton ariaLabel="Cancel edit" size="xsmall" onClick={() => setEditing(false)}>
            <CloseRounded />
          </IconButton>
        </>
      )}
      {!editing && onDelete && (
        <IconButton ariaLabel="Delete" size="xsmall" disabled={disabled} onClick={onDelete}>
          <DeleteOutlineRounded />
        </IconButton>
      )}
      {!editing && badgeContent != null && (
        <Box sx={{ minWidth: 16, height: 16, px: '4px', boxSizing: 'border-box', borderRadius: pt.radius.full, border: `1px solid ${pt.uiElements.badges.color.brand}`, background: pt.colors.base.white, color: pt.uiElements.badges.color.brand, fontSize: 10, lineHeight: '14px', fontWeight: fw.semiBold, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {badgeContent}
        </Box>
      )}
      {!editing && (
        <ButtonBase aria-label={open ? 'Collapse' : 'Expand'} tabIndex={-1} disabled={disabled} onClick={toggle} sx={{ ...iconBox, width: 16, height: 24 }}>
          <ExpandMoreRounded sx={{ fontSize: m.icon, transition: 'transform 150ms', transform: `rotate(${open ? 180 : 0}deg)` }} />
        </ButtonBase>
      )}
    </Box>
  );

  return (
    <Box
      sx={[
        { display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'stretch', opacity: disabled ? disabledOpacity : 1, pointerEvents: disabled ? 'none' : undefined, minWidth: 0 },
        ...asArray(sx),
      ]}
    >
      <Box sx={vertical ? { flexShrink: 0 } : undefined}>{header}</Box>
      <Collapse in={open} orientation={vertical ? 'horizontal' : 'vertical'} unmountOnExit={false} sx={{ minWidth: 0 }}>
        <Box
          id={`${id}-body`}
          role="region"
          aria-labelledby={`${id}-header`}
          sx={{
            boxSizing: 'border-box',
            p: disableBodyPadding ? 0 : `${pt.spacing.xxxl}`,
            minHeight: vertical ? 320 : undefined,
            width: vertical ? 'max-content' : undefined,
            background: pt.colors.base.white,
            border: `1px solid ${ac.color.hoverBg}`,
            borderTop: vertical ? undefined : 'none',
            borderLeft: vertical ? 'none' : undefined,
            borderRadius: vertical ? `0 ${m.radius} ${m.radius} 0` : `0 0 ${m.radius} ${m.radius}`,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

/* ---------------------------------------------------------- AccordionGroup */

export interface AccordionGroupItem extends Omit<AccordionProps, 'isOpen' | 'defaultOpen' | 'onChange'> {
  id: string;
}

export interface AccordionGroupProps {
  items: AccordionGroupItem[];
  /** Only one panel open at a time. @default false */
  exclusive?: boolean;
  defaultOpenIds?: string[];
  size?: AccordionProps['size'];
  /** Gap between items. @default 8 */
  gap?: number;
}

/** Stack of accordions with optional single-open behaviour. */
export function AccordionGroup({ items, exclusive = false, defaultOpenIds = [], size, gap = 8 }: AccordionGroupProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {items.map(({ id, ...item }) => (
        <Accordion
          key={id}
          size={size}
          {...item}
          isOpen={openIds.includes(id)}
          onChange={(o) => setOpenIds((prev) => (o ? (exclusive ? [id] : [...prev, id]) : prev.filter((x) => x !== id)))}
        />
      ))}
    </Box>
  );
}
