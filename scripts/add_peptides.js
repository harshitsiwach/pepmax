const fs = require('fs');

const newPeptides = {
  // GLP-1 Agonists
  "Semaglutide": {
    name: "Semaglutide",
    full_name: "GLP-1 Receptor Agonist",
    category: "Fat Loss & Metabolism",
    description: "GLP-1R agonist; appetite suppression, insulin secretion, glycemic control, weight loss",
    tldr: "Powerful weight loss and diabetes management via GLP-1 receptor activation",
    mechanism: "Acts as GLP-1 receptor agonist, slowing gastric emptying, reducing appetite, enhancing insulin secretion in response to meals",
    benefits: [
      { benefit: "Significant weight loss", evidence: "high" },
      { benefit: "Improved glycemic control", evidence: "high" },
      { benefit: "Reduced cardiovascular risk", evidence: "high" }
    ],
    dosage: {
      male: { beginner: 250, intermediate: 1000, advanced: 2400, timing: [{ time: "Weekly", description: "Once weekly injection" }], frequency: "Weekly" },
      female: { beginner: 250, intermediate: 1000, advanced: 2400, timing: [{ time: "Weekly", description: "Once weekly injection" }], frequency: "Weekly" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Refrigerate, do not freeze" }],
    side_effects: [{ effect: "Nausea", severity: "common", frequency: "20-30%" }, { effect: "Vomiting", severity: "rare", frequency: "5-10%" }, { effect: "Pancreatitis", severity: "serious" }],
    safety_rating: "excellent",
    half_life: "165 hours",
    requires_prescription: true,
    evidence_level: "clinical",
    cycle: { recommended_length_weeks: 52, min_break_weeks: 4 }
  },
  "Tirzepatide": {
    name: "Tirzepatide",
    full_name: "Dual GLP-1/GIP Receptor Agonist",
    category: "Fat Loss & Metabolism",
    description: "Dual GLP-1R/GIPR agonism; potent weight loss, glycemic control",
    tldr: "Most powerful weight loss peptide - dual GLP-1 and GIP receptor agonist",
    mechanism: "Activates both GLP-1 and GIP receptors, providing synergistic metabolic benefits",
    benefits: [
      { benefit: "20%+ weight loss in trials", evidence: "high" },
      { benefit: "Superior glycemic control", evidence: "high" },
      { benefit: "Improved insulin sensitivity", evidence: "high" }
    ],
    dosage: {
      male: { beginner: 5000, intermediate: 10000, advanced: 15000, timing: [{ time: "Weekly", description: "Once weekly injection" }], frequency: "Weekly" },
      female: { beginner: 5000, intermediate: 10000, advanced: 15000, timing: [{ time: "Weekly", description: "Once weekly injection" }], frequency: "Weekly" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Refrigerate" }],
    side_effects: [{ effect: "Nausea", severity: "common" }, { effect: "Diarrhea", severity: "common" }, { effect: "Reduced appetite", severity: "common" }],
    safety_rating: "excellent",
    half_life: "116 hours",
    requires_prescription: true,
    evidence_level: "clinical",
    cycle: { recommended_length_weeks: 52, min_break_weeks: 4 }
  },
  "Liraglutide": {
    name: "Liraglutide",
    full_name: "GLP-1 Receptor Agonist",
    category: "Fat Loss & Metabolism",
    description: "GLP-1R agonist; diabetes & obesity management, cardiovascular risk reduction",
    tldr: "Daily GLP-1 agonist for diabetes and weight management",
    mechanism: "GLP-1 receptor agonist that enhances glucose-dependent insulin secretion",
    benefits: [
      { benefit: "Weight loss", evidence: "high" },
      { benefit: "HbA1c reduction", evidence: "high" },
      { benefit: "Cardiovascular benefits", evidence: "high" }
    ],
    dosage: {
      male: { beginner: 600, intermediate: 1800, advanced: 3000, timing: [{ time: "Daily", description: "Once daily injection" }], frequency: "Daily" },
      female: { beginner: 600, intermediate: 1800, advanced: 3000, timing: [{ time: "Daily", description: "Once daily injection" }], frequency: "Daily" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Refrigerate" }],
    side_effects: [{ effect: "Nausea", severity: "common" }, { effect: "Hypoglycemia", severity: "rare" }, { effect: "Pancreatitis", severity: "serious" }],
    safety_rating: "excellent",
    half_life: "13 hours",
    requires_prescription: true,
    evidence_level: "clinical",
    cycle: { recommended_length_weeks: 52, min_break_weeks: 4 }
  },
  // Additional key peptides from CSV
  "Oxytocin": {
    name: "Oxytocin",
    full_name: "Oxytocin Neuropeptide",
    category: "Sexual Health & Libido",
    description: "Uterine contraction, lactation initiation, social bonding, anxiety reduction",
    tldr: "The 'love hormone' - affects social bonding, trust, and sexual function",
    mechanism: "Binds to oxytocin receptors in brain and body, affecting social behavior, trust, and reproductive functions",
    benefits: [
      { benefit: "Enhanced social bonding", evidence: "high" },
      { benefit: "Reduced anxiety", evidence: "medium" },
      { benefit: "Improved sexual function", evidence: "medium" }
    ],
    dosage: {
      male: { beginner: 10, intermediate: 20, advanced: 40, timing: [{ time: "Nasal", description: "As needed" }], frequency: "As needed" },
      female: { beginner: 10, intermediate: 20, advanced: 40, timing: [{ time: "Nasal", description: "As needed" }], frequency: "As needed" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Nasal", storage: "Room temperature" }],
    side_effects: [{ effect: "Headache", severity: "common" }, { effect: "Nausea", severity: "rare" }, { effect: "Water retention", severity: "rare" }],
    safety_rating: "excellent",
    half_life: "3-5 minutes",
    requires_prescription: true,
    evidence_level: "clinical",
    cycle: { recommended_length_weeks: 8, min_break_weeks: 2 }
  },
  "MOTS-c": {
    name: "MOTS-c",
    full_name: "Mitochondrial Peptide",
    category: "Anti-Aging & Rejuvenation",
    description: "Mitochondrial biogenesis, exercise capacity enhancement, metabolic regulation",
    tldr: "Mitochondrial-derived peptide that regulates metabolism and exercise response",
    mechanism: "Enters nucleus to regulate gene expression, improving metabolic flexibility and insulin sensitivity",
    benefits: [
      { benefit: "Improved metabolic health", evidence: "medium" },
      { benefit: "Enhanced exercise capacity", evidence: "medium" },
      { benefit: "Anti-aging effects", evidence: "low" }
    ],
    dosage: {
      male: { beginner: 1000, intermediate: 3000, advanced: 5000, timing: [{ time: "Daily", description: "Subcutaneous" }], frequency: "Daily" },
      female: { beginner: 1000, intermediate: 3000, advanced: 5000, timing: [{ time: "Daily", description: "Subcutaneous" }], frequency: "Daily" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Refrigerate" }],
    side_effects: [{ effect: "Injection site reactions", severity: "common" }],
    safety_rating: "good",
    requires_prescription: false,
    evidence_level: "animal",
    cycle: { recommended_length_weeks: 12, min_break_weeks: 4 }
  },
  "Follistatin": {
    name: "Follistatin",
    full_name: "Myostatin Inhibitor",
    category: "Muscle Growth & Performance",
    description: "Myostatin inhibition, muscle growth, tendon repair",
    tldr: "Powerful myostatin inhibitor - blocks muscle growth limits",
    mechanism: "Binds and neutralizes myostatin, removing the brake on muscle growth",
    benefits: [
      { benefit: "Significant muscle growth", evidence: "medium" },
      { benefit: "Improved recovery", evidence: "medium" },
      { benefit: "Tendon strengthening", evidence: "low" }
    ],
    dosage: {
      male: { beginner: 5000, intermediate: 10000, advanced: 20000, timing: [{ time: "Weekly", description: "Once or twice weekly" }], frequency: "Weekly" },
      female: { beginner: 5000, intermediate: 10000, advanced: 20000, timing: [{ time: "Weekly", description: "Once or twice weekly" }], frequency: "Weekly" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Refrigerate" }],
    side_effects: [{ effect: "Fluid retention", severity: "common" }, { effect: "Increased appetite", severity: "common" }],
    safety_rating: "moderate",
    requires_prescription: false,
    evidence_level: "animal",
    cycle: { recommended_length_weeks: 8, min_break_weeks: 4 }
  },
  "Bremelanotide": {
    name: "Bremelanotide",
    full_name: "Melanocortin Receptor Agonist",
    category: "Sexual Health & Libido",
    description: "Hypothalamic-pituitary-gonadal axis stimulation, female/male sexual dysfunction",
    tldr: "FDA-approved for female sexual dysfunction (HSDD)",
    mechanism: "Activates melanocortin receptors, particularly MC4R, affecting sexual desire and behavior",
    benefits: [
      { benefit: "Increased libido", evidence: "high" },
      { benefit: "Improved sexual satisfaction", evidence: "high" },
      { benefit: "Enhanced arousal", evidence: "medium" }
    ],
    dosage: {
      male: { beginner: 1750, intermediate: 2500, advanced: 3500, timing: [{ time: "As needed", description: "Before sexual activity" }], frequency: "As needed" },
      female: { beginner: 1750, intermediate: 2500, advanced: 3500, timing: [{ time: "As needed", description: "Before sexual activity" }], frequency: "As needed" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Room temperature" }],
    side_effects: [{ effect: "Nausea", severity: "common" }, { effect: "Headache", severity: "common" }, { effect: "Flushing", severity: "common" }],
    safety_rating: "excellent",
    half_life: "2.5 hours",
    requires_prescription: true,
    evidence_level: "clinical",
    cycle: { recommended_length_weeks: 8, min_break_weeks: 2 }
  },
  "Epitalon": {
    name: "Epitalon",
    full_name: "Epithalamin Synthetic Analog",
    category: "Anti-Aging & Rejuvenation",
    description: "Anti-aging, telomere maintenance, thymic regeneration",
    tldr: "Russian anti-aging peptide - increases telomerase activity",
    mechanism: "Stimulates telomerase activity, increases pineal gland function, modulates melatonin",
    benefits: [
      { benefit: "Telomere length maintenance", evidence: "medium" },
      { benefit: "Improved sleep quality", evidence: "medium" },
      { benefit: "Immune system support", evidence: "medium" }
    ],
    dosage: {
      male: { beginner: 1000, intermediate: 3000, advanced: 5000, timing: [{ time: "Daily", description: "Course of 10-20 days" }], frequency: "Daily" },
      female: { beginner: 1000, intermediate: 3000, advanced: 5000, timing: [{ time: "Daily", description: "Course of 10-20 days" }], frequency: "Daily" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Subcutaneous", storage: "Refrigerate" }],
    side_effects: [],
    safety_rating: "good",
    requires_prescription: false,
    evidence_level: "animal",
    cycle: { recommended_length_weeks: 4, min_break_weeks: 8 }
  },
  "Selank": {
    name: "Selank",
    full_name: "Synthetic Tuftsin Analog",
    category: "Cognitive & Nootropic",
    description: "Anxiolytic, cognitive enhancement, immune modulation, telomerase activation",
    tldr: "Russian nootropic peptide with anxiolytic properties",
    mechanism: "Modulates neurotransmitter levels, particularly serotonin and GABA, while enhancing immune function",
    benefits: [
      { benefit: "Reduced anxiety", evidence: "high" },
      { benefit: "Improved cognition", evidence: "medium" },
      { benefit: "Enhanced memory", evidence: "medium" }
    ],
    dosage: {
      male: { beginner: 10000, intermediate: 30000, advanced: 50000, timing: [{ time: "Daily", description: "Morning" }], frequency: "Daily" },
      female: { beginner: 10000, intermediate: 30000, advanced: 50000, timing: [{ time: "Daily", description: "Morning" }], frequency: "Daily" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Nasal", storage: "Room temperature" }],
    side_effects: [{ effect: "Mild sedation", severity: "rare" }],
    safety_rating: "good",
    requires_prescription: false,
    evidence_level: "animal",
    cycle: { recommended_length_weeks: 4, min_break_weeks: 2 }
  },
  "Cerebrolysin": {
    name: "Cerebrolysin",
    full_name: "Peptide Mixture",
    category: "Cognitive & Nootropic",
    description: "Neuroprotection, stroke/dementia recovery, mitochondrial support",
    tldr: "Peptide mixture for neurological disorders and cognitive enhancement",
    mechanism: "Contains neurotrophic factors that support neuron survival and synaptic function",
    benefits: [
      { benefit: "Cognitive improvement", evidence: "high" },
      { benefit: "Neuroprotection", evidence: "high" },
      { benefit: "Stroke recovery", evidence: "medium" }
    ],
    dosage: {
      male: { beginner: 5000, intermediate: 15000, advanced: 30000, timing: [{ time: "Daily", description: "IV or IM" }], frequency: "Daily" },
      female: { beginner: 5000, intermediate: 15000, advanced: 30000, timing: [{ time: "Daily", description: "IV or IM" }], frequency: "Daily" },
      female_dose_multiplier: 1.0
    },
    administration: [{ route: "Intramuscular", storage: "Refrigerate" }],
    side_effects: [{ effect: "Injection site pain", severity: "common" }, { effect: "Headache", severity: "rare" }],
    safety_rating: "good",
    requires_prescription: true,
    evidence_level: "clinical",
    cycle: { recommended_length_weeks: 4, min_break_weeks: 4 }
  }
};

// Read existing database
const dbPath = './src/assets/data/peptide_database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Add new peptides
for (const [name, peptide] of Object.entries(newPeptides)) {
  if (!db.peptides[name]) {
    db.peptides[name] = peptide;
  }
}

// Update metadata
db.metadata.total_peptides = Object.keys(db.peptides).length;

// Update categories
const peptideNames = Object.keys(db.peptides);
db.categories.forEach(cat => {
  cat.peptides = cat.peptides.filter(p => peptideNames.includes(p));
});

// Add new categories if needed
const existingCategories = db.categories.map(c => c.name);
if (!existingCategories.includes("Weight Loss Medications")) {
  db.categories.push({
    id: "weight_loss_meds",
    name: "Weight Loss Medications",
    icon: "⚖️",
    description: "FDA-approved weight loss medications",
    peptides: ["Semaglutide", "Tirzepatide", "Liraglutide"]
  });
}

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Database updated. Total peptides: ${db.metadata.total_peptides}`);