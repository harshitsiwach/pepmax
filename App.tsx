import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useUserStore } from './src/store/useUserStore';
import { useCycleStore } from './src/store/useCycleStore';
import { useLogStore } from './src/store/useLogStore';

export default function App() {
  const loadUserStore = useUserStore((state) => state.loadFromStorage);
  const loadCycleStore = useCycleStore((state) => state.loadFromStorage);
  const loadLogStore = useLogStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadUserStore();
    loadCycleStore();
    loadLogStore();
  }, []);

  const darkMode = useUserStore((state) => state.darkMode);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}