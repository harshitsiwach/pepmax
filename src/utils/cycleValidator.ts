import { Peptide, Cycle } from '../types';
import { addWeeks, isAfter, isBefore, parseISO } from 'date-fns';

export function validateCycle(
  peptide: Peptide,
  durationWeeks: number,
  breakWeeks: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const maxOnTime = peptide.cycle.max_on_time_weeks;
  if (maxOnTime && durationWeeks > maxOnTime) {
    errors.push(`${peptide.name} recommended max cycle is ${maxOnTime} weeks. You specified ${durationWeeks}.`);
  }

  if (breakWeeks < peptide.cycle.min_break_weeks) {
    errors.push(`${peptide.name} requires at least ${peptide.cycle.min_break_weeks} weeks break.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculateCycleEnd(startDate: string, durationWeeks: number): string {
  return addWeeks(parseISO(startDate), durationWeeks).toISOString();
}

export function isCycleActive(cycle: Cycle): boolean {
  if (!cycle.isActive) return false;
  
  const endDate = addWeeks(parseISO(cycle.startDate), cycle.durationWeeks);
  return isBefore(new Date(), endDate);
}

export function getDaysUntilCycleEnd(cycle: Cycle): number {
  const endDate = addWeeks(parseISO(cycle.startDate), cycle.durationWeeks);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysUntilBreakEnd(cycle: Cycle): number {
  const breakEndDate = addWeeks(
    addWeeks(parseISO(cycle.startDate), cycle.durationWeeks),
    cycle.breakWeeks
  );
  const now = new Date();
  const diffTime = breakEndDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}