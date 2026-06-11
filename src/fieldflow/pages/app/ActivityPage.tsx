import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CardActionArea,
  Divider,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  FilterList,
  Assignment,
  CheckCircle,
  DirectionsCar,
  LocationOn,
  Build,
  CheckBox,
  PhotoCamera,
  Pause,
  Upload,
  Verified,
  Cancel,
  Close,
} from '@mui/icons-material';
import InputBase from '@mui/material/InputBase';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';
import { mockActivityEvents } from '../../data';
import type { ActivityEvent } from '../../types';

dayjs.extend(relativeTime);

// ── event type config ──────────────────────────────────────────────────────
const EVENT_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; filterGroup: string }
> = {
  task_assigned: {
    icon: <Assignment sx={{ fontSize: 16 }} />,
    color: '#2457D6',
    bg: '#E8EFFF',
    filterGroup: 'Task Updates',
  },
  task_accepted: {
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
    color: '#147A45',
    bg: '#D4EDDA',
    filterGroup: 'Task Updates',
  },
  journey_started: {
    icon: <DirectionsCar sx={{ fontSize: 16 }} />,
    color: '#2457D6',
    bg: '#E8EFFF',
    filterGroup: 'Task Updates',
  },
  checked_in: {
    icon: <LocationOn sx={{ fontSize: 16 }} />,
    color: '#147A45',
    bg: '#D4EDDA',
    filterGroup: 'Task Updates',
  },
  work_started: {
    icon: <Build sx={{ fontSize: 16 }} />,
    color: '#A06400',
    bg: '#FFF5E0',
    filterGroup: 'Task Updates',
  },
  checklist_updated: {
    icon: <CheckBox sx={{ fontSize: 16 }} />,
    color: '#006A60',
    bg: '#E0F4F1',
    filterGroup: 'Checklist',
  },
  evidence_added: {
    icon: <PhotoCamera sx={{ fontSize: 16 }} />,
    color: '#7B2D9E',
    bg: '#F3E8FF',
    filterGroup: 'Evidence',
  },
  task_paused: {
    icon: <Pause sx={{ fontSize: 16 }} />,
    color: '#A06400',
    bg: '#FFF5E0',
    filterGroup: 'Task Updates',
  },
  task_submitted: {
    icon: <Upload sx={{ fontSize: 16 }} />,
    color: '#2457D6',
    bg: '#E8EFFF',
    filterGroup: 'Sync',
  },
  task_approved: {
    icon: <Verified sx={{ fontSize: 16 }} />,
    color: '#147A45',
    bg: '#D4EDDA',
    filterGroup: 'Task Updates',
  },
  task_rejected: {
    icon: <Cancel sx={{ fontSize: 16 }} />,
    color: '#BA1A1A',
    bg: '#FDECEA',
    filterGroup: 'Task Updates',
  },
};

