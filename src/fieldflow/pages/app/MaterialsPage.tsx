import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Delete,
  Warning,
  CloudOff,
  Search,
  QrCodeScanner,
  RemoveCircleOutlined,
  AddCircleOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, useOfflineStore } from '../../stores';
import { mockMaterialsCatalogue } from '../../data';
import type { MaterialUsed } from '../../types';

// ─── constants ─────────────────────────────────────────────────────────────

const SYNC_COLORS: Record<string, string> = {
  pending: '#A06400',
  synced: '#147A45',
  failed: '#BA1A1A',
  syncing: '#2457D6',
};

// ─── snackbar ─────────────────────────────────────────────────────────────

function Snackbar({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="snack"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22 }}
          style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 1600, pointerEvents: 'none', maxWidth: 'calc(100vw - 32px)' }}
        >
          <Box sx={{ bgcolor: '#1A1B1F', color: '#fff', borderRadius: '100px', px: 2.5, py: 1, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: 4 }}>
            {message}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── material row ──────────────────────────────────────────────────────────

interface MaterialRowProps {
  material: MaterialUsed;
  onDelete: () => void;
  onQuantityChange: (delta: number) => void;
}

function MaterialRow({ material, onDelete, onQuantityChange }: MaterialRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:last-child': { borderBottom: 'none' },
        }}
      >
        {/* Top row: part name + sync dot + delete */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: SYNC_COLORS[material.syncStatus] ?? '#999',
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {material.name}
              </Typography>
              {material.isUnlisted && (
                <Chip
                  label="Unlisted"
                  size="small"
                  sx={{ height: 18, bgcolor: '#FFF5E0', color: '#A06400', fontWeight: 700, fontSize: '0.625rem', '& .MuiChip-label': { px: 0.75 } }}
                />
              )}
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
              {material.partNumber}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onDelete}
            aria-label="Delete material"
            sx={{ color: 'text.disabled', '&:hover': { color: '#BA1A1A' }, p: 0.5 }}
          >
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Bottom row: qty controls + unit + notes */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Quantity controls */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              px: 0.5,
              py: 0.25,
            }}
          >
            <IconButton
              size="small"
              onClick={() => onQuantityChange(-1)}
              disabled={material.quantity <= 1}
              aria-label="Decrease quantity"
              sx={{ p: 0.25 }}
            >
              <RemoveCircleOutlined sx={{ fontSize: 18, color: material.quantity <= 1 ? 'text.disabled' : 'text.secondary' }} />
            </IconButton>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', minWidth: 28, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
              {material.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => onQuantityChange(1)}
              aria-label="Increase quantity"
              sx={{ p: 0.25 }}
            >
              <AddCircleOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            </IconButton>
          </Box>

          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
            {material.unit}
          </Typography>

          {material.notes && (
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {material.notes}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function MaterialsPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { getTask, materials, addMaterial, removeMaterial, updateMaterial } = useTaskStore();
  const { isOffline } = useOfflineStore();
  const task = getTask(taskId ?? '');

  const [snackText, setSnackText] = useState<string | null>(null);

  // Add part sheet
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogue, setSelectedCatalogue] = useState<(typeof mockMaterialsCatalogue)[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isUnlisted, setIsUnlisted] = useState(false);
  const [unlistedName, setUnlistedName] = useState('');
  const [unlistedPartNumber, setUnlistedPartNumber] = useState('');
  const [unlistedUnit, setUnlistedUnit] = useState('pcs');

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  const taskMaterials = materials.filter((m) => m.taskId === taskId);

  const catalogueResults = useMemo(() => {
    if (!searchQuery.trim()) return mockMaterialsCatalogue.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return mockMaterialsCatalogue
      .filter((p) => p.name.toLowerCase().includes(q) || p.partNumber.toLowerCase().includes(q))
      .slice(0, 10);
  }, [searchQuery]);

  const resetAddForm = useCallback(() => {
    setSearchQuery('');
    setSelectedCatalogue(null);
    setQuantity(1);
    setNotes('');
    setIsUnlisted(false);
    setUnlistedName('');
    setUnlistedPartNumber('');
    setUnlistedUnit('pcs');
  }, []);

  const handleAddMaterial = useCallback(() => {
    const newMaterial: MaterialUsed = isUnlisted
      ? {
          id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          taskId: taskId ?? '',
          partNumber: unlistedPartNumber.trim() || 'UNLISTED',
          name: unlistedName.trim(),
          quantity,
          unit: unlistedUnit.trim(),
          notes: notes.trim() || undefined,
          isUnlisted: true,
          addedAt: new Date().toISOString(),
          syncStatus: 'pending',
        }
      : {
          id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          taskId: taskId ?? '',
          partNumber: selectedCatalogue!.partNumber,
          name: selectedCatalogue!.name,
          quantity,
          unit: selectedCatalogue!.unit,
          notes: notes.trim() || undefined,
          isUnlisted: false,
          addedAt: new Date().toISOString(),
          syncStatus: 'pending',
        };

    addMaterial(newMaterial);
    setAddOpen(false);
    resetAddForm();
    showSnack('Part added');
  }, [isUnlisted, taskId, unlistedPartNumber, unlistedName, quantity, unlistedUnit, notes, selectedCatalogue, addMaterial, resetAddForm, showSnack]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingId) return;
    removeMaterial(deletingId);
    setDeletingId(null);
    showSnack('Part removed');
  }, [deletingId, removeMaterial, showSnack]);

  const handleQuantityChange = useCallback((materialId: string, delta: number) => {
    const mat = taskMaterials.find((m) => m.id === materialId);
    if (!mat) return;
    const newQty = Math.max(1, mat.quantity + delta);
    updateMaterial(materialId, { quantity: newQty, syncStatus: 'pending' });
  }, [taskMaterials, updateMaterial]);

  const canAdd = isUnlisted ? unlistedName.trim().length > 0 : selectedCatalogue !== null;

  if (!task) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: 1, minHeight: 56 }}>
            <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBack /></IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', ml: 0.5 }}>Materials Used</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Task not found.</Typography>
        </Box>
      </Box>
    );
  }

  const hasUnavailableRequired = task.requiredParts.some((p) => !p.available);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary', zIndex: 10 }}
      >
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton onClick={() => navigate(-1)} edge="start" aria-label="Go back" size="small">
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0, mx: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Materials Used</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>{task.workOrderNumber}</Typography>
          </Box>
          {taskMaterials.length > 0 && (
            <Chip
              label={`${taskMaterials.length} part${taskMaterials.length > 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', height: 24, '& .MuiChip-label': { px: 1 } }}
            />
          )}
        </Toolbar>
      </AppBar>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: '80px' }}>

        {/* Offline notice */}
        {isOffline && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#F5E6C8',
                border: '1px solid #E8D4A0',
                mb: 1.5,
              }}
            >
              <CloudOff sx={{ fontSize: 16, color: '#6B4E16', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.8125rem', color: '#6B4E16', fontWeight: 600 }}>
                Materials saved locally. Will sync when online.
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Required Parts section */}
        {task.requiredParts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card sx={{ mb: 1.5, borderRadius: 3 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.25 }}>
                  Required Parts
                </Typography>

                {hasUnavailableRequired && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: '#FFF0EE',
                      border: '1px solid #F5B8B4',
                      mb: 1.25,
                    }}
                  >
                    <Warning sx={{ fontSize: 16, color: '#BA1A1A', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.8125rem', color: '#BA1A1A', fontWeight: 600 }}>
                      Some required parts are out of stock
                    </Typography>
                  </Box>
                )}

                <Stack spacing={0.75}>
                  {task.requiredParts.map((part) => {
                    const alreadyAdded = taskMaterials.some((m) => m.partNumber === part.partNumber);
                    return (
                      <Box
                        key={part.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.25,
                          borderRadius: 1.5,
                          bgcolor: part.available ? 'action.hover' : '#FFF0EE',
                          border: '1px solid',
                          borderColor: part.available ? 'divider' : '#F5B8B4',
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.125 }}>
                            {part.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                            {part.partNumber} · Qty: {part.quantity} {part.unit}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                          {!part.available && (
                            <Chip
                              label="Out of stock"
                              size="small"
                              sx={{ bgcolor: '#FFDAD6', color: '#BA1A1A', fontWeight: 700, fontSize: '0.6875rem', height: 22, '& .MuiChip-label': { px: 0.75 } }}
                            />
                          )}
                          {part.available && !alreadyAdded && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Add sx={{ fontSize: 14 }} />}
                              onClick={() => {
                                const cat = mockMaterialsCatalogue.find((c) => c.partNumber === part.partNumber);
                                const newMat: MaterialUsed = {
                                  id: `mat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                  taskId: taskId ?? '',
                                  partNumber: part.partNumber,
                                  name: part.name,
                                  quantity: part.quantity,
                                  unit: cat?.unit ?? part.unit,
                                  isUnlisted: false,
                                  addedAt: new Date().toISOString(),
                                  syncStatus: 'pending',
                                };
                                addMaterial(newMat);
                                showSnack(`${part.name} added`);
                              }}
                              sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', height: 30, borderColor: 'divider', color: 'text.primary', px: 1 }}
                            >
                              Add
                            </Button>
                          )}
                          {alreadyAdded && (
                            <Chip
                              label="Added"
                              size="small"
                              sx={{ bgcolor: '#D4EDDA', color: '#147A45', fontWeight: 700, fontSize: '0.6875rem', height: 22, '& .MuiChip-label': { px: 0.75 } }}
                            />
                          )}
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Parts Used section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
          <Card sx={{ mb: 1.5, borderRadius: 3 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary' }}>
                  Parts Used
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Add sx={{ fontSize: 14 }} />}
                  onClick={() => setAddOpen(true)}
                  sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', height: 30, boxShadow: 'none', px: 1.5 }}
                >
                  Add Part
                </Button>
              </Box>

              {taskMaterials.length === 0 ? (
                <Box
                  sx={{
                    py: 3,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.secondary', mb: 0.5 }}>
                    No parts recorded yet
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled', mb: 1.5 }}>
                    Record all parts and materials used on this job
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Add sx={{ fontSize: 14 }} />}
                    onClick={() => setAddOpen(true)}
                    sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem', height: 36, borderColor: 'divider', color: 'text.primary' }}
                  >
                    Add First Part
                  </Button>
                </Box>
              ) : (
                <AnimatePresence>
                  {taskMaterials.map((mat) => (
                    <MaterialRow
                      key={mat.id}
                      material={mat}
                      onDelete={() => setDeletingId(mat.id)}
                      onQuantityChange={(delta) => handleQuantityChange(mat.id, delta)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Offline sync note */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CloudOff sx={{ fontSize: 15, color: 'text.disabled', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
            Materials saved locally. Will sync automatically when a connection is available.
          </Typography>
        </Box>
      </Box>

      {/* Sticky bottom button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 2,
          pt: 1.5,
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          zIndex: 20,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate(`/field-flow/app/tasks/${taskId}`)}
          sx={{
            borderRadius: '100px',
            textTransform: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            height: 52,
            boxShadow: 'none',
          }}
        >
          Done
        </Button>
      </Box>

      {/* Add Part bottom sheet */}
      <Dialog
        open={addOpen}
        onClose={() => { setAddOpen(false); resetAddForm(); }}
        slotProps={{
          paper: {
            sx: {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              m: 0,
              borderRadius: '16px 16px 0 0',
              maxWidth: '100%',
              width: '100%',
              maxHeight: '90dvh',
            },
          },
        }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.0625rem', pb: 1 }}>
          Add Part
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          {/* Unlisted toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={isUnlisted}
                onChange={(e) => {
                  setIsUnlisted(e.target.checked);
                  setSelectedCatalogue(null);
                  setSearchQuery('');
                }}
                size="small"
              />
            }
            label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Unlisted / Non-catalogue item</Typography>}
            sx={{ mb: 1.5 }}
          />

          {isUnlisted ? (
            /* Unlisted item manual entry */
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                label="Part Name"
                placeholder="e.g. Bespoke bracket assembly"
                value={unlistedName}
                onChange={(e) => setUnlistedName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Part Number (optional)"
                placeholder="e.g. CUST-BRK-001"
                value={unlistedPartNumber}
                onChange={(e) => setUnlistedPartNumber(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Unit"
                placeholder="e.g. pcs, m, L"
                value={unlistedUnit}
                onChange={(e) => setUnlistedUnit(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Stack>
          ) : (
            /* Catalogue search */
            <Box>
              {selectedCatalogue ? (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: '#D4EDDA',
                    border: '1px solid #9DD4AF',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#147A45' }}>
                      {selectedCatalogue.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#147A45', fontFamily: 'monospace' }}>
                      {selectedCatalogue.partNumber} · {selectedCatalogue.unit}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setSelectedCatalogue(null)}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#147A45', minWidth: 0 }}
                  >
                    Change
                  </Button>
                </Box>
              ) : (
                <>
                  <TextField
                    fullWidth
                    placeholder="Search parts catalogue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <Box
                    sx={{
                      maxHeight: 220,
                      overflowY: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      mb: 1.5,
                    }}
                  >
                    <List dense disablePadding>
                      {catalogueResults.length === 0 ? (
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemText
                            primary="No matching parts found"
                            slotProps={{ primary: { style: { fontSize: '0.875rem', color: 'text.secondary' } } }}
                          />
                        </ListItem>
                      ) : (
                        catalogueResults.map((cat, idx) => (
                          <Box key={cat.partNumber}>
                            <ListItemButton
                              onClick={() => setSelectedCatalogue(cat)}
                              sx={{ py: 1, '&:hover': { bgcolor: 'action.hover' } }}
                            >
                              <ListItemText
                                primary={cat.name}
                                secondary={`${cat.partNumber} · ${cat.unit}`}
                                slotProps={{ primary: { style: { fontSize: '0.875rem', fontWeight: 600 } }, secondary: { style: { fontSize: '0.75rem', fontFamily: 'monospace' } } }}
                              />
                            </ListItemButton>
                            {idx < catalogueResults.length - 1 && <Divider />}
                          </Box>
                        ))
                      )}
                    </List>
                  </Box>
                </>
              )}

              {/* Scan barcode option */}
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<QrCodeScanner sx={{ fontSize: 16 }} />}
                onClick={() => {
                  setAddOpen(false);
                  showSnack('Barcode scanner coming soon');
                }}
                sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem', height: 36, borderColor: 'divider', color: 'text.secondary', mb: 1.5 }}
              >
                Scan Barcode
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Quantity */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', flex: 1 }}>Quantity</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                sx={{ bgcolor: 'action.hover', borderRadius: 1.5, p: 0.5 }}
              >
                <RemoveCircleOutlined sx={{ fontSize: 20 }} />
              </IconButton>
              <TextField
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 1) setQuantity(v);
                }}
                type="number"
                size="small"
                sx={{
                  width: 72,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& input': { textAlign: 'center', fontWeight: 800, fontSize: '1rem', py: 0.75 },
                }}
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <IconButton
                size="small"
                onClick={() => setQuantity((q) => q + 1)}
                sx={{ bgcolor: 'action.hover', borderRadius: 1.5, p: 0.5 }}
              >
                <AddCircleOutlined sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', minWidth: 32 }}>
              {isUnlisted ? unlistedUnit : selectedCatalogue?.unit ?? ''}
            </Typography>
          </Box>

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes (optional)"
            placeholder="e.g. installed on Unit 1 only"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => { setAddOpen(false); resetAddForm(); }}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMaterial}
            variant="contained"
            disabled={!canAdd}
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', flex: 1 }}
          >
            Add Part
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>Remove Part?</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {(() => {
              const mat = taskMaterials.find((m) => m.id === deletingId);
              return mat
                ? `Remove ${mat.name} (${mat.quantity} ${mat.unit}) from the parts list?`
                : 'Remove this part from the parts list?';
            })()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeletingId(null)} sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', bgcolor: '#BA1A1A', '&:hover': { bgcolor: '#9B1212', boxShadow: 'none' } }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar message={snackText} />
    </Box>
  );
}
