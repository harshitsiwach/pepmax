import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../store/useUserStore';
import { useCycleStore } from '../store/useCycleStore';
import { GenderToggle } from '../components/GenderToggle';
import { GoalCard } from '../components/GoalCard';
import { CycleTimeline } from '../components/CycleTimeline';
import { colors, spacing, typography } from '../utils/theme';
import { getGoals, getMVPPeptides } from '../utils/db';
import { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { darkMode, hasAcceptedDisclaimer, hasPassedAgeGate } = useUserStore();
  const { activeCycle } = useCycleStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const goals = getGoals();

  const handleGoalPress = (goalId: string) => {
    navigation.navigate('Encyclopedia', { state: { goalId } });
  };

  const handleBrowseAll = () => {
    navigation.navigate('Encyclopedia');
  };

  if (!hasPassedAgeGate || !hasAcceptedDisclaimer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerTitle, { color: c.text }]}>RESEARCH USE ONLY</Text>
          <Text style={[styles.disclaimerText, { color: c.textMuted }]}>
            This app contains information about research chemicals. Not medical advice.
            Consult a healthcare professional before use.
          </Text>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: c.primary }]}
            onPress={() => {
              useUserStore.getState().passAgeGate();
              useUserStore.getState().acceptDisclaimer();
            }}
          >
            <Text style={styles.acceptButtonText}>I AGREE - I AM 21+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: c.primary }]}>PEPMAX</Text>
          <Text style={[styles.tagline, { color: c.textMuted }]}>Maxxing your peptides</Text>
        </View>

        <View style={styles.genderToggle}>
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>YOUR PROFILE</Text>
          <GenderToggle />
        </View>

        {activeCycle && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: c.textMuted }]}>ACTIVE CYCLE</Text>
            <CycleTimeline cycle={activeCycle} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>What's your goal?</Text>
          <View style={styles.goalsGrid}>
            {goals.slice(0, 4).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => handleGoalPress(goal.id)}
              />
            ))}
          </View>
          <View style={styles.goalsGrid}>
            {goals.slice(4).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => handleGoalPress(goal.id)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.browseButton, { borderColor: c.border }]}
          onPress={handleBrowseAll}
        >
          <Text style={[styles.browseText, { color: c.text }]}>Browse All Peptides</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.md,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  genderToggle: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  },
  goalsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  browseButton: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  browseText: {
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    alignItems: 'center',
  },
  disclaimerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  acceptButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});