import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  FlashlightOn,
  QrCodeScanner,
  Search,
  CameraAlt,
  CheckCircle,
  Warning,
  Build,
  DeleteOutlined,
  NavigateNext,
  AccessTime,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAssets } from '../../data';
import type { AssetRecord } from '../../types';

dayjs.extend(relativeTime);

// ─── constants ────────────────────────────────────────────────────────────

const DEMO_ASSET_TAGS = ['FF-HVAC-001', 'FF-GEN-001', 'FF-LIFT-004'];

const STATUS_CONFIG: Record<AssetRecord['status'], { label: string; color: string; bg: string }> = {
  operational: { label: 'Operational', color: '#147A45', bg: '#D4EDDA' },
  requires_service: { label: 'Requires Service', color: '#A06400', bg: '#FFF5E0' },
  out_of_service: { label: 'Out of Service', color: '#BA1A1A', bg: '#FFF0EE' },
};

interface RecentScan {
  assetTag: string;
  name: string;
  scannedAt: string;
}

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
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1600,
            pointerEvents: 'none',
            maxWidth: 'calc(100vw - 32px)',
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
            {message}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── viewfinder ───────────────────────────────────────────────────────────

function ScannerViewfinder() {
  const cornerSize = 24;
  const borderWidth = 3;
  const cornerStyle = {
    position: 'absolute' as const,
    width: cornerSize,
    height: cornerSize,
    borderColor: '#fff',
    borderStyle: 'solid',
  };
  return (
    <Box
      sx={{
        position: 'relative',
        width: 220,
        height: 220,
        mx: 'auto',
      }}
    >
      {/* Top-left */}
      <Box sx={{ ...cornerStyle, top: 0, left: 0, borderWidth: `${borderWidth}px 0 0 ${borderWidth}px`, borderRadius: '4px 0 0 0' }} />
      {/* Top-right */}
      <Box sx={{ ...cornerStyle, top: 0, right: 0, borderWidth: `${borderWidth}px ${borderWidth}px 0 0`, borderRadius: '0 4px 0 0' }} />
      {/* Bottom-left */}
      <Box sx={{ ...cornerStyle, bottom: 0, left: 0, borderWidth: `0 0 ${borderWidth}px ${borderWidth}px`, borderRadius: '0 0 0 4px' }} />
      {/* Bottom-right */}
      <Box sx={{ ...cornerStyle, bottom: 0, right: 0, borderWidth: `0 ${borderWidth}px ${borderWidth}px 0`, borderRadius: '0 0 4px 0' }} />

      {/* Scanning line animation */}
      <motion.div
        style={{ position: 'absolute', left: cornerSize, right: cornerSize, height: 2, background: 'rgba(255,255,255,0.7)', top: cornerSize }}
        animate={{ top: [cornerSize, 220 - cornerSize, cornerSize] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Box>
  );
}

// ─── asset detail card ─────────────────────────────────────────────────────

interface AssetCardProps {
  asset: AssetRecord;
  onAssociate: () => void;
  onHistory: () => void;
}

function AssetDetailCard({ asset, onAssociate, onHistory }: AssetCardProps) {
  const statusCfg = STATUS_CONFIG[asset.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1.5px solid', borderColor: statusCfg.bg === '#D4EDDA' ? '#9DD4AF' : statusCfg.bg === '#FFF5E0' ? '#E8D4A0' : '#F5B8B4', mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Build sx={{ fontSize: 20, color: 'text.secondary' }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.3 }}>{asset.name}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{asset.model}</Typography>
            </Box>
            <Chip
              label={statusCfg.label}
              size="small"
              icon={asset.status === 'operational' ? <CheckCircle sx={{ fontSize: 12 }} /> : <Warning sx={{ fontSize: 12 }} />}
              sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 700, bgcolor: statusCfg.bg, color: statusCfg.color, flexShrink: 0, '& .MuiChip-label': { px: 0.75 } }}
            />
          </Box>

          <Stack spacing={0.75} sx={{ mb: 1.75 }}>
            {[
              ['Asset Tag', asset.assetTag],
              ['Serial Number', asset.serialNumber],
              ['Location', asset.location],
              ['Last Service', dayjs(asset.lastServiceDate).format('D MMM YYYY')],
              ['Next Service', dayjs(asset.nextServiceDate).format('D MMM YYYY')],
            ].map(([label, value]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', flexShrink: 0 }}>{label}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, textAlign: 'right', fontFamily: label === 'Asset Tag' || label === 'Serial Number' ? 'monospace' : undefined }}>{value}</Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={onAssociate}
              sx={{ flex: 1, borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem', height: 40, boxShadow: 'none', bgcolor: '#147A45', '&:hover': { bgcolor: '#0F5C34', boxShadow: 'none' } }}
            >
              Associate with Task
            </Button>
            <Button
              variant="outlined"
              size="small"
              endIcon={<NavigateNext sx={{ fontSize: 16 }} />}
              onClick={onHistory}
              sx={{ flex: 1, borderRadius: '100px', textTransform: 'none', fontWeight: 700, fontSize: '0.8125rem', height: 40, borderColor: 'divider', color: 'text.primary' }}
            >
              View History
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────

export default function ScanPage() {
  const navigate = useNavigate();
  // taskId is optional – scan can be accessed standalone
  const { taskId } = useParams<{ taskId?: string }>();

  const [manualInput, setManualInput] = useState('');
  const [scannedAsset, setScannedAsset] = useState<AssetRecord | null | 'not_found'>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>(() => {
    try {
      const stored = localStorage.getItem('fieldflow-recent-scans');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [snackText, setSnackText] = useState<string | null>(null);
  const [cameraSupported] = useState(() => !!(navigator.mediaDevices?.getUserMedia));
  const [scannerActive, setScannerActive] = useState(false);

  const showSnack = useCallback((msg: string) => {
    setSnackText(msg);
    setTimeout(() => setSnackText(null), 2800);
  }, []);

  // ── scanner setup (html5-qrcode graceful degradation) ─────────────────────

  const scannerContainerId = 'ff-qr-scanner';
  const html5ScannerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!scannerActive || !cameraSupported) return;

    let mounted = true;
    let scanner: { clear: () => Promise<void> } | null = null;

    (async () => {
      try {
        // Dynamic import – graceful fallback if not installed
        const { Html5QrcodeScanner } = await import('html5-qrcode' as never) as { Html5QrcodeScanner: new (id: string, config: unknown, verbose: boolean) => { render: (onSuccess: (text: string) => void, onError: () => void) => void; clear: () => Promise<void> } };
        if (!mounted) return;

        const qrScanner = new Html5QrcodeScanner(
          scannerContainerId,
          { fps: 10, qrbox: { width: 220, height: 220 } },
          false
        );

        qrScanner.render(
          (decodedText: string) => {
            if (mounted) handleScan(decodedText.trim().toUpperCase());
          },
          () => {
            // Ignore per-frame errors
          }
        );

        scanner = qrScanner;
        html5ScannerRef.current = qrScanner;
      } catch {
        // html5-qrcode not available – fallback is already visible
      }
    })();

    return () => {
      mounted = false;
      if (scanner) scanner.clear().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerActive]);

  // ── scan handler ──────────────────────────────────────────────────────────

  const handleScan = useCallback((assetTag: string) => {
    const found = mockAssets.find(
      (a) => a.assetTag.toUpperCase() === assetTag.toUpperCase() || a.qrCode.toUpperCase() === assetTag.toUpperCase()
    );

    setScannedAsset(found ?? 'not_found');

    if (found) {
      const newScan: RecentScan = {
        assetTag: found.assetTag,
        name: found.name,
        scannedAt: new Date().toISOString(),
      };
      setRecentScans((prev) => {
        const filtered = prev.filter((s) => s.assetTag !== found.assetTag);
        const updated = [newScan, ...filtered].slice(0, 5);
        try { localStorage.setItem('fieldflow-recent-scans', JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
      showSnack(`Asset found: ${found.name}`);
    } else {
      showSnack('Asset not found in database');
    }

    setScannerActive(false);
    setManualInput('');
  }, [showSnack]);

  const handleManualLookup = useCallback(() => {
    const query = manualInput.trim();
    if (!query) return;
    handleScan(query);
  }, [manualInput, handleScan]);

  const handleRecentScanTap = useCallback((scan: RecentScan) => {
    handleScan(scan.assetTag);
  }, [handleScan]);

  const handleClearHistory = useCallback(() => {
    setRecentScans([]);
    try { localStorage.removeItem('fieldflow-recent-scans'); } catch { /* ignore */ }
    showSnack('Scan history cleared');
  }, [showSnack]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary', zIndex: 10 }}
      >
        <Toolbar sx={{ px: 1, minHeight: 56, gap: 0.5 }}>
          <IconButton
            onClick={() => navigate(-1)}
            edge="start"
            aria-label="Close scanner"
            size="small"
          >
            <Close />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0, mx: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Scan Asset</Typography>
          </Box>
          <IconButton
            size="small"
            aria-label="Toggle flashlight"
            onClick={() => showSnack('Flashlight not available in browser')}
          >
            <FlashlightOn sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1, px: 2, pt: 2, pb: 4 }}>

        {/* Scanner section */}
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {/* Camera area */}
            <Box
              sx={{
                bgcolor: '#0D0D0D',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                p: 3,
              }}
            >
              {!scannerActive ? (
                <>
                  {/* Idle viewfinder preview */}
                  <Box sx={{ opacity: 0.4, mb: 2 }}>
                    <ScannerViewfinder />
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textAlign: 'center', mb: 2 }}>
                    {cameraSupported
                      ? 'Tap to activate camera scanner'
                      : 'Camera not supported — use manual entry below'}
                  </Typography>
                  {cameraSupported && (
                    <Button
                      variant="contained"
                      startIcon={<CameraAlt sx={{ fontSize: 18 }} />}
                      onClick={() => setScannerActive(true)}
                      sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }, boxShadow: 'none' }}
                    >
                      Activate Camera
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {/* Active scanner – html5-qrcode container or overlay */}
                  <Box sx={{ width: '100%', position: 'relative' }}>
                    <Box id={scannerContainerId} sx={{ width: '100%' }} />
                    <Box sx={{ mb: 2 }}>
                      <ScannerViewfinder />
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', textAlign: 'center' }}>
                      Point camera at QR code or barcode
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setScannerActive(false)}
                    sx={{ mt: 1.5, textTransform: 'none', fontWeight: 700, color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>

            {/* Demo scan buttons */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.25 }}>
                Demo Scans
              </Typography>
              <Stack spacing={0.75}>
                {DEMO_ASSET_TAGS.map((tag) => {
                  const asset = mockAssets.find((a) => a.assetTag === tag);
                  return (
                    <Button
                      key={tag}
                      fullWidth
                      variant="outlined"
                      startIcon={<QrCodeScanner sx={{ fontSize: 16 }} />}
                      onClick={() => handleScan(tag)}
                      sx={{
                        borderRadius: '100px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        height: 44,
                        borderColor: 'divider',
                        color: 'text.primary',
                        justifyContent: 'flex-start',
                        px: 2,
                        gap: 0.5,
                      }}
                    >
                      <Box sx={{ flex: 1, textAlign: 'left' }}>
                        Scan {tag}
                      </Box>
                      {asset && (
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>
                          {asset.name}
                        </Typography>
                      )}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Manual entry */}
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary', mb: 1.25 }}>
              Manual Entry
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Enter asset tag or barcode"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualLookup()}
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleManualLookup}
                disabled={!manualInput.trim()}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', px: 2, boxShadow: 'none', flexShrink: 0 }}
              >
                Lookup
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Scan result */}
        <AnimatePresence mode="wait">
          {scannedAsset !== null && (
            <Box key={scannedAsset === 'not_found' ? 'not-found' : (scannedAsset as AssetRecord).id}>
              {scannedAsset === 'not_found' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1.5px solid #F5B8B4', bgcolor: '#FFF0EE' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Warning sx={{ fontSize: 22, color: '#BA1A1A', flexShrink: 0 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', color: '#BA1A1A' }}>Asset Not Found</Typography>
                          <Typography sx={{ fontSize: '0.8125rem', color: '#BA1A1A' }}>
                            This asset tag is not in the database.
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setScannedAsset(null);
                          setManualInput('');
                        }}
                        sx={{ borderRadius: '100px', textTransform: 'none', fontWeight: 700, borderColor: '#F5B8B4', color: '#BA1A1A' }}
                      >
                        Try Another Tag
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <AssetDetailCard
                  asset={scannedAsset as AssetRecord}
                  onAssociate={() => showSnack(`${(scannedAsset as AssetRecord).name} associated with current task`)}
                  onHistory={() => showSnack('Asset history not available in demo')}
                />
              )}
            </Box>
          )}
        </AnimatePresence>

        {/* Recent scans */}
        {recentScans.length > 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.secondary' }}>
                  Recent Scans
                </Typography>
                <Button
                  size="small"
                  startIcon={<DeleteOutlined sx={{ fontSize: 14 }} />}
                  onClick={handleClearHistory}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', py: 0, px: 0.75 }}
                >
                  Clear
                </Button>
              </Box>
              <Stack divider={<Divider />}>
                {recentScans.map((scan) => (
                  <Box
                    key={scan.assetTag}
                    onClick={() => handleRecentScanTap(scan)}
                    sx={{
                      py: 1.25,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      '&:active': { opacity: 0.75 },
                    }}
                  >
                    <QrCodeScanner sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {scan.assetTag}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {scan.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                        {dayjs(scan.scannedAt).fromNow()}
                      </Typography>
                    </Box>
                    <NavigateNext sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>

      <Snackbar message={snackText} />
    </Box>
  );
}
