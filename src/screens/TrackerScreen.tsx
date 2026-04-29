import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { useCycleStore } from '../store/useCycleStore';
import { useLogStore } from '../store/useLogStore';
import { colors, spacing, borderRadius } from '../utils/theme';
import { getAllPeptides } from '../utils/db';
import { format, parseISO } from 'date-fns';
import { LogEntry } from '../types';

export function TrackerScreen() {
  const { darkMode } = useUserStore();
  const { activeCycle } = useCycleStore();
  const { logs, addLog, getLogForDate } = useLogStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  const peptides = getAllPeptides();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = getLogForDate(today);

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedPeptide, setSelectedPeptide] = useState<string | null>(null);
  const [doseAmount, setDoseAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleLogDose = () => {
    if (!selectedPeptide) return;

    const entry: LogEntry = {
      peptide: selectedPeptide,
      dose: parseFloat(doseAmount) || undefined,
      taken: true,
      time: format(new Date(), 'HH:mm'),
      notes: notes || undefined,
    };

    addEntry(selectedDate, entry);
    setSelectedPeptide(null);
    setDoseAmount('');
    setNotes('');
  };

  const addEntry = (date: string, entry: LogEntry) => {
    const existingLog = getLogForDate(date);
    if (existingLog) {
      useLogStore.getState().updateLog(date, {
        entries: [...existingLog.entries, entry],
      });
    } else {
      useLogStore.getState().addLog({
        id: date,
        date,
        entries: [entry],
      });
    }
  };

  const activePeptides = activeCycle?.peptides || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>Tracker</Text>
          <Text style={[styles.subtitle, { color: c.textMuted }]}>
            Log your daily doses
          </Text>
        </View>

        {activeCycle ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>ACTIVE CYCLE</Text>
            <View style={[styles.cycleCard, { backgroundColor: c.primary + '10', borderColor: c.primary }]}>
              <Text style={[styles.cycleName, { color: c.primary }]}>{activeCycle.name}</Text>
              <Text style={[styles.cyclePeptides, { color: c.text }]}>
                {activeCycle.peptides.join(', ')}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.noCycle, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.noCycleText, { color: c.textMuted }]}>
              No active cycle. Start a cycle in the Cycle Planner.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>LOG DOSE</Text>
          <Text style={[styles.inputLabel, { color: c.textMuted }]}>PEPTIDE</Text>
          <View style={styles.peptideList}>
            {(activePeptides.length > 0 ? activePeptides : peptides.slice(0, 6).map(p => p.name)).map((name) => {
              const peptide = peptides.find(p => p.name === name);
              if (!peptide) return null;
              return (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.peptideChip,
                    {
                      backgroundColor: selectedPeptide === name ? c.primary : c.surface,
                      borderColor: c.border,
                    },
                  ]}
                  onPress={() => setSelectedPeptide(name)}
                >
                  <Text
                    style={[
                      styles.peptideChipText,
                      { color: selectedPeptide === name ? '#FFFFFF' : c.text },
                    ]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedPeptide && (
            <>
              <Text style={[styles.inputLabel, { color: c.textMuted, marginTop: spacing.md }]}>DOSE (mcg)</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: c.surface, borderColor: c.border, color: c.text },
                ]}
                value={doseAmount}
                onChangeText={setDoseAmount}
                keyboardType="numeric"
                placeholder="500"
                placeholderTextColor={c.textMuted}
              />

              <Text style={[styles.inputLabel, { color: c.textMuted, marginTop: spacing.md }]}>NOTES (optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.notesInput,
                  { backgroundColor: c.surface, borderColor: c.border, color: c.text },
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Injection site, feelings, etc."
                placeholderTextColor={c.textMuted}
                multiline
              />

              <TouchableOpacity
                style={[styles.logButton, { backgroundColor: c.primary }]}
                onPress={handleLogDose}
              >
                <Text style={styles.logButtonText}>LOG DOSE</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>TODAY'S LOG</Text>
          {todayLog && todayLog.entries.length > 0 ? (
            todayLog.entries.map((entry, idx) => (
              <View key={idx} style={[styles.logEntry, { backgroundColor: c.surface, borderColor: c.border }]}>
                <View style={styles.logEntryHeader}>
                  <Text style={[styles.logPeptide, { color: c.text }]}>{entry.peptide}</Text>
                  <Text style={[styles.logDose, { color: c.primary }]}>
                    {entry.dose ? `${entry.dose}mcg` : 'Logged'}
                  </Text>
                </View>
                {entry.time && (
                  <Text style={[styles.logTime, { color: c.textMuted }]}>{entry.time}</Text>
                )}
                {entry.notes && (
                  <Text style={[styles.logNotes, { color: c.textMuted }]}>{entry.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={[styles.emptyLog, { color: c.textMuted }]}>No doses logged today</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>HISTORY</Text>
          {logs.filter(l => l.date !== today).slice(0, 7).map((log) => (
            <View key={log.id} style={[styles.historyDay, { borderColor: c.border }]}>
              <Text style={[styles.historyDate, { color: c.text }]}>
                {format(parseISO(log.date), 'EEE, MMM d')}
              </Text>
              <Text style={[styles.historyCount, { color: c.textMuted }]}>
                {log.entries.length} doses
              </Text>
            </View>
          ))}
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
  cycleCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  cycleName: {
    fontSize: 18,
    fontWeight: '700',
  },
  cyclePeptides: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  noCycle: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  noCycleText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.sm,
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
  input: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  logButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  logEntry: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  logEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logPeptide: {
    fontSize: 16,
    fontWeight: '600',
  },
  logDose: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  logTime: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  logNotes: {
    fontSize: 12,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  emptyLog: {
    fontSize: 14,
    textAlign: 'center',
    padding: spacing.lg,
  },
  historyDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyCount: {
    fontSize: 14,
  },
});