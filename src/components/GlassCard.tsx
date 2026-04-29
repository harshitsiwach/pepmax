import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { glassStyle } from '../utils/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlassCard({ children, style }: Props) {
  const darkMode = useUserStore((state) => state.darkMode);
  
  return (
    <View style={[glassStyle[darkMode ? 'dark' : 'light'], style]}>
      {children}
    </View>
  );
}