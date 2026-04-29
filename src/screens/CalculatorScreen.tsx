import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useUserStore } from '../store/useUserStore';
import { colors, spacing, borderRadius } from '../utils/theme';
import { getAllPeptides } from '../utils/db';
import { calculateDose, formatDose } from '../utils/peptideCalculations';
import { ExperienceLevel, Peptide } from '../types';
import { RootStackParamList } from '../navigation/types';

type CalcRouteProp = RouteProp<RootStackParamList, 'Calculator'>;

export function CalculatorScreen() {
  const route = useRoute<CalcRouteProp>();
  const navigation = useNavigation();
  const { gender, weight, unitSystem, setWeight, setUnitSystem, darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const peptides = getAllPeptides();
  
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(
    route.params?.peptideId 
      ? peptides.find(p => p.name === route.params.peptideId) || null 
      : null
  );
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [customWeight, setCustomWeight] = useState(weight.toString());

  const calculatedDose = useMemo(() => {
    if (!selectedPeptide) return null;
    const w = parseFloat(customWeight) || weight;
    return calculateDose(selectedPeptide, gender, w, level);
  }, [selectedPeptide, gender, customWeight, weight, level]);

  const levels: { value: ExperienceLevel; label: string }[] = [
    { value: 'beginner', label: 'BEGINNER' },
    { value: 'intermediate', label: 'INTERMEDIATE' },
    { value: 'advanced', label: 'ADVANCED' },
  ];

  const handleUnitToggle = () => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(newSystem);
    // Convert weight
    if (newSystem === 'imperial') {
      setCustomWeight(Math.round(weight * 2.205).toString());
    } else {
      setCustomWeight(Math.round(parseFloat(customWeight) / 2.205).toString());
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>Dose Calculator</Text>
          <Text style={[styles.subtitle, { color: c.textMuted }]}>
            Personalized dosing based on your profile
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>SELECT PEPTIDE</Text>
          <View style={styles.peptideList}>
            {peptides.map((p) => (
              <TouchableOpacity
                key={p.name}
                style={[
                  styles.peptideChip,
                  {
                    backgroundColor: selectedPeptide?.name === p.name ? c.primary : c.surface,
                    borderColor: c.border,
                  },
                ]}
                onPress={() => setSelectedPeptide(p)}
              >
                <Text
                  style={[
                    styles.peptideChipText,
                    { color: selectedPeptide?.name === p.name ? '#FFFFFF' : c.text },
                  ]}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>YOUR WEIGHT</Text>
          <View style={styles.weightRow}>
            <TextInput
              style={[
                styles.weightInput,
                { backgroundColor: c.surface, borderColor: c.border, color: c.text },
              ]}
              value={customWeight}
              onChangeText={setCustomWeight}
              keyboardType="numeric"
              placeholder="70"
              placeholderTextColor={c.textMuted}
            />
            <TouchableOpacity
              style={[styles.unitToggle, { backgroundColor: c.surface, borderColor: c.border }]}
              onPress={handleUnitToggle}
            >
              <Text style={[styles.unitToggleText, { color: c.text }]}>
                {unitSystem === 'metric' ? 'kg' : 'lbs'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>EXPERIENCE LEVEL</Text>
          <View style={styles.levelRow}>
            {levels.map((l) => (
              <TouchableOpacity
                key={l.value}
                style={[
                  styles.levelButton,
                  {
                    backgroundColor: level === l.value ? c.primary : 'transparent',
                    borderColor: c.border,
                  },
                ]}
                onPress={() => setLevel(l.value)}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    { color: level === l.value ? '#FFFFFF' : c.textMuted },
                  ]}
                >
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {calculatedDose && selectedPeptide && (
          <View style={[styles.resultCard, { backgroundColor: c.surface, borderColor: c.primary }]}>
            <Text style={[styles.resultLabel, { color: c.textMuted }]}>RECOMMENDED DOSE</Text>
            <Text style={[styles.resultDose, { color: c.primary }]}>
              {calculatedDose.dose} {calculatedDose.unit}
            </Text>
            <Text style={[styles.resultPeptide, { color: c.text }]}>
              {selectedPeptide.name} • {gender.toUpperCase()}
            </Text>

            <View style={[styles.timingCard, { backgroundColor: c.surfaceElevated }]}>
              <Text style={[styles.timingTitle, { color: c.text }]}>TIMING</Text>
              {selectedPeptide.dosage.male.timing.map((t, idx) => (
                <View key={idx} style={styles.timingRow}>
                  <Text style={[styles.timingTime, { color: c.primary }]}>{t.time}</Text>
                  <Text style={[styles.timingDesc, { color: c.textMuted }]}>{t.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.frequencyRow}>
              <Text style={[styles.freqLabel, { color: c.textMuted }]}>FREQUENCY</Text>
              <Text style={[styles.freqValue, { color: c.text }]}>
                {selectedPeptide.dosage.male.frequency}
              </Text>
            </View>

            <View style={styles.cycleRow}>
              <Text style={[styles.cycleLabel, { color: c.textMuted }]}>CYCLE</Text>
              <Text style={[styles.cycleValue, { color: c.text }]}>
                {selectedPeptide.cycle.recommended_length_weeks} weeks on, {selectedPeptide.cycle.min_break_weeks} weeks off
              </Text>
            </View>
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: c.textMuted }]}>
            This is a guideline only. Always consult a healthcare professional.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  peptideList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  peptideChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  peptideChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  weightRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  weightInput: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  unitToggle: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    minWidth: 60,
    alignItems: 'center',
  },
  unitToggleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  levelRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  levelButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
  resultDose: {
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  resultPeptide: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  timingCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  timingTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  timingRow: {
    marginBottom: spacing.xs,
  },
  timingTime: {
    fontSize: 14,
    fontWeight: '700',
  },
  timingDesc: {
    fontSize: 12,
  },
  frequencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  freqLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  freqValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cycleLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cycleValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  disclaimer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});