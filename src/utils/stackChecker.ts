import { Peptide } from '../types';

interface StackConflict {
  peptideA: string;
  peptideB: string;
  severity: 'high' | 'medium' | 'low';
  reason: string;
}

interface StackSynergy {
  peptideA: string;
  peptideB: string;
  level: 'high' | 'medium' | 'low';
  reason: string;
}

const KNOWN_CONFLICTS: StackConflict[] = [
  {
    peptideA: 'GHRP-6',
    peptideB: 'CJC-1295 (DAC)',
    severity: 'high',
    reason: 'Cortisol spike risk - both increase GH and cortisol',
  },
  {
    peptideA: 'GHRP-2',
    peptideB: 'GHRP-6',
    severity: 'medium',
    reason: 'Redundant mechanism - increased side effects',
  },
  {
    peptideA: 'Melanotan II',
    peptideB: 'PT-141',
    severity: 'medium',
    reason: 'Both affect melanin and sexual function - unpredictable results',
  },
];

const KNOWN_SYNERGIES: StackSynergy[] = [
  {
    peptideA: 'BPC-157',
    peptideB: 'TB-500',
    level: 'high',
    reason: 'Complementary healing - BPC-157 enhances TB-500 tissue repair',
  },
  {
    peptideA: 'Ipamorelin',
    peptideB: 'CJC-1295',
    level: 'high',
    reason: 'Synergistic GH release - Ipamorelin adds GHRP receptor activity',
  },
  {
    peptideA: 'GHK-Cu',
    peptideB: 'BPC-157',
    level: 'medium',
    reason: 'Wound healing synergy - both promote tissue regeneration',
  },
  {
    peptideA: 'Sermorelin',
    peptideB: 'Ipamorelin',
    level: 'medium',
    reason: 'Complementary GH stimulation - different mechanisms',
  },
];

export function checkConflicts(peptides: string[]): StackConflict[] {
  const conflicts: StackConflict[] = [];

  for (const conflict of KNOWN_CONFLICTS) {
    const hasA = peptides.some(p => p.toLowerCase().includes(conflict.peptideA.toLowerCase()));
    const hasB = peptides.some(p => p.toLowerCase().includes(conflict.peptideB.toLowerCase()));
    if (hasA && hasB) {
      conflicts.push(conflict);
    }
  }

  return conflicts;
}

export function checkSynergies(peptides: string[]): StackSynergy[] {
  const synergies: StackSynergy[] = [];

  for (const synergy of KNOWN_SYNERGIES) {
    const hasA = peptides.some(p => p.toLowerCase().includes(synergy.peptideA.toLowerCase()));
    const hasB = peptides.some(p => p.toLowerCase().includes(synergy.peptideB.toLowerCase()));
    if (hasA && hasB) {
      synergies.push(synergy);
    }
  }

  return synergies;
}

export function getGHSecretagogueCount(peptides: string[]): number {
  const ghPeptides = ['GHRP-2', 'GHRP-6', 'GHRP-4', 'Hexarelin', 'Ipamorelin'];
  return peptides.filter(p => 
    ghPeptides.some(gh => p.toLowerCase().includes(gh.toLowerCase()))
  ).length;
}