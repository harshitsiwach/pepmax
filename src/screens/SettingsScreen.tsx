import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { useCycleStore } from '../store/useCycleStore';
import { useLogStore } from '../store/useLogStore';
import { colors, spacing, borderRadius } from '../utils/theme';
import { Gender, UnitSystem } from '../types';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'EU', name: 'European Union' },
  { code: 'AU', name: 'Australia' },
];

export function SettingsScreen() {
  const {
    gender,
    weight,
    unitSystem,
    country,
    notifications,
    darkMode,
    setGender,
    setWeight,
    setUnitSystem,
    setCountry,
    setNotifications,
    setDarkMode,
    acceptDisclaimer,
    passAgeGate,
    hasAcceptedDisclaimer,
    hasPassedAgeGate,
  } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const [editWeight, setEditWeight] = useState(weight.toString());
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your cycles and logs. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            useCycleStore.getState().cycles = [];
            useCycleStore.getState().activeCycle = null;
            useLogStore.getState().logs = [];
            Alert.alert('Done', 'All data has been reset.');
          },
        },
      ]
    );
  };

  const handleReacceptDisclaimer = () => {
    passAgeGate();
    acceptDisclaimer();
    Alert.alert('Done', 'You can now re-accept the disclaimer.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>PROFILE</Text>

          <View style={[styles.settingItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.settingLabel, { color: c.textMuted }]}>GENDER</Text>
            <View style={styles.genderButtons}>
              {(['male', 'female', 'other'] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    {
                      backgroundColor: gender === g ? c.primary : 'transparent',
                      borderColor: c.border,
                    },
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      { color: gender === g ? '#FFFFFF' : c.text },
                    ]}
                  >
                    {g.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.settingItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.settingLabel, { color: c.textMuted }]}>WEIGHT</Text>
            <View style={styles.weightRow}>
              <TextInput
                style={[
                  styles.weightInput,
                  { backgroundColor: c.surfaceElevated, color: c.text, borderColor: c.border },
                ]}
                value={editWeight}
                onChangeText={setEditWeight}
                onBlur={() => setWeight(parseFloat(editWeight) || 70)}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.unitButton, { borderColor: c.border }]}
                onPress={() =>
                  setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')
                }
              >
                <Text style={[styles.unitButtonText, { color: c.text }]}>
                  {unitSystem === 'metric' ? 'kg' : 'lbs'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.settingLabel, { color: c.textMuted }]}>COUNTRY (for legal filtering)</Text>
            <TouchableOpacity
              style={styles.countrySelector}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Text style={[styles.countrySelected, { color: c.text }]}>
                {COUNTRIES.find((c) => c.code === country)?.name || country}
              </Text>
              <Text style={[styles.chevron, { color: c.textMuted }]}>▼</Text>
            </TouchableOpacity>
            {showCountryPicker && (
              <View style={styles.countryList}>
                {COUNTRIES.map((c) => (
                  <TouchableOpacity
                    key={c.code}
                    style={[
                      styles.countryOption,
                      { borderColor: c.border },
                      country === c.code && { backgroundColor: c.primary + '20' },
                    ]}
                    onPress={() => {
                      setCountry(c.code);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.countryOptionText,
                        { color: country === c.code ? c.primary : c.text },
                      ]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>APP</Text>

          <View style={[styles.settingItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: c.text }]}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: c.border, true: c.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={[styles.toggleDesc, { color: c.textMuted }]}>
              Injection reminders and cycle alerts
            </Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: c.text }]}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: c.border, true: c.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>DISCLAIMER</Text>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: c.border }]}
            onPress={handleReacceptDisclaimer}
          >
            <Text style={[styles.actionText, { color: c.text }]}>Re-accept Disclaimer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>DATA</Text>

          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: c.error }]}
            onPress={handleResetData}
          >
            <Text style={[styles.dangerText, { color: c.error }]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: c.textMuted }]}>PepMax v1.0.0</Text>
          <Text style={[styles.disclaimer, { color: c.textMuted }]}>
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
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
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
  settingItem: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  settingLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  weightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  weightInput: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  unitButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  countrySelected: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 12,
  },
  countryList: {
    marginTop: spacing.sm,
  },
  countryOption: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  countryOptionText: {
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleDesc: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  actionButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  disclaimer: {
    fontSize: 10,
    textAlign: 'center',
  },
});