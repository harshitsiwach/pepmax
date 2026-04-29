export type Gender = 'male' | 'female' | 'other';
export type UnitSystem = 'metric' | 'imperial';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  peptides: string[];
}

export interface DosageTiming {
  time: string;
  description: string;
}

export interface DosageData {
  beginner: number;
  intermediate: number;
  advanced: number;
  timing: DosageTiming[];
  frequency: string;
}

export interface Dosage {
  male: DosageData;
  female: DosageData;
  female_dose_multiplier: number;
}

export interface SideEffect {
  effect: string;
  severity: 'common' | 'rare' | 'serious';
  frequency?: string;
}

export interface LegalStatus {
  status: 'legal' | 'gray' | 'illegal';
  note?: string;
}

export interface PeptideSource {
  pmid: string;
  title: string;
  url?: string;
  confidence?: 'high' | 'medium' | 'low';
}

export interface PeptideStack {
  peptide: string;
  level: 'high' | 'medium' | 'low';
  reason: string;
}

export interface PeptideConflicts {
  peptide: string;
  severity: 'high' | 'medium' | 'low';
  reason: string;
}

export interface Peptide {
  name: string;
  full_name?: string;
  category: string;
  description: string;
  tldr: string;
  mechanism: string;
  benefits: { benefit: string; evidence: 'high' | 'medium' | 'low' }[];
  dosage: Dosage;
  administration: {
    route: string;
    storage: string;
    reconstitution?: string;
  }[];
  side_effects: SideEffect[];
  contraindications?: string[];
  legal: {
    us?: LegalStatus;
    eu?: LegalStatus;
    uk?: LegalStatus;
    ca?: LegalStatus;
  };
  safety_rating: 'excellent' | 'good' | 'moderate' | 'high-risk';
  half_life?: string;
  cycle: {
    recommended_length_weeks: number;
    min_break_weeks: number;
    max_on_time_weeks?: number;
  };
  stacks?: {
    good_with: PeptideStack[];
    avoid_with: PeptideConflicts[];
  };
  sources?: PeptideSource[];
  popularity_score?: number;
  evidence_level?: 'clinical' | 'animal' | 'human_trial' | 'anecdotal';
  requires_prescription?: boolean;
  last_updated?: string;
}

export interface Database {
  metadata: {
    app_name: string;
    version: string;
    total_peptides: number;
    categories: number;
    last_updated: string;
    disclaimer: string;
  };
  categories: Category[];
  peptides: Record<string, Peptide>;
}

export interface Cycle {
  id: string;
  name: string;
  peptides: string[];
  startDate: string;
  durationWeeks: number;
  breakWeeks: number;
  frequency: 'daily' | '5_on_2_off' | 'custom';
  notes?: string;
  isActive: boolean;
}

export interface DailyLog {
  id: string;
  date: string;
  entries: LogEntry[];
  metrics?: {
    energy?: number;
    sleep?: number;
    mood?: number;
    hunger?: number;
    strength?: number;
  };
  notes?: string;
}

export interface LogEntry {
  peptide: string;
  dose?: number;
  taken: boolean;
  skipped?: boolean;
  time?: string;
  site?: string;
  notes?: string;
}

export interface UserSettings {
  gender: Gender;
  weight: number;
  unitSystem: UnitSystem;
  country: string;
  hasAcceptedDisclaimer: boolean;
  hasPassedAgeGate: boolean;
  notifications: boolean;
  darkMode: boolean;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  description: string;
  relatedPeptides: string[];
}