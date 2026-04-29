import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Peptide, ExperienceLevel } from '../types';
import { useUserStore } from '../store/useUserStore';
import { colors, borderRadius, spacing } from '../utils/theme';
import { calculateDose, getFemaleDose } from '../utils/peptideCalculations';

interface Props {
  peptide: Peptide;
  level: ExperienceLevel;
}

export function DoseDisplay({ peptide, level }: Props) {
  const { gender, weight, darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const maleDose = calculateDose(peptide, 'male', weight, level);
  const femaleDose = calculateDose(peptide, gender === 'other' ? 'female' : gender, weight, level);

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: c.textMuted }]}>BEGINNER</Text>
        <Text style={[styles.dose, { color: c.text }]}>
          {calculateDose(peptide, 'male', weight, 'beginner').dose} mcg
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: c.border }]} />
      <View style={styles.row}>
        <Text style={[styles.label, { color: c.textMuted }]}>INTERMEDIATE</Text>
        <Text style={[styles.dose, { color: c.text }]}>
          {calculateDose(peptide, 'male', weight, 'intermediate').dose} mcg
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: c.border }]} />
      <View style={styles.row}>
        <Text style={[styles.label, { color: c.textMuted }]}>ADVANCED</Text>
        <Text style={[styles.dose, { color: c.text }]}>
          {calculateDose(peptide, 'male', weight, 'advanced').dose} mcg
        </Text>
      </View>

      {gender !== 'male' && (
        <>
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <View style={[styles.femaleSection, { backgroundColor: c.primary + '10' }]}>
            <Text style={[styles.femaleLabel, { color: c.primary }]}>
              FEMALE ({peptide.dosage.female_dose_multiplier * 100}% of male)
            </Text>
            <Text style={[styles.femaleDose, { color: c.primary }]}>
              {femaleDose.dose} mcg
            </Text>
          </View>
        </>
      )}

      <View style={[styles.timing, { backgroundColor: c.surfaceElevated }]}>
        <Text style={[styles.timingLabel, { color: c.textMuted }]}>TIMING</Text>
        <Text style={[styles.timingText, { color: c.text }]}>
          {peptide.dosage.male.timing[0]?.time || 'Once daily'}
        </Text>
        <Text style={[styles.timingDesc, { color: c.textMuted }]}>
          {peptide.dosage.male.timing[0]?.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dose: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
  },
  femaleSection: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  femaleLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  femaleDose: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  timing: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  timingLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  timingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});