import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyLog, LogEntry } from '../types';

interface LogState {
  logs: DailyLog[];
  isLoading: boolean;
  addLog: (log: DailyLog) => void;
  updateLog: (date: string, updates: Partial<DailyLog>) => void;
  getLogForDate: (date: string) => DailyLog | undefined;
  addEntry: (date: string, entry: LogEntry) => void;
  loadFromStorage: () => Promise<void>;
}

const STORAGE_KEY = '@pepmax_logs';

export const useLogStore = create<LogState>((set, get) => ({
  logs: [],
  isLoading: true,

  addLog: (log) => {
    set((state) => {
      const existing = state.logs.findIndex((l) => l.date === log.date);
      if (existing >= 0) {
        const newLogs = [...state.logs];
        newLogs[existing] = log;
        return { logs: newLogs };
      }
      return { logs: [...state.logs, log] };
    });
    get().saveToStorage();
  },

  updateLog: (date, updates) => {
    set((state) => ({
      logs: state.logs.map((l) => 
        l.date === date ? { ...l, ...updates } : l
      ),
    }));
    get().saveToStorage();
  },

  getLogForDate: (date) => {
    return get().logs.find((l) => l.date === date);
  },

  addEntry: (date, entry) => {
    set((state) => {
      const existing = state.logs.findIndex((l) => l.date === date);
      if (existing >= 0) {
        const newLogs = [...state.logs];
        newLogs[existing] = {
          ...newLogs[existing],
          entries: [...newLogs[existing].entries, entry],
        };
        return { logs: newLogs };
      }
      return {
        logs: [
          ...state.logs,
          { id: date, date, entries: [entry] },
        ],
      };
    });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({ logs: parsed.logs || [], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load logs:', e);
      set({ isLoading: false });
    }
  },

  saveToStorage: async () => {
    try {
      const { isLoading, loadFromStorage, ...data } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save logs:', e);
    }
  },
}));