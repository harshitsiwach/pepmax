import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { colors, borderRadius, spacing, glassStyle } from '../utils/theme';
import { Gender } from '../types';

export function GenderToggle() {
  const { gender, setGender, darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const options: { value: Gender; label: string }[] = [
    { value: 'male', label: 'MALE' },
    { value: 'female', label: 'FEMALE' },
    { value: 'other', label: 'OTHER' },
  ];

  return (
    <View style={[glassStyle[darkMode ? 'dark' : 'light'], styles.container]}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.option,
            {
              backgroundColor: gender === opt.value ? c.primary : 'transparent',
              borderColor: c.border,
            },
          ]}
          onPress={() => setGender(opt.value)}
        >
          <Text
            style={[
              styles.label,
              { color: gender === opt.value ? '#FFFFFF' : c.textMuted },
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});