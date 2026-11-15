// Implements Figma page "File Uploader": File Uploader (Label Position Top | Left) with Building Blocks/File Uploader base
// (Interaction Default | Hover | Disabled | Drag) and the uploaded/progress list.
import { useId, useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined';
import { Button } from '../../actions/Button/Button';
import { Chip } from '../../data-display/Chip/Chip';
import { UploadFileList } from './UploadFileList';
import type { UploadFile, UploadFileListProps } from './UploadFileList';
import { disabledOpacity, pt, textStyle } from '../../../theme/pulseTokens';

export type { UploadFile };

const fu = pt.uiElements.fileUpload.color;

export interface FileUploaderProps {
  label?: ReactNode;
  /** @default "top" */
  labelPosition?: 'top' | 'left';
  required?: boolean;
  hint?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** "dragDrop" shows the dashed drop zone, "button" only the upload buttons. @default "dragDrop" */
  variant?: 'dragDrop' | 'button';
  /** Heading of the drop zone. @default "Drag and drop files here" */
  primaryDescription?: ReactNode;
  /** Format / size hint shown in a chip, e.g. "PDF - DOC - Max 512 MB". */
  description?: ReactNode;
  /** Text of the file-picker button. @default "Upload File" */
  buttonLabel?: string;
  accept?: string;
  multiple?: boolean;
  /** Max size per file in bytes. Larger files are reported through `onReject`. */
  maxSize?: number;
  /** Called with the chosen / dropped files. */
  handleFileSelect?: (files: File[]) => void;
  onReject?: (files: File[], reason: 'size' | 'type') => void;
  /** Uploaded / uploading files (rendered with UploadFileList). */
  files?: UploadFile[];
  fileListVariant?: UploadFileListProps['variant'];
  handleDelete?: (file: UploadFile) => void;
  handleCancel?: (file: UploadFile) => void;
  handleView?: (file: UploadFile) => void;
  handleDownload?: (file: UploadFile) => void;
  handleRename?: (file: UploadFile, name: string) => void;
  /** Optional capture buttons appear only when the handler is passed. */
  handleTakePhoto?: () => void;
  handleScreenshot?: () => void;
  /** Force the hover / drag visual (docs only). */
  forceState?: 'hover' | 'drag';
}

const matchesAccept = (f: File, accept?: string) => {
  if (!accept) return true;
  return accept.split(',').map((s) => s.trim().toLowerCase()).some((a) => (a.startsWith('.') ? f.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a));
};

/** File upload with drag-and-drop zone, picker / capture buttons, and a file list with progress and errors. */
export function FileUploader({
  label, labelPosition = 'top', required, hint, error, disabled, variant = 'dragDrop', primaryDescription = 'Drag and drop files here', description, buttonLabel = 'Upload File', accept, multiple = true, maxSize,
  handleFileSelect, onReject, files, fileListVariant = 'list', handleDelete, handleCancel, handleView, handleDownload, handleRename, handleTakePhoto, handleScreenshot, forceState,
}: FileUploaderProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const left = labelPosition === 'left';
  const dragging = drag || forceState === 'drag';

  const take = (list: FileList | File[] | null) => {
    if (!list || disabled) return;
    let arr = Array.from(list);
    if (!multiple) arr = arr.slice(0, 1);
    const badType = arr.filter((f) => !matchesAccept(f, accept));
    const badSize = arr.filter((f) => maxSize != null && f.size > maxSize);
    if (badType.length) onReject?.(badType, 'type');
    if (badSize.length) onReject?.(badSize, 'size');
    const ok = arr.filter((f) => !badType.includes(f) && !badSize.includes(f));
    if (ok.length) handleFileSelect?.(ok);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    take(e.dataTransfer.files);
  };

  const pick = (
    <Button variant="outlined" size="small" disabled={disabled} onClick={() => input.current?.click()}>
      {buttonLabel}
    </Button>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: left ? 'row' : 'column', gap: left ? '12px' : '4px', width: '100%', alignItems: left ? 'flex-start' : 'stretch' }}>
      {label != null && (
        <FormLabel htmlFor={id} required={required} error={error} disabled={disabled} sx={{ width: left ? 120 : undefined, flexShrink: 0 }}>
          {label}
        </FormLabel>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <input ref={input} id={id} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => { take(e.target.files); e.target.value = ''; }} />
        {variant === 'dragDrop' ? (
          <Box
            data-spec="dropzone"
            onDragOver={(e: DragEvent) => { e.preventDefault(); if (!disabled) setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              p: '40px 48px',
              borderRadius: '8px',
              border: `2px dashed ${error ? pt.formElements.color.error.defaultBorder : dragging ? fu.baseBorderDrag : fu.baseBorderNormal}`,
              bgcolor: dragging ? fu.baseBgDrag : fu.baseBg,
              opacity: disabled ? disabledOpacity : 1,
              pointerEvents: disabled ? 'none' : undefined,
              transition: 'background-color .15s',
              ...(forceState === 'hover' ? { bgcolor: fu.baseBg } : {}),
              '&:hover': { bgcolor: dragging ? fu.baseBgDrag : fu.baseBg, borderColor: fu.baseBorderHover },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: dragging ? fu.baseIconBgDrag : fu.baseIconBg, color: dragging ? fu.baseIconBg : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileUploadOutlined />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', alignSelf: 'stretch' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ ...textStyle('textXl', 'semiBold'), color: 'text.primary' }}>{dragging ? 'Drop files to upload' : primaryDescription}</Box>
                  <Box sx={{ ...textStyle('textL'), color: 'text.secondary' }}>or choose a file from your device</Box>
                </Box>
                <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {pick}
                  {handleTakePhoto && <Button variant="outlined" size="small" disabled={disabled} onClick={handleTakePhoto}>Take Photo</Button>}
                  {handleScreenshot && <Button variant="outlined" size="small" disabled={disabled} onClick={handleScreenshot}>Screenshot</Button>}
                </Box>
                {description != null && <Chip label={description} size="xsmall" color="brand" shape="rectangle" />}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {pick}
            {description != null && <Box sx={{ ...textStyle('textS'), color: 'text.secondary' }}>{description}</Box>}
          </Box>
        )}
        {hint != null && <FormHelperText error={error} sx={{ mt: pt.spacing.xs }}>{hint}</FormHelperText>}
        {files && files.length > 0 && (
          <Box sx={{ mt: '16px' }}>
            <UploadFileList files={files} variant={fileListVariant} disabled={disabled} onDelete={handleDelete} onCancel={handleCancel} onView={handleView} onDownload={handleDownload} onRename={handleRename} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
