import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cycle } from '../types';

interface CycleState {
  cycles: Cycle[];
  activeCycle: Cycle | null;
  isLoading: boolean;
  addCycle: (cycle: Cycle) => void;
  updateCycle: (id: string, updates: Partial<Cycle>) => void;
  deleteCycle: (id: string) => void;
  setActiveCycle: (cycle: Cycle | null) => void;
  endCycle: (id: string) => void;
  loadFromStorage: () => Promise<void>;
}

const STORAGE_KEY = '@pepmax_cycles';

export const useCycleStore = create<CycleState>((set, get) => ({
  cycles: [],
  activeCycle: null,
  isLoading: true,

  addCycle: (cycle) => {
    set((state) => ({ 
      cycles: [...state.cycles, cycle],
      activeCycle: cycle 
    }));
    get().saveToStorage();
  },

  updateCycle: (id, updates) => {
    set((state) => ({
      cycles: state.cycles.map((c) => c.id === id ? { ...c, ...updates } : c),
      activeCycle: state.activeCycle?.id === id 
        ? { ...state.activeCycle, ...updates } 
        : state.activeCycle,
    }));
    get().saveToStorage();
  },

  deleteCycle: (id) => {
    set((state) => ({
      cycles: state.cycles.filter((c) => c.id !== id),
      activeCycle: state.activeCycle?.id === id ? null : state.activeCycle,
    }));
    get().saveToStorage();
  },

  setActiveCycle: (cycle) => {
    set({ activeCycle: cycle });
    get().saveToStorage();
  },

  endCycle: (id) => {
    set((state) => ({
      cycles: state.cycles.map((c) => 
        c.id === id ? { ...c, isActive: false } : c
      ),
      activeCycle: state.activeCycle?.id === id ? null : state.activeCycle,
    }));
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({ 
          cycles: parsed.cycles || [],
          activeCycle: parsed.activeCycle || null,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load cycles:', e);
      set({ isLoading: false });
    }
  },

  saveToStorage: async () => {
    try {
      const { isLoading, loadFromStorage, ...data } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save cycles:', e);
    }
  },
}));