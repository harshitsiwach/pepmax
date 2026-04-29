import database from '../assets/data/peptide_database.json';
import { Database, Peptide, Category, Goal } from '../types';

const DB = database as Database;

export function getAllPeptides(): Peptide[] {
  return Object.values(DB.peptides);
}

export function getPeptideById(name: string): Peptide | undefined {
  return DB.peptides[name];
}

export function getPeptideBySlug(slug: string): Peptide | undefined {
  const normalized = slug.toUpperCase().replace(/-/g, ' ');
  return getAllPeptides().find(p => 
    p.name.toUpperCase().replace(/-/g, ' ').includes(normalized)
  );
}

export function getAllCategories(): Category[] {
  return DB.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return DB.categories.find(c => c.id === id);
}

export function getPeptidesByCategory(categoryId: string): Peptide[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return category.peptides.map(name => DB.peptides[name]).filter(Boolean);
}

export function searchPeptides(query: string): Peptide[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return getAllPeptides();

  return getAllPeptides().filter(p => 
    p.name.toLowerCase().includes(normalized) ||
    p.description.toLowerCase().includes(normalized) ||
    p.category.toLowerCase().includes(normalized) ||
    p.tldr.toLowerCase().includes(normalized)
  );
}

export function getGoals(): Goal[] {
  return DB.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    description: cat.description,
    relatedPeptides: cat.peptides,
  }));
}

export function getPeptidesByGoal(goalId: string): Peptide[] {
  const goal = getGoals().find(g => g.id === goalId);
  if (!goal) return [];
  return goal.relatedPeptides.map(name => DB.peptides[name]).filter(Boolean);
}

export function getMVPPeptides(): Peptide[] {
  const mvpNames = [
    'BPC-157',
    'TB-500',
    'GHK-Cu',
    'Ipamorelin',
    'Sermorelin',
    'CJC-1295',
    'AOD-9604',
    'Semax',
    'PT-141',
    'Thymosin Alpha-1',
  ];
  return mvpNames.map(name => DB.peptides[name]).filter(Boolean);
}

export function getSafetyRatingLabel(rating: string): string {
  switch (rating) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'moderate':
      return 'Moderate';
    case 'high-risk':
      return 'High Risk';
    default:
      return rating;
  }
}

export function getSafetyRatingColor(rating: string): string {
  switch (rating) {
    case 'excellent':
      return '#00FF87';
    case 'good':
      return '#4A90D9';
    case 'moderate':
      return '#FFB800';
    case 'high-risk':
      return '#FF2D55';
    default:
      return '#666666';
  }
}

export { DB };