import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useUserStore } from '../store/useUserStore';
import { GenderToggle } from '../components/GenderToggle';
import { DoseDisplay } from '../components/DoseDisplay';
import { colors, spacing, borderRadius } from '../utils/theme';
import { getPeptideById, getSafetyRatingColor, getSafetyRatingLabel } from '../utils/db';
import { isPeptideLegalInCountry, getLegalStatusLabel, getLegalStatusColor } from '../utils/legalFilter';
import { RootStackParamList } from '../navigation/types';
import { ExperienceLevel } from '../types';

type DetailRouteProp = RouteProp<RootStackParamList, 'PeptideDetail'>;

export function PeptideDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { peptideId } = route.params;
  const { gender, country, darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const peptide = getPeptideById(peptideId);

  if (!peptide) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
        <Text style={[styles.errorText, { color: c.error }]}>Peptide not found</Text>
      </SafeAreaView>
    );
  }

  const safetyColor = getSafetyRatingColor(peptide.safety_rating);
  const safetyLabel = getSafetyRatingLabel(peptide.safety_rating);
  const legalStatus = isPeptideLegalInCountry(peptide, country);
  const legalColor = getLegalStatusColor(legalStatus);
  const dosage = gender === 'male' ? peptide.dosage.male : peptide.dosage.female;

  const handleCalculate = () => {
    navigation.navigate('Calculator', { peptideId: peptide.name });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: c.text }]}>{peptide.name}</Text>
          {peptide.full_name && (
            <Text style={[styles.fullName, { color: c.textMuted }]}>{peptide.full_name}</Text>
          )}
          
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: safetyColor + '20' }]}>
              <Text style={[styles.badgeText, { color: safetyColor }]}>{safetyLabel}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: legalColor + '20' }]}>
              <Text style={[styles.badgeText, { color: legalColor }]}>{getLegalStatusLabel(legalStatus)}</Text>
            </View>
            {peptide.requires_prescription && (
              <View style={[styles.badge, { backgroundColor: c.warning + '20' }]}>
                <Text style={[styles.badgeText, { color: c.warning }]}>Rx</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>TL;DR</Text>
          <Text style={[styles.tldrText, { color: c.textMuted }]}>{peptide.tldr}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: c.textMuted }]}>CATEGORY</Text>
              <Text style={[styles.statValue, { color: c.text }]}>{peptide.category}</Text>
            </View>
            {peptide.half_life && (
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: c.textMuted }]}>HALF-LIFE</Text>
                <Text style={[styles.statValue, { color: c.text }]}>{peptide.half_life}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>YOUR PROFILE</Text>
          <GenderToggle />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>DOSAGE</Text>
          <DoseDisplay peptide={peptide} level="intermediate" />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>MECHANISM</Text>
          <Text style={[styles.bodyText, { color: c.textMuted }]}>{peptide.mechanism}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>BENEFITS</Text>
          {peptide.benefits.map((benefit, idx) => (
            <View key={idx} style={[styles.benefitItem, { borderColor: c.border }]}>
              <View style={styles.benefitHeader}>
                <Text style={[styles.benefitText, { color: c.text }]}>{benefit.benefit}</Text>
                <View style={[styles.evidenceBadge, { 
                  backgroundColor: benefit.evidence === 'high' ? c.success + '20' : c.warning + '20'
                }]}>
                  <Text style={[styles.evidenceText, { 
                    color: benefit.evidence === 'high' ? c.success : c.warning 
                  }]}>
                    {benefit.evidence.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>ADMINISTRATION</Text>
          {peptide.administration.map((admin, idx) => (
            <View key={idx} style={[styles.adminItem, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[styles.adminLabel, { color: c.textMuted }]}>ROUTE</Text>
              <Text style={[styles.adminValue, { color: c.text }]}>{admin.route}</Text>
              <Text style={[styles.adminLabel, { color: c.textMuted, marginTop: spacing.sm }]}>STORAGE</Text>
              <Text style={[styles.adminValue, { color: c.text }]}>{admin.storage}</Text>
              {admin.reconstitution && (
                <>
                  <Text style={[styles.adminLabel, { color: c.textMuted, marginTop: spacing.sm }]}>MIXING</Text>
                  <Text style={[styles.adminValue, { color: c.text }]}>{admin.reconstitution}</Text>
                </>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>SIDE EFFECTS</Text>
          {peptide.side_effects.map((se, idx) => (
            <View key={idx} style={[styles.seItem, { borderColor: c.border }]}>
              <View style={styles.seHeader}>
                <Text style={[styles.seText, { color: c.text }]}>{se.effect}</Text>
                <View style={[styles.severityBadge, {
                  backgroundColor: se.severity === 'serious' ? c.error + '20' : 
                    se.severity === 'rare' ? c.warning + '20' : c.success + '20'
                }]}>
                  <Text style={[styles.severityText, {
                    color: se.severity === 'serious' ? c.error : 
                      se.severity === 'rare' ? c.warning : c.success
                  }]}>
                    {se.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              {se.frequency && (
                <Text style={[styles.seFreq, { color: c.textMuted }]}>{se.frequency}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>CYCLE PROTOCOL</Text>
          <View style={[styles.cycleCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={styles.cycleRow}>
              <Text style={[styles.cycleLabel, { color: c.textMuted }]}>RECOMMENDED</Text>
              <Text style={[styles.cycleValue, { color: c.text }]}>{peptide.cycle.recommended_length_weeks} weeks</Text>
            </View>
            <View style={[styles.cycleDivider, { backgroundColor: c.border }]} />
            <View style={styles.cycleRow}>
              <Text style={[styles.cycleLabel, { color: c.textMuted }]}>MINIMUM BREAK</Text>
              <Text style={[styles.cycleValue, { color: c.text }]}>{peptide.cycle.min_break_weeks} weeks</Text>
            </View>
          </View>
        </View>

        {peptide.contraindications && peptide.contraindications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.error }]}>CONTRAINDICATIONS</Text>
            <View style={[styles.contraCard, { backgroundColor: c.error + '10', borderColor: c.error }]}>
              {peptide.contraindications.map((item, idx) => (
                <Text key={idx} style={[styles.contraItem, { color: c.text }]}>• {item}</Text>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: c.primary }]}
          onPress={handleCalculate}
        >
          <Text style={styles.calculateButtonText}>CALCULATE MY DOSE</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: c.textMuted }]}>
            {peptide.last_updated ? `Data updated: ${peptide.last_updated}. ` : ''}
            For research purposes only. Not medical advice.
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
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  fullName: {
    fontSize: 14,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tldrText: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  stat: {},
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  benefitItem: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  benefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  evidenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  evidenceText: {
    fontSize: 10,
    fontWeight: '700',
  },
  adminItem: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  adminLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  adminValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  seItem: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  seHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seText: {
    fontSize: 14,
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  seFreq: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  cycleCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  cycleLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cycleValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  cycleDivider: {
    height: 1,
  },
  contraCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  contraItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  calculateButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  disclaimer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    padding: spacing.md,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});