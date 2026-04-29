import { Peptide, ExperienceLevel, Gender } from '../types';

export function calculateDose(
  peptide: Peptide,
  gender: Gender,
  weight: number,
  level: ExperienceLevel
): { dose: number; unit: string } {
  const dosageData = gender === 'male' ? peptide.dosage.male : peptide.dosage.female;
  
  let baseDose: number;
  switch (level) {
    case 'beginner':
      baseDose = dosageData.beginner;
      break;
    case 'intermediate':
      baseDose = dosageData.intermediate;
      break;
    case 'advanced':
      baseDose = dosageData.advanced;
      break;
  }

  // Weight-based adjustment (simple: assume 70kg baseline)
  const weightMultiplier = weight / 70;
  const adjustedDose = Math.round(baseDose * weightMultiplier);

  return { dose: adjustedDose, unit: 'mcg' };
}

export function getFemaleDose(maleDose: number, multiplier: number): number {
  return Math.round(maleDose * multiplier);
}

export function formatDose(dose: number): string {
  if (dose >= 1000) {
    return `${(dose / 1000).toFixed(1)}mg`;
  }
  return `${dose}mcg`;
}

export function getDosageByLevel(
  peptide: Peptide,
  gender: Gender,
  level: ExperienceLevel
): number {
  const dosageData = gender === 'male' ? peptide.dosage.male : peptide.dosage.female;
  switch (level) {
    case 'beginner':
      return dosageData.beginner;
    case 'intermediate':
      return dosageData.intermediate;
    case 'advanced':
      return dosageData.advanced;
    default:
      return dosageData.beginner;
  }
}