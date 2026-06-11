import { create } from 'zustand';

interface DemoState {
  showDemoControls: boolean;
  locationSimulation: 'none' | 'near_site' | 'outside_site';
  toggleDemoControls: () => void;
  setLocationSimulation: (v: DemoState['locationSimulation']) => void;
}

export const useDemoStore = create<DemoState>()((set) => ({
  showDemoControls: true,
  locationSimulation: 'near_site',
  toggleDemoControls: () => set((s) => ({ showDemoControls: !s.showDemoControls })),
  setLocationSimulation: (v) => set({ locationSimulation: v }),
}));
