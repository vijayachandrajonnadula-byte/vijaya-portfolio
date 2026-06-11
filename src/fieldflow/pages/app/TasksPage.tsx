import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Card,
  CardContent,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  Close,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../stores';
import { mockCustomers } from '../../data';
import type { TaskPriority, TaskStatus } from '../../types';
import TaskCard from '../../components/common/TaskCard';

// ─── types ────────────────────────────────────────────────────────────────

type TabValue = 'today' | 'upcoming' | 'completed';

type SortOption = 'time' | 'priority' | 'distance' | 'updated';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const PRIORITY_FILTERS: { label: string; value: TaskPriority | 'all' }[] = [
  { label: 'All Priority', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const STATUS_FILTERS_TODAY: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'En Route', value: 'en_route' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Paused', value: 'paused' },
];

const STATUS_FILTERS_UPCOMING: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Accepted', value: 'accepted' },
];

const STATUS_FILTERS_COMPLETED: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Scheduled Time', value: 'time' },
  { label: 'Priority', value: 'priority' },
  { label: 'Distance', value: 'distance' },
  { label: 'Last Updated', value: 'updated' },
];

// ─── component ────────────────────────────────────────────────────────────

export default function TasksPage() {
  const navigate = useNavigate();
  const { getTodayTasks, getUpcomingTasks, getCompletedTasks, isLoading } = useTaskStore();

  const [activeTab, setActiveTab] = useState<TabValue>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const completedTasks = getCompletedTasks();

  const rawTasks = useMemo(() => {
    if (activeTab === 'today') return todayTasks;
    if (activeTab === 'upcoming') return upcomingTasks;
    return completedTasks;
  }, [activeTab, todayTasks, upcomingTasks, completedTasks]);

  const statusFilterOptions = useMemo(() => {
    if (activeTab === 'today') return STATUS_FILTERS_TODAY;
    if (activeTab === 'upcoming') return STATUS_FILTERS_UPCOMING;
    return STATUS_FILTERS_COMPLETED;
  }, [activeTab]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
    setPriorityFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setPriorityFilter('all');
    setStatusFilter('all');
  }, []);

  const filteredTasks = useMemo(() => {
    let tasks = [...rawTasks];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter((t) => {
        const customer = mockCustomers.find((c) => c.id === t.customerId);
        return (
          t.title.toLowerCase().includes(q) ||
          t.workOrderNumber.toLowerCase().includes(q) ||
          (customer?.name ?? '').toLowerCase().includes(q)
        );
      });
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      tasks = tasks.filter((t) => t.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      tasks = tasks.filter((t) => t.status === statusFilter);
    }

    // Sort
    tasks.sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime();
      }
      if (sortBy === 'priority') {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      // last updated — use syncStatus as proxy; pending/failed sorts first
      const syncOrder: Record<string, number> = { failed: 0, pending: 1, syncing: 2, synced: 3 };
      return (syncOrder[a.syncStatus] ?? 3) - (syncOrder[b.syncStatus] ?? 3);
    });

    return tasks;
  }, [rawTasks, searchQuery, priorityFilter, statusFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || priorityFilter !== 'all' || statusFilter !== 'all';

  const taskCountLabel = useMemo(() => {
    const n = filteredTasks.length;
    const tabLabel = activeTab === 'today' ? 'today' : activeTab === 'upcoming' ? 'upcoming' : 'completed';
    return `${n} task${n !== 1 ? 's' : ''} ${tabLabel}`;
  }, [filteredTasks.length, activeTab]);

  const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sticky AppBar ─────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: 10,
        }}
      >
        <Toolbar sx={{ px: 2, minHeight: 56, gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, fontSize: '1.125rem', flex: 1 }}
          >
            Tasks
          </Typography>
          <IconButton
            size="small"
            onClick={() => setSortDrawerOpen(true)}
            aria-label="Sort tasks"
            sx={{ color: 'text.secondary' }}
          >
            <FilterList fontSize="small" />
          </IconButton>
        </Toolbar>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 44,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab
            label={`Today (${todayTasks.length})`}
            value="today"
          />
          <Tab
            label={`Upcoming (${upcomingTasks.length})`}
            value="upcoming"
          />
          <Tab
            label={`Done (${completedTasks.length})`}
            value="completed"
          />
        </Tabs>

        {/* Search bar */}
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by title, WO number, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                      aria-label="Clear search"
                    >
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                bgcolor: 'action.hover',
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        {/* Filter chips */}
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
          {PRIORITY_FILTERS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              size="small"
              onClick={() => setPriorityFilter(f.value)}
              variant={priorityFilter === f.value ? 'filled' : 'outlined'}
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                ...(priorityFilter === f.value
                  ? { bgcolor: '#2457D6', color: '#fff', borderColor: '#2457D6' }
                  : { bgcolor: 'transparent', color: 'text.secondary', borderColor: 'divider' }),
                '&:hover': { opacity: 0.85 },
              }}
            />
          ))}

          <Box sx={{ width: 1, flexShrink: 0, bgcolor: 'divider', alignSelf: 'stretch', mx: 0.25 }} />

          {statusFilterOptions.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              size="small"
              onClick={() => setStatusFilter(f.value as TaskStatus | 'all')}
              variant={statusFilter === f.value ? 'filled' : 'outlined'}
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 28,
                ...(statusFilter === f.value
                  ? { bgcolor: '#2457D6', color: '#fff', borderColor: '#2457D6' }
                  : { bgcolor: 'transparent', color: 'text.secondary', borderColor: 'divider' }),
                '&:hover': { opacity: 0.85 },
              }}
            />
          ))}
        </Box>
      </AppBar>

      {/* ── Page body ─────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, px: 2, pt: 1.5, pb: 10 }}>

        {/* Task count + sort label row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {taskCountLabel}
          </Typography>

          <Button
            size="small"
            startIcon={<Sort sx={{ fontSize: 14 }} />}
            onClick={() => setSortDrawerOpen(true)}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              py: 0,
              minWidth: 0,
              '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
            }}
          >
            {selectedSortLabel}
          </Button>
        </Box>

        {/* Loading skeleton */}
        {isLoading && (
          <Box>
            {[0, 1, 2].map((i) => (
              <Card key={i} sx={{ mb: 1.5, borderRadius: 2 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Skeleton variant="text" width="40%" height={16} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="75%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="55%" height={14} />
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Task list */}
        {!isLoading && (
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3), duration: 0.25, ease: 'easeOut' }}
                  layout
                >
                  <TaskCard
                    task={task}
                    onClick={() => navigate(`/field-flow/app/tasks/${task.id}`)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 6,
                    pb: 4,
                    textAlign: 'center',
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <FilterList sx={{ fontSize: 28, color: 'text.secondary' }} />
                  </Box>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5 }}
                  >
                    {hasActiveFilters ? 'No tasks match your filters' : 'No tasks here'}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2 }}
                  >
                    {hasActiveFilters
                      ? 'Try adjusting your search or filters to find what you are looking for.'
                      : activeTab === 'today'
                      ? 'You have no tasks scheduled for today.'
                      : activeTab === 'upcoming'
                      ? 'No upcoming tasks assigned yet.'
                      : 'Completed tasks will appear here.'}
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleClearFilters}
                      sx={{
                        borderRadius: '100px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Box>

      {/* ── Sort Bottom Drawer ─────────────────────────────────────────── */}
      <Drawer
        anchor="bottom"
        open={sortDrawerOpen}
        onClose={() => setSortDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '70vh',
            },
          },
        }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 2,
              bgcolor: 'divider',
              mx: 'auto',
              mb: 2,
            }}
          />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              mb: 0.5,
            }}
          >
            Sort Tasks
          </Typography>
        </Box>

        <Divider />

        <List disablePadding>
          {SORT_OPTIONS.map((option, idx) => (
            <Box key={option.value}>
              <ListItemButton
                onClick={() => {
                  setSortBy(option.value);
                  setSortDrawerOpen(false);
                }}
                selected={sortBy === option.value}
                sx={{
                  px: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: '#EEF2FF',
                    '&:hover': { bgcolor: '#EEF2FF' },
                  },
                }}
              >
                <ListItemText
                  primary={option.label}
                  slotProps={{
                    primary: {
                      style: {
                        fontWeight: sortBy === option.value ? 700 : 500,
                        fontSize: '0.9375rem',
                        color: sortBy === option.value ? '#2457D6' : undefined,
                      },
                    },
                  }}
                />
                {sortBy === option.value && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#2457D6',
                    }}
                  />
                )}
              </ListItemButton>
              {idx < SORT_OPTIONS.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))}
        </List>

        <Box sx={{ pb: 3 }} />
      </Drawer>
    </Box>
  );
}
