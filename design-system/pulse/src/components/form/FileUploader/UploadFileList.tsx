// Implements Figma page "File Uploader": Building blocks/File Uploader Uploaded List (List View, Thumbnail View, Error, Rename)
// and File Uploader Progress Bar (List | Thumbnail, 0% | 50%).
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { ProgressBar } from '../../data-display/ProgressBar/ProgressBar';
import ButtonBase from '@mui/material/ButtonBase';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutlineRounded';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import MusicNoteOutlined from '@mui/icons-material/MusicNoteOutlined';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconButton } from '../../actions/IconButton/IconButton';
import { disabledOpacity, pt, textStyle } from '../../../theme/pulseTokens';

const fu = pt.uiElements.fileUpload.color;

export interface UploadFile {
  id: string | number;
  name: string;
  /** Size in bytes, shown in the helper line. */
  size?: number;
  /** MIME type or extension; picks the icon. */
  type?: string;
  /** Preview URL for images/video in thumbnail view. */
  url?: string;
  /** Free text shown next to the size. */
  description?: string;
  /** 0-100 while uploading. */
  progress?: number;
  status?: 'uploading' | 'uploaded' | 'error';
  /** Error message (status "error"). */
  error?: string;
  /** Underlying File (when produced by FileUploader). */
  file?: File;
}

export interface UploadFileListProps {
  files: UploadFile[];
  /** @default "list" */
  variant?: 'list' | 'thumbnail';
  disabled?: boolean;
  onView?: (file: UploadFile) => void;
  onDownload?: (file: UploadFile) => void;
  onDelete?: (file: UploadFile) => void;
  /** Cancel an upload in progress. */
  onCancel?: (file: UploadFile) => void;
  /** Provide to enable the rename action. */
  onRename?: (file: UploadFile, name: string) => void;
  /** File opened in rename mode (Figma "List View - Rename"). */
  renamingId?: UploadFile['id'];
}

export const formatBytes = (n?: number): string => {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

function kindOf(f: UploadFile): 'pdf' | 'image' | 'video' | 'audio' | 'doc' | 'other' {
  const s = `${f.type ?? ''} ${f.name}`.toLowerCase();
  if (/pdf/.test(s)) return 'pdf';
  if (/image|\.(png|jpe?g|gif|svg|webp|bmp)\b/.test(s)) return 'image';
  if (/video|\.(mp4|mov|avi|mkv|webm)\b/.test(s)) return 'video';
  if (/audio|\.(mp3|wav|m4a|ogg)\b/.test(s)) return 'audio';
  if (/word|document|text|sheet|excel|\.(docx?|xlsx?|txt|csv|pptx?)\b/.test(s)) return 'doc';
  return 'other';
}

function TypeIcon({ file, size = 24 }: { file: UploadFile; size?: number }) {
  const sx = { fontSize: size, color: fu.previewIcon };
  switch (kindOf(file)) {
    case 'pdf': return <PictureAsPdfOutlined sx={sx} />;
    case 'image': return <ImageOutlined sx={sx} />;
    case 'video': return <VideocamOutlined sx={sx} />;
    case 'audio': return <MusicNoteOutlined sx={sx} />;
    case 'doc': return <DescriptionOutlined sx={sx} />;
    default: return <InsertDriveFileOutlined sx={sx} />;
  }
}

const helperText = (f: UploadFile) => [formatBytes(f.size), f.description].filter(Boolean).join(' · ');

function FileName({ file, onView, disabled }: { file: UploadFile; onView?: (f: UploadFile) => void; disabled?: boolean }) {
  const isError = file.status === 'error';
  const sx = { ...textStyle('textL'), color: isError ? 'text.primary' : fu.previewIconLink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', textAlign: 'left' as const };
  if (isError || !onView || disabled) return <Box sx={{ ...sx, color: 'text.primary' }}>{file.name}</Box>;
  return (
    <ButtonBase onClick={() => onView(file)} sx={{ ...sx, justifyContent: 'flex-start', textDecoration: 'underline', '&:focus-visible': { boxShadow: pt.shadow.focusStyle_1, borderRadius: '2px' } }}>
      {/* ButtonBase is a flex box: the ellipsis only works on an inner block, not on its text node. */}
      <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Box>
    </ButtonBase>
  );
}

function Helper({ file }: { file: UploadFile }) {
  const isError = file.status === 'error';
  return (
    <Box sx={{ ...textStyle('textS'), display: 'flex', alignItems: 'center', gap: '4px', color: isError ? 'error.main' : 'text.secondary', minHeight: 20 }}>
      {isError && <ErrorOutlineRounded sx={{ fontSize: 14 }} />}
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isError ? file.error ?? 'Upload failed' : helperText(file)}</Box>
    </Box>
  );
}

function RenameRow({ file, onSubmit, onCancel }: { file: UploadFile; onSubmit: (name: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(file.name);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: 40 }}>
      <Box sx={{ width: 24, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: '12px' }}><TypeIcon file={file} /></Box>
      <OutlinedInput
        size="small"
        fullWidth
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit(name);
          if (e.key === 'Escape') onCancel();
        }}
        inputProps={{ 'aria-label': 'File name' }}
      />
      <IconButton ariaLabel="Save name" size="small" onClick={() => onSubmit(name)}><CheckRounded fontSize="small" /></IconButton>
      <IconButton ariaLabel="Cancel rename" size="small" onClick={onCancel}><CloseRounded fontSize="small" /></IconButton>
    </Box>
  );
}

