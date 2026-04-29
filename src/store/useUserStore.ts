import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gender, UnitSystem } from '../types';

interface UserState {
  gender: Gender;
  weight: number;
  unitSystem: UnitSystem;
  country: string;
  hasAcceptedDisclaimer: boolean;
  hasPassedAgeGate: boolean;
  notifications: boolean;
  darkMode: boolean;
  isLoading: boolean;
  setGender: (gender: Gender) => void;
  setWeight: (weight: number) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  setCountry: (country: string) => void;
  acceptDisclaimer: () => void;
  passAgeGate: () => void;
  setNotifications: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  loadFromStorage: () => Promise<void>;
}

const STORAGE_KEY = '@pepmax_user';

export const useUserStore = create<UserState>((set, get) => ({
  gender: 'male',
  weight: 70,
  unitSystem: 'metric',
  country: 'US',
  hasAcceptedDisclaimer: false,
  hasPassedAgeGate: false,
  notifications: true,
  darkMode: true,
  isLoading: true,

  setGender: (gender) => {
    set({ gender });
    get().saveToStorage();
  },

  setWeight: (weight) => {
    set({ weight });
    get().saveToStorage();
  },

  setUnitSystem: (unitSystem) => {
    set({ unitSystem });
    get().saveToStorage();
  },

  setCountry: (country) => {
    set({ country });
    get().saveToStorage();
  },

  acceptDisclaimer: () => {
    set({ hasAcceptedDisclaimer: true });
    get().saveToStorage();
  },

  passAgeGate: () => {
    set({ hasPassedAgeGate: true });
    get().saveToStorage();
  },

  setNotifications: (notifications) => {
    set({ notifications });
    get().saveToStorage();
  },

  setDarkMode: (darkMode) => {
    set({ darkMode });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({ ...parsed, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load user settings:', e);
      set({ isLoading: false });
    }
  },

  saveToStorage: async () => {
    try {
      const { isLoading, saveToStorage, loadFromStorage, ...data } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save user settings:', e);
    }
  },
}));