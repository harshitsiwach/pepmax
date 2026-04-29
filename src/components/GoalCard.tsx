import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Goal } from '../types';
import { useUserStore } from '../store/useUserStore';
import { colors, borderRadius, spacing } from '../utils/theme';

interface Props {
  goal: Goal;
  onPress: () => void;
}

export function GoalCard({ goal, onPress }: Props) {
  const { darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{goal.icon}</Text>
      <Text style={[styles.name, { color: c.text }]}>{goal.name}</Text>
      <Text style={[styles.count, { color: c.textMuted }]}>
        {goal.relatedPeptides.length} peptides
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});