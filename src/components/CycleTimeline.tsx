import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cycle } from '../types';
import { useUserStore } from '../store/useUserStore';
import { colors, borderRadius, spacing } from '../utils/theme';
import { getDaysUntilCycleEnd } from '../utils/cycleValidator';
import { format } from 'date-fns';

interface Props {
  cycle: Cycle;
}

export function CycleTimeline({ cycle }: Props) {
  const { darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const daysLeft = getDaysUntilCycleEnd(cycle);
  const progress = Math.max(0, Math.min(1, 1 - daysLeft / cycle.durationWeeks / 7));
  const progressPercent = Math.round(progress * 100);

  const startDate = format(new Date(cycle.startDate), 'MMM d, yyyy');
  const endDate = format(
    new Date(new Date(cycle.startDate).getTime() + cycle.durationWeeks * 7 * 24 * 60 * 60 * 1000),
    'MMM d, yyyy'
  );

  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>{cycle.name}</Text>
        <View style={[styles.badge, { backgroundColor: c.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: c.primary }]}>ACTIVE</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: c.surfaceElevated }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: c.primary, width: `${progressPercent}%` },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: c.textMuted }]}>
          {progressPercent}% complete
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { color: c.textMuted }]}>PEPTIDES</Text>
          <Text style={[styles.detailValue, { color: c.text }]}>
            {cycle.peptides.join(', ')}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { color: c.textMuted }]}>START</Text>
          <Text style={[styles.detailValue, { color: c.text }]}>{startDate}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { color: c.textMuted }]}>END</Text>
          <Text style={[styles.detailValue, { color: c.text }]}>{endDate}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { color: c.textMuted }]}>DAYS LEFT</Text>
          <Text style={[styles.detailValue, { color: daysLeft <= 7 ? c.error : c.text }]}>
            {daysLeft > 0 ? daysLeft : 'Ended'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  details: {
    gap: spacing.sm,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});