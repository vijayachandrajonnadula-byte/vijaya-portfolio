import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Technician } from '../types';
import { mockTechnician } from '../data';

interface AuthState {
  isAuthenticated: boolean;
  technician: Technician | null;
  isLoading: boolean;
  error: string | null;
  rememberDevice: boolean;
  login: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;
  setRememberDevice: (v: boolean) => void;
  clearError: () => void;
  updateShiftStatus: (status: Technician['shiftStatus']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      technician: null,
      isLoading: false,
      error: null,
      rememberDevice: false,

      login: async (employeeId, password) => {
        set({ isLoading: true, error: null });
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 1200));
        if (
          (employeeId === 'FF-1042' || employeeId === 'arjun.mehta@fieldflow.io') &&
          password === 'demo123'
        ) {
          set({
            isAuthenticated: true,
            technician: mockTechnician,
            isLoading: false,
            error: null,
          });
          return true;
        }
        set({
          isLoading: false,
          error: 'Invalid employee ID or password. Try FF-1042 / demo123.',
        });
        return false;
      },

      logout: () =>
        set({ isAuthenticated: false, technician: null, error: null }),

      setRememberDevice: (v) => set({ rememberDevice: v }),

      clearError: () => set({ error: null }),

      updateShiftStatus: (status) =>
        set((state) =>
          state.technician
            ? {
                technician: {
                  ...state.technician,
                  shiftStatus: status,
                  shiftStart:
                    status === 'on_shift'
                      ? new Date().toISOString()
                      : state.technician.shiftStart,
                },
              }
            : {}
        ),
    }),
    {
      name: 'fieldflow-auth',
      partialize: (state) => ({
        isAuthenticated: state.rememberDevice ? state.isAuthenticated : false,
        technician: state.rememberDevice ? state.technician : null,
        rememberDevice: state.rememberDevice,
      }),
    }
  )
);
