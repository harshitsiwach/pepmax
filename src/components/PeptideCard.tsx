import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Peptide } from '../types';
import { useUserStore } from '../store/useUserStore';
import { colors, borderRadius, spacing, typography } from '../utils/theme';
import { getSafetyRatingLabel, getSafetyRatingColor } from '../utils/db';
import { isPeptideLegalInCountry, getLegalStatusLabel, getLegalStatusColor } from '../utils/legalFilter';

interface Props {
  peptide: Peptide;
  onPress: () => void;
}

export function PeptideCard({ peptide, onPress }: Props) {
  const { gender, country, darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const dosage = gender === 'male' ? peptide.dosage.male : peptide.dosage.female;
  const safetyLabel = getSafetyRatingLabel(peptide.safety_rating);
  const safetyColor = getSafetyRatingColor(peptide.safety_rating);
  const legalStatus = isPeptideLegalInCountry(peptide, country);
  const legalColor = getLegalStatusColor(legalStatus);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: c.text }]}>{peptide.name}</Text>
        <View style={[styles.safetyBadge, { backgroundColor: safetyColor + '20' }]}>
          <Text style={[styles.safetyText, { color: safetyColor }]}>{safetyLabel}</Text>
        </View>
      </View>

      <Text style={[styles.tldr, { color: c.textMuted }]} numberOfLines={2}>
        {peptide.tldr}
      </Text>

      <View style={styles.footer}>
        <View style={styles.doseInfo}>
          <Text style={[styles.doseLabel, { color: c.textMuted }]}>DOSE</Text>
          <Text style={[styles.doseValue, { color: c.primary }]}>
            {dosage.beginner}-{dosage.advanced} mcg
          </Text>
        </View>

        <View style={[styles.legalBadge, { backgroundColor: legalColor + '20' }]}>
          <Text style={[styles.legalText, { color: legalColor }]}>
            {getLegalStatusLabel(legalStatus)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  safetyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  safetyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tldr: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  doseLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  doseValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  legalBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  legalText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});