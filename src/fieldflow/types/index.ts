// FieldFlow core types

export type TaskStatus =
  | 'assigned'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type SyncStatus = 'synced' | 'pending' | 'failed' | 'syncing';
export type EvidenceType =
  | 'before_work'
  | 'during_work'
  | 'after_work'
  | 'fault'
  | 'asset_label'
  | 'safety_issue'
  | 'customer_property'
  | 'other';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: Address;
  accountNumber: string;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  lastServiced?: string;
}

export interface RequiredPart {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
  unit: string;
  available: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  size: string;
}

export interface ChecklistItemData {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  type: 'check' | 'measurement' | 'photo' | 'text';
  completed: boolean;
  notApplicable: boolean;
  notApplicableReason?: string;
  requiresEvidence: boolean;
  evidenceIds: string[];
  measurement?: { value: string; unit: string };
  note?: string;
  issue?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItemData[];
}

export interface Task {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  scopeOfWork: string;
  serviceCategory: string;
  status: TaskStatus;
  priority: TaskPriority;
  customerId: string;
  scheduledStart: string; // ISO
  scheduledEnd: string;   // ISO
  estimatedDuration: number; // minutes
  actualStart?: string;
  actualEnd?: string;
  checkInTime?: string;
  checkOutTime?: string;
  address: Address;
  distanceKm: number;
  equipment: Equipment[];
  requiredParts: RequiredPart[];
  attachments: Attachment[];
  checklists: ChecklistSection[];
  safetyNotes: string[];
  requiredPPE: string[];
  siteRisks: string[];
  requiresEvidence: boolean;
  requiresSignature: boolean;
  syncStatus: SyncStatus;
  isDownloaded: boolean;
  pauseReason?: string;
  pauseNote?: string;
  pausedAt?: string;
  estimatedResumeTime?: string;
  supervisorComment?: string;
  technician?: string;
  tags: string[];
}

export interface EvidenceRecord {
  id: string;
  taskId: string;
  checklistItemId?: string;
  type: EvidenceType;
  caption: string;
  dataUrl: string; // base64 or object URL
  capturedAt: string;
  locationLabel?: string;
  syncStatus: SyncStatus;
}

export interface MaterialUsed {
  id: string;
  taskId: string;
  partNumber: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  isUnlisted: boolean;
  addedAt: string;
  syncStatus: SyncStatus;
}

export interface TaskNote {
  id: string;
  taskId: string;
  content: string;
  type: 'internal' | 'customer_visible';
  template?: string;
  createdAt: string;
  updatedAt?: string;
  syncStatus: SyncStatus;
  isVoiceNote?: boolean;
  audioDuration?: number;
}

export interface Signature {
  taskId: string;
  customerName: string;
  customerRole: string;
  dataUrl: string;
  capturedAt: string;
  technicianName: string;
  consentGiven: boolean;
  unavailable?: boolean;
  unavailableReason?: string;
  unavailableEvidenceId?: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'task_update' | 'evidence' | 'material' | 'note' | 'checklist' | 'signature' | 'check_in' | 'check_out';
  taskId: string;
  taskTitle: string;
  payload: unknown;
  createdAt: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  errorMessage?: string;
  lastAttemptAt?: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  taskId?: string;
  taskTitle?: string;
  workOrderNumber?: string;
  message: string;
  timestamp: string;
  actor: string;
  syncStatus: SyncStatus;
  read: boolean;
}

export interface Notification {
  id: string;
  type:
    | 'new_assignment'
    | 'critical_assignment'
    | 'schedule_updated'
    | 'task_starts_soon'
    | 'missing_evidence'
    | 'submission_rejected'
    | 'pending_sync'
    | 'shift_ending'
    | 'task_approved';
  title: string;
  body: string;
  taskId?: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
}

export interface Technician {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  team: string;
  region: string;
  skills: string[];
  certifications: string[];
  avatarInitials: string;
  shiftStatus: 'off_shift' | 'on_shift' | 'on_break';
  shiftStart?: string;
  shiftEnd?: string;
}

export interface AssetRecord {
  id: string;
  assetTag: string;
  qrCode: string;
  name: string;
  model: string;
  serialNumber: string;
  location: string;
  lastServiceDate: string;
  nextServiceDate: string;
  status: 'operational' | 'requires_service' | 'out_of_service';
  customerId: string;
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
  simulated: boolean;
}
