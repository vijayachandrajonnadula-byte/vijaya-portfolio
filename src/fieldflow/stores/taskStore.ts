import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus, EvidenceRecord, MaterialUsed, TaskNote, Signature, ChecklistItemData } from '../types';
import { mockTasks } from '../data';

interface TaskState {
  tasks: Task[];
  evidence: EvidenceRecord[];
  materials: MaterialUsed[];
  notes: TaskNote[];
  signatures: Record<string, Signature>;
  isLoading: boolean;

  // Task actions
  updateTaskStatus: (taskId: string, status: TaskStatus, extra?: Partial<Task>) => void;
  acceptTask: (taskId: string) => void;
  startJourney: (taskId: string) => void;
  checkIn: (taskId: string) => void;
  startWork: (taskId: string) => void;
  pauseTask: (taskId: string, reason: string, note: string, estimatedResume?: string) => void;
  resumeTask: (taskId: string) => void;
  submitTask: (taskId: string) => void;
  rejectAndReopen: (taskId: string) => void;

  // Checklist
  updateChecklistItem: (taskId: string, sectionId: string, itemId: string, data: Partial<ChecklistItemData>) => void;

  // Evidence
  addEvidence: (evidence: EvidenceRecord) => void;
  removeEvidence: (evidenceId: string) => void;
  updateEvidence: (evidenceId: string, data: Partial<EvidenceRecord>) => void;

  // Materials
  addMaterial: (material: MaterialUsed) => void;
  removeMaterial: (materialId: string) => void;
  updateMaterial: (materialId: string, data: Partial<MaterialUsed>) => void;

  // Notes
  addNote: (note: TaskNote) => void;
  removeNote: (noteId: string) => void;
  updateNote: (noteId: string, content: string) => void;

  // Signature
  saveSignature: (taskId: string, sig: Signature) => void;

  // Supervisor simulation
  supervisorApprove: (taskId: string) => void;
  supervisorReject: (taskId: string, comment: string) => void;
  addUrgentTask: () => void;

  getTask: (id: string) => Task | undefined;
  getTodayTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

const todayBoundary = () => {
  const s = new Date(); s.setHours(0, 0, 0, 0);
  const e = new Date(); e.setHours(23, 59, 59, 999);
  return { start: s, end: e };
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      evidence: [],
      materials: [],
      notes: [],
      signatures: {},
      isLoading: false,

      getTask: (id) => get().tasks.find((t) => t.id === id),

      getTodayTasks: () => {
        const { start, end } = todayBoundary();
        return get().tasks.filter((t) => {
          const d = new Date(t.scheduledStart);
          return d >= start && d <= end;
        });
      },

      getUpcomingTasks: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return get().tasks.filter((t) => {
          const d = new Date(t.scheduledStart);
          return d >= tomorrow && !['completed', 'submitted', 'approved'].includes(t.status);
        });
      },

      getCompletedTasks: () =>
        get().tasks.filter((t) =>
          ['completed', 'submitted', 'approved', 'rejected'].includes(t.status)
        ),

      updateTaskStatus: (taskId, status, extra = {}) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status, syncStatus: 'pending', ...extra } : t
          ),
        })),

      acceptTask: (taskId) =>
        get().updateTaskStatus(taskId, 'accepted'),

      startJourney: (taskId) =>
        get().updateTaskStatus(taskId, 'en_route'),

      checkIn: (taskId) =>
        get().updateTaskStatus(taskId, 'arrived', {
          checkInTime: new Date().toISOString(),
        }),

      startWork: (taskId) =>
        get().updateTaskStatus(taskId, 'in_progress', {
          actualStart: new Date().toISOString(),
        }),

      pauseTask: (taskId, reason, note, estimatedResume) =>
        get().updateTaskStatus(taskId, 'paused', {
          pauseReason: reason,
          pauseNote: note,
          pausedAt: new Date().toISOString(),
          estimatedResumeTime: estimatedResume,
        }),

      resumeTask: (taskId) =>
        get().updateTaskStatus(taskId, 'in_progress', {
          pauseReason: undefined,
          pauseNote: undefined,
          pausedAt: undefined,
        }),

      submitTask: (taskId) =>
        get().updateTaskStatus(taskId, 'submitted', {
          actualEnd: new Date().toISOString(),
          checkOutTime: new Date().toISOString(),
        }),

      rejectAndReopen: (taskId) =>
        get().updateTaskStatus(taskId, 'in_progress', {
          supervisorComment: undefined,
        }),

      updateChecklistItem: (taskId, sectionId, itemId, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              syncStatus: 'pending',
              checklists: t.checklists.map((s) => {
                if (s.id !== sectionId) return s;
                return {
                  ...s,
                  items: s.items.map((i) =>
                    i.id === itemId ? { ...i, ...data } : i
                  ),
                };
              }),
            };
          }),
        })),

      addEvidence: (ev) =>
        set((state) => ({ evidence: [...state.evidence, ev] })),

      removeEvidence: (id) =>
        set((state) => ({ evidence: state.evidence.filter((e) => e.id !== id) })),

      updateEvidence: (id, data) =>
        set((state) => ({
          evidence: state.evidence.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      addMaterial: (mat) =>
        set((state) => ({ materials: [...state.materials, mat] })),

      removeMaterial: (id) =>
        set((state) => ({ materials: state.materials.filter((m) => m.id !== id) })),

      updateMaterial: (id, data) =>
        set((state) => ({
          materials: state.materials.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),

      addNote: (note) =>
        set((state) => ({ notes: [...state.notes, note] })),

      removeNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),

      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
          ),
        })),

      saveSignature: (taskId, sig) =>
        set((state) => ({ signatures: { ...state.signatures, [taskId]: sig } })),

      supervisorApprove: (taskId) =>
        get().updateTaskStatus(taskId, 'approved'),

      supervisorReject: (taskId, comment) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: 'rejected', supervisorComment: comment, syncStatus: 'synced' }
              : t
          ),
        })),

      addUrgentTask: () => {
        const urgent: Task = {
          id: `task-urgent-${Date.now()}`,
          workOrderNumber: `WO-URGENT-${Math.floor(Math.random() * 9000) + 1000}`,
          title: 'URGENT: Electrical Fault – Server Room',
          description: 'Critical electrical fault detected in main server room. Power fluctuations causing system instability.',
          scopeOfWork: 'Identify fault source, isolate affected circuit, repair and verify.',
          serviceCategory: 'Electrical Repair',
          status: 'assigned',
          priority: 'critical',
          customerId: 'cust-002',
          scheduledStart: new Date().toISOString(),
          scheduledEnd: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 180,
          address: { line1: '7 Millennium Court', city: 'Macquarie Park', state: 'NSW', postcode: '2113', lat: -33.7781, lng: 151.1242 },
          distanceKm: 8.7,
          equipment: [],
          requiredParts: [],
          attachments: [],
          checklists: [],
          safetyNotes: ['High-voltage area. Authorised personnel only.'],
          requiredPPE: ['Arc flash PPE', 'Insulated gloves', 'Safety glasses'],
          siteRisks: ['High-voltage', 'Live systems'],
          requiresEvidence: true,
          requiresSignature: true,
          syncStatus: 'synced',
          isDownloaded: true,
          tags: ['Urgent', 'Electrical', 'Critical'],
        };
        set((state) => ({ tasks: [urgent, ...state.tasks] }));
      },
    }),
    {
      name: 'fieldflow-tasks',
      partialize: (state) => ({
        tasks: state.tasks,
        evidence: state.evidence,
        materials: state.materials,
        notes: state.notes,
        signatures: state.signatures,
      }),
    }
  )
);
