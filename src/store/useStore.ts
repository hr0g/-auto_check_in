import { create } from 'zustand';

export interface LocationRecord {
  id: string;
  name: string;
  lat: number;
  lng: number;
  savedAt: number;
}

export interface MacroRecord {
  id: string;
  name: string;
  description: string;
  durationMs: number;
  savedAt: number;
}

export interface ScheduledTask {
  id: string;
  name: string;
  locationId: string;
  macroId: string;
  startTime: number;
  endTime: number; // For virtual location effective time
  isActive: boolean;
}

interface AppState {
  locations: LocationRecord[];
  macros: MacroRecord[];
  tasks: ScheduledTask[];
  
  activeLocationId: string | null;
  activeMacroId: string | null;
  isFloatingMode: boolean;
  
  addLocation: (loc: LocationRecord) => void;
  removeLocation: (id: string) => void;
  addMacro: (mac: MacroRecord) => void;
  removeMacro: (id: string) => void;
  addTask: (task: ScheduledTask) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  
  setActiveLocation: (id: string | null) => void;
  setActiveMacro: (id: string | null) => void;
  setFloatingMode: (isActive: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  locations: [
    { id: '1', name: 'Alibaba Xixi Campus', lat: 30.2674, lng: 120.0243, savedAt: Date.now() },
    { id: '2', name: 'Tencent Binhai', lat: 22.5229, lng: 113.9358, savedAt: Date.now() }
  ],
  macros: [
    { id: '1', name: 'Auto Check-in', description: 'Opens DingTalk, clicks check-in, closes app.', durationMs: 4500, savedAt: Date.now() },
    { id: '2', name: 'Game Resource Farm', description: 'Repeatedly taps harvest coordinates.', durationMs: 30000, savedAt: Date.now() }
  ],
  tasks: [],
  
  activeLocationId: null,
  activeMacroId: null,
  isFloatingMode: false,
  
  addLocation: (loc) => set((state) => ({ locations: [...state.locations, loc] })),
  removeLocation: (id) => set((state) => ({ locations: state.locations.filter((l) => l.id !== id) })),
  
  addMacro: (mac) => set((state) => ({ macros: [...state.macros, mac] })),
  removeMacro: (id) => set((state) => ({ macros: state.macros.filter((m) => m.id !== id) })),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
  })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  
  setActiveLocation: (id) => set({ activeLocationId: id }),
  setActiveMacro: (id) => set({ activeMacroId: id }),
  setFloatingMode: (isActive) => set({ isFloatingMode: isActive })
}));