const FILTER_TABS = ['All', 'Task Updates', 'Evidence', 'Checklist', 'Sync'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

// ── date group label ───────────────────────────────────────────────────────
function getGroupLabel(dateStr: string): string {
  const d = dayjs(dateStr);
  if (d.isSame(dayjs(), 'day')) return 'Today';
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  return d.format('ddd D MMM');
}

function groupByDate(events: ActivityEvent[]): Map<string, ActivityEvent[]> {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const map = new Map<string, ActivityEvent[]>();
  for (const ev of sorted) {
    const label = getGroupLabel(ev.timestamp);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(ev);
  }
  return map;
}

// ── sync dot ───────────────────────────────────────────────────────────────
const SYNC_DOT: Record<string, string> = {
  synced: '#147A45',
  pending: '#A06400',
  failed: '#BA1A1A',
  syncing: '#2457D6',
};

export default function ActivityPage() {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [snackText, setSnackText] = useState<string | null>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2500);
  }, []);

  const filtered = useMemo(() => {
    let events = mockActivityEvents;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.taskTitle?.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q) ||
          e.workOrderNumber?.toLowerCase().includes(q),
      );
    }
    if (activeFilter !== 'All') {
      events = events.filter(
        (e) => EVENT_CONFIG[e.type]?.filterGroup === activeFilter,
      );
    }
    return events;
  }, [searchQuery, activeFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      {/* ── AppBar ─────────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowBack fontSize="small" />
          </IconButton>

          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                <InputBase
                  autoFocus
                  placeholder="Search activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ fontSize: '0.9375rem', width: '100%', px: 1 }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>
                  Activity
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {searchOpen ? (
            <IconButton
              size="small"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              aria-label="Close search"
            >
              <Close fontSize="small" />
            </IconButton>
          ) : (
            <>
              <IconButton
                size="small"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Filter">
                <FilterList fontSize="small" />
              </IconButton>
            </>
          )}
        </Toolbar>

        {/* ── Filter chips ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            px: 2,
            pb: 1,
            display: 'flex',
            gap: 0.75,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {FILTER_TABS.map((tab) => (
            <Chip
              key={tab}
              label={tab}
              size="small"
              onClick={() => setActiveFilter(tab)}
              sx={{
                fontWeight: activeFilter === tab ? 700 : 500,
                bgcolor: activeFilter === tab ? 'primary.main' : 'action.hover',
                color: activeFilter === tab ? '#fff' : 'text.secondary',
                flexShrink: 0,
                '&:hover': { bgcolor: activeFilter === tab ? 'primary.dark' : 'action.selected' },
              }}
            />
          ))}
        </Box>
      </AppBar>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <Box sx={{ pb: '80px' }}>
        {grouped.size === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>📋</Typography>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>No activity yet</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Activity from your tasks will appear here.
            </Typography>
          </Box>
        ) : (
          Array.from(grouped.entries()).map(([label, events]) => (
            <Box key={label}>
              {/* Date group header */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: 'action.hover',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    color: 'text.secondary',
                  }}
                >
                  {label}
                </Typography>
              </Box>

              {events.map((event, idx) => (
                <ActivityRow
                  key={event.id}
                  event={event}
                  isLast={idx === events.length - 1}
                  onNavigate={(taskId) =>
                    navigate(`/field-flow/app/tasks/${taskId}`)
                  }
                />
              ))}
            </Box>
          ))
        )}

        {/* Load more */}
        {grouped.size > 0 && (
          <Box sx={{ px: 2, pt: 2, pb: 1, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => showSnack('Loading more history...')}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                px: 3,
              }}
            >
              Load more
            </Button>
          </Box>
        )}
      </Box>

      {/* ── Snackbar ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {snackText && (
          <motion.div
            key="snack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 88,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1400,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                bgcolor: '#1A1B1F',
                color: '#fff',
                borderRadius: '100px',
                px: 2.5,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: 4,
              }}
            >
              {snackText}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ── ActivityRow component ─────────────────────────────────────────────────
interface ActivityRowProps {
  event: ActivityEvent;
  isLast: boolean;
  onNavigate: (taskId: string) => void;
}

function ActivityRow({ event, isLast, onNavigate }: ActivityRowProps) {
  const config = EVENT_CONFIG[event.type] ?? {
    icon: <Assignment sx={{ fontSize: 16 }} />,
    color: '#74747D',
    bg: '#EEEEF6',
    filterGroup: 'Task Updates',
  };

  return (
    <>
      <CardActionArea
        onClick={() => event.taskId && onNavigate(event.taskId)}
        sx={{ px: 2, py: 1.5 }}
        disabled={!event.taskId}
      >
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          {/* Icon dot */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: config.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: config.color,
              mt: 0.25,
            }}
          >
            {config.icon}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
              <Typography
                component="span"
                sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}
              >
                {event.actor}
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: '0.875rem', color: 'text.primary' }}
              >
                {event.message}
              </Typography>
            </Box>

            {/* WO chip */}
            {event.workOrderNumber && (
              <Chip
                label={event.workOrderNumber}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                  mb: 0.5,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {dayjs(event.timestamp).fromNow()}
              </Typography>
              {/* Sync status dot */}
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: SYNC_DOT[event.syncStatus] ?? '#74747D',
                  flexShrink: 0,
                }}
                title={event.syncStatus}
              />
            </Box>
          </Box>
        </Box>
      </CardActionArea>
      {!isLast && <Divider sx={{ ml: 7 }} />}
    </>
  );
}
