import { Peptide } from '../types';

const ILLEGAL_PEPTIDES_BY_COUNTRY: Record<string, string[]> = {
  US: ['Melanotan II'],
  UK: ['Melanotan II', 'PT-141'],
  EU: ['Melanotan II'],
  CA: ['Melanotan II'],
};

const GRAY_AREA_PEPTIDES: Record<string, string[]> = {
  US: ['PT-141', 'Thymosin Alpha-1'],
  UK: ['BPC-157', 'TB-500'],
  EU: ['BPC-157', 'TB-500'],
};

export function isPeptideLegalInCountry(peptide: Peptide, country: string): 'legal' | 'gray' | 'illegal' {
  const illegalList = ILLEGAL_PEPTIDES_BY_COUNTRY[country] || [];
  const grayList = GRAY_AREA_PEPTIDES[country] || [];

  if (peptide.requires_prescription) {
    return 'gray';
  }

  if (illegalList.some(p => peptide.name.toLowerCase().includes(p.toLowerCase()))) {
    return 'illegal';
  }

  if (grayList.some(p => peptide.name.toLowerCase().includes(p.toLowerCase()))) {
    return 'gray';
  }

  if (peptide.legal) {
    const countryLegal = peptide.legal[country.toLowerCase() as keyof typeof peptide.legal];
    if (countryLegal) {
      return countryLegal.status;
    }
  }

  return 'legal';
}

export function filterLegalPeptides(peptides: Peptide[], country: string): Peptide[] {
  return peptides.filter(p => isPeptideLegalInCountry(p, country) !== 'illegal');
}

export function getLegalStatusLabel(status: 'legal' | 'gray' | 'illegal'): string {
  switch (status) {
    case 'legal':
      return 'Legal';
    case 'gray':
      return 'Gray Area';
    case 'illegal':
      return 'Illegal';
  }
}

export function getLegalStatusColor(status: 'legal' | 'gray' | 'illegal'): string {
  switch (status) {
    case 'legal':
      return '#00FF87';
    case 'gray':
      return '#FFB800';
    case 'illegal':
      return '#FF2D55';
  }
}