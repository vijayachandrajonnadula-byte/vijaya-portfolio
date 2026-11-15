import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FileUploader } from './FileUploader';
import type { UploadFile } from './FileUploader';
import { UploadFileList } from './UploadFileList';

const Label = ({ children }: { children: string }) => <Typography variant="textM" color="text.secondary">{children}</Typography>;

const sample: UploadFile[] = [
  { id: 1, name: 'Batch record 2026.pdf', size: 2_400_000, type: 'application/pdf', description: 'Uploaded today', status: 'uploaded' },
  { id: 2, name: 'Deviation report.docx', size: 480_000, type: 'application/msword', status: 'uploaded' },
  { id: 3, name: 'Line clearance.png', size: 920_000, type: 'image/png', status: 'uploading', progress: 50 },
  { id: 4, name: 'Calibration.xlsx', size: 51_000_000, status: 'error', error: 'File is larger than 50 MB' },
  { id: 5, name: 'Walkthrough.mov', size: 12_000_000, type: 'video/quicktime', status: 'uploaded' },
];

/** FileUploader: drop zone states (default / hover / drag / disabled), label top / left, list / thumbnail lists, progress, error, rename. */
export default function FileUploaderDemo() {
  const [files, setFiles] = useState<UploadFile[]>(sample);
  return (
    <Stack spacing={3} sx={{ maxWidth: 640 }}>
      <Label>Default (try dropping a file)</Label>
      <FileUploader label="Upload" description="PDF - DOC - DOCX - Max 512 MB" handleTakePhoto={() => {}} handleScreenshot={() => {}} handleFileSelect={(f) => setFiles((p) => [...p, ...f.map((x, i) => ({ id: `${Date.now()}${i}`, name: x.name, size: x.size, type: x.type, status: 'uploaded' as const }))])} files={files} handleDelete={(f) => setFiles((p) => p.filter((x) => x.id !== f.id))} handleCancel={(f) => setFiles((p) => p.filter((x) => x.id !== f.id))} handleView={() => {}} handleDownload={() => {}} handleRename={(f, n) => setFiles((p) => p.map((x) => (x.id === f.id ? { ...x, name: n } : x)))} />
      <Label>Hover / Drag / Disabled</Label>
      <FileUploader forceState="hover" description="Hover" />
      <FileUploader forceState="drag" description="Drag" />
      <FileUploader disabled description="Disabled" />
      <Label>Label left, with hint and error</Label>
      <FileUploader label="Attachment" labelPosition="left" required hint="At least one file is required" error />
      <Label>Button variant</Label>
      <FileUploader label="Attach" variant="button" description="Max 10 MB" buttonLabel="Choose file" />
      <Label>Thumbnail list</Label>
      <UploadFileList variant="thumbnail" files={sample} onDelete={() => {}} onCancel={() => {}} onView={() => {}} />
      <Label>Rename row</Label>
      <UploadFileList files={sample.slice(0, 1)} renamingId={1} onRename={() => {}} />
    </Stack>
  );
}