function Action({ label, onClick, disabled, children }: { label: string; onClick?: () => void; disabled?: boolean; children: ReactNode }) {
  return <IconButton ariaLabel={label} size="small" onClick={onClick} disabled={disabled}>{children}</IconButton>;
}

/** Rows (List View) or tiles (Thumbnail View) for uploaded and uploading files. */
export function UploadFileList({ files, variant = 'list', disabled, onView, onDownload, onDelete, onCancel, onRename, renamingId }: UploadFileListProps) {
  const [renaming, setRenaming] = useState<UploadFile['id'] | undefined>(renamingId);
  if (files.length === 0) return null;
  const isThumb = variant === 'thumbnail';

  return (
    <Box
      component="ul"
      sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: isThumb ? 'row' : 'column', flexWrap: isThumb ? 'wrap' : 'nowrap', gap: isThumb ? '16px' : 0, opacity: disabled ? disabledOpacity : 1, pointerEvents: disabled ? 'none' : undefined }}
    >
      {files.map((f) => {
        const uploading = f.status === 'uploading';
        const pct = Math.max(0, Math.min(100, f.progress ?? 0));

        if (isThumb) {
          return (
            <Box component="li" key={f.id} data-spec="thumb" sx={{ width: 152, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Box sx={{ position: 'relative', width: 152, height: 152, borderRadius: '4px', bgcolor: fu.previewBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: f.status === 'error' ? 1 : 0, borderColor: 'error.main' }}>
                {f.url && kindOf(f) === 'image' && !uploading ? (
                  <Box component="img" src={f.url} alt={f.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : kindOf(f) === 'video' && !uploading ? (
                  <PlayCircleOutline sx={{ fontSize: 32, color: fu.previewIconLink }} />
                ) : (
                  <TypeIcon file={f} size={32} />
                )}
                {uploading && (
                  // Figma "File Uploader Progress Bar / Thumbnail": 152x6 Pulse progressBar (no label) at the tile's bottom edge (abs 0,146).
                  <ProgressBar value={pct} aria-label={`Uploading ${f.name}`} sx={{ position: 'absolute', left: 0, bottom: 0 }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <FileName file={f} onView={onView} disabled={disabled} />
                  <Helper file={f} />
                </Box>
                {uploading ? (
                  <Action label={`Cancel upload of ${f.name}`} onClick={() => onCancel?.(f)}><CloseRounded fontSize="small" /></Action>
                ) : (
                  <Action label={`Delete ${f.name}`} onClick={() => onDelete?.(f)}><DeleteOutlineRounded fontSize="small" /></Action>
                )}
              </Box>
            </Box>
          );
        }

        if (renaming === f.id) {
          return (
            <Box component="li" key={f.id}>
              <RenameRow
                file={f}
                onSubmit={(n) => {
                  onRename?.(f, n);
                  setRenaming(undefined);
                }}
                onCancel={() => setRenaming(undefined)}
              />
            </Box>
          );
        }

        if (uploading) {
          return (
            <Box component="li" key={f.id} data-spec="progress-row" sx={{ display: 'flex', alignItems: 'center', gap: '16px', py: '4px', borderRadius: '8px' }}>
              <Box sx={{ width: 24, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TypeIcon file={f} /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Figma "File Uploader Progress Bar / List": progressBar Label=Top Both (name left, percentage right). */}
                <ProgressBar value={pct} label="topBoth" labelText={f.name} helperText={formatBytes(f.size)} aria-label={`Uploading ${f.name}`} />
              </Box>
              <Action label={`Cancel upload of ${f.name}`} onClick={() => onCancel?.(f)}><CloseRounded fontSize="small" /></Action>
            </Box>
          );
        }

        return (
          <Box component="li" key={f.id} data-spec="list-row" sx={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: 40, borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
              <Box sx={{ width: 24, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TypeIcon file={f} /></Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <FileName file={f} onView={onView} disabled={disabled} />
                <Helper file={f} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '4px' }}>
              {onView && f.status !== 'error' && <Action label={`View ${f.name}`} onClick={() => onView(f)}><VisibilityOutlined fontSize="small" /></Action>}
              {onDownload && f.status !== 'error' && <Action label={`Download ${f.name}`} onClick={() => onDownload(f)}><DownloadRounded fontSize="small" /></Action>}
              {onRename && f.status !== 'error' && <Action label={`Rename ${f.name}`} onClick={() => setRenaming(f.id)}><EditOutlined fontSize="small" /></Action>}
              <Action label={`Delete ${f.name}`} onClick={() => onDelete?.(f)}><DeleteOutlineRounded fontSize="small" /></Action>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}


