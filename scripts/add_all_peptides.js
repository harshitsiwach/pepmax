const fs = require('fs');

// All peptides from the CSV (excluding the ones already added)
const allPeptides = {
  // Already added: Ipamorelin, CJC-1295, BPC-157, TB-500, Thymosin Alpha-1, Semax, GHK-Cu, AOD-9604, Sermorelin, Melanonan II, PT-141
  // From CSV - adding more:
  "Semaglutide": { category: "Weight Loss Medications", dose: "0.25-2.4 mg/week", status: "FDA-Approved" },
  "Liraglutide": { category: "Weight Loss Medications", dose: "0.6-3 mg/day", status: "FDA-Approved" },
  "Dulaglutide": { category: "Weight Loss Medications", dose: "0.75-4.5 mg/week", status: "FDA-Approved" },
  "Tirzepatide": { category: "Weight Loss Medications", dose: "5-15 mg/week", status: "FDA-Approved" },
  "Exenatide": { category: "Weight Loss Medications", dose: "5-10 mcg/kg/day", status: "FDA-Approved" },
  "Albiglutide": { category: "Weight Loss Medications", dose: "30-60 mg/week", status: "FDA-Approved" },
  "Lixisenatide": { category: "Weight Loss Medications", dose: "20-40 mcg/day", status: "EMA-Approved" },
  
  // Peptides from the CSV
  "Oxytocin": { category: "Hormones", dose: "1-40 IU", status: "FDA-Approved" },
  "Carbetocin": { category: "Hormones", dose: "10-30 mcg", status: "FDA-Approved" },
  "MOTS-c": { category: "Mitochondrial", dose: "1-5 mg/day", status: "Investigational" },
  "FGF-21": { category: "Metabolic", dose: "5-30 mg/day", status: "Phase II/III" },
  "Adiponectin": { category: "Metabolic", dose: "5-20 mg/day", status: "Investigational" },
  "PTHrP": { category: "Bone & Muscle", dose: "1-5 mg/day", status: "Investigational" },
  "IGF-1": { category: "Growth", dose: "30-90 mcg/kg/day", status: "FDA-Approved" },
  "Tesamorelin": { category: "GH Secretagogues", dose: "0.5-2 mg/day", status: "FDA-Approved" },
  "Hexarelin": { category: "GH Secretagogues", dose: "1-3 mg/day", status: "Investigational" },
  "GHRP-6": { category: "GH Secretagogues", dose: "1-5 mg/day", status: "Investigational" },
  "GHRP-2": { category: "GH Secretagogues", dose: "1-5 mg/day", status: "Investigational" },
  "Kisspeptin-10": { category: "Reproductive", dose: "5-20 mg/day", status: "Investigational" },
  "Leuprolide": { category: "Reproductive", dose: "3.75-11.25 mg/month", status: "FDA-Approved" },
  "LL-37": { category: "Antimicrobial", dose: "5-20 mg/day", status: "Investigational" },
  "Afamelanotide": { category: "Pigment", dose: "10 mg/day", status: "FDA-Approved" },
  "Endomorphin-2": { category: "Opioid", dose: "0.5-5 mcg/kg/day", status: "Investigational" },
  "Dermorphin": { category: "Opioid", dose: "0.5-5 mcg/kg/day", status: "Investigational" },
  "NPY(1-36)": { category: "Neuropeptide", dose: "0.5-5 mg/day", status: "Investigational" },
  "Cerebrolysin": { category: "Nootropic", dose: "5-30 mg/day", status: "FDA-Approved (EU)" },
  "Epitalon": { category: "Anti-Aging", dose: "1-5 mg/day", status: "Investigational" },
  "Selank": { category: "Nootropic", dose: "10-50 mg/day", status: "Investigational" },
  "KPV-23": { category: "Antimicrobial", dose: "5-20 mg/day", status: "Investigational" },
  "Thymulin": { category: "Immune", dose: "5-20 mg/day", status: "Investigational" },
  "Apegrin": { category: "Immune", dose: "5-20 mg/day", status: "Investigational" },
  "Follistatin": { category: "Muscle Growth", dose: "5-20 mg/day", status: "Investigational" },
  "Osteocalcin Fragment": { category: "Bone", dose: "5-20 mg/day", status: "Investigational" },
  "Bremelanotide": { category: "Sexual Health", dose: "1.75-3.5 mg/day", status: "FDA-Approved" },
  "Erythropoietin": { category: "Hematopoietic", dose: "200-4000 IU/kg/week", status: "FDA-Approved" },
  "Darbepoetin": { category: "Hematopoietic", dose: "0.45-0.9 mcg/kg/week", status: "FDA-Approved" },
  "Romiplostim": { category: "Hematopoietic", dose: "1-10 mcg/kg/day", status: "FDA-Approved" },
  "Eltrombopag": { category: "Hematopoietic", dose: "25-150 mg/day", status: "FDA-Approved" },
  "Pegfilgrastim": { category: "Immune", dose: "6 mg/dose", status: "FDA-Approved" },
  "Filgrastim": { category: "Immune", dose: "5 mcg/kg/day", status: "FDA-Approved" },
  "Lenograstim": { category: "Immune", dose: "300-480 IU/kg/day", status: "EMA-Approved" },
  "Oprelvekin": { category: "Hematopoietic", dose: "20 mcg/kg/day", status: "FDA-Approved" },
  "Anakinra": { category: "Immune", dose: "100 mg/day", status: "FDA-Approved" },
  "Emapalumab": { category: "Immune", dose: "1-3 mg/kg/dose", status: "FDA-Approved" },
  "Belimumab": { category: "Immune", dose: "10 mg/kg/week", status: "FDA-Approved" },
  "Abatacept": { category: "Immune", dose: "125 mg/week", status: "FDA-Approved" },
  "Tocilizumab": { category: "Immune", dose: "8 mg/kg/q2w", status: "FDA-Approved" },
  "Sarilumab": { category: "Immune", dose: "150-200 mg/q2w", status: "FDA-Approved" },
  "Guselkumab": { category: "Immune", dose: "100-200 mg/q4w", status: "FDA-Approved" },
  "Risankizumab": { category: "Immune", dose: "150-300 mg/q8w", status: "FDA-Approved" },
  "Ustekinumab": { category: "Immune", dose: "45-90 mg/q8w", status: "FDA-Approved" },
  "Secukinumab": { category: "Immune", dose: "150-300 mg/q4w", status: "FDA-Approved" },
  "Ixekizumab": { category: "Immune", dose: "60-80 mg/q2w", status: "FDA-Approved" },
  "Bimekizumab": { category: "Immune", dose: "80-160 mg/q4w", status: "FDA-Approved" },
  "Canakinumab": { category: "Immune", dose: "150-300 mg/q4w", status: "FDA-Approved" },
  "Rilonacept": { category: "Immune", dose: "325 mg/kg/week", status: "FDA-Approved" },
  "Pexidartinib": { category: "Experimental", dose: "20 mg/kg/day", status: "FDA-Approved" },
  "Palifermin": { category: "Healing", dose: "60 mcg/kg/day", status: "FDA-Approved" },
  "Interferon Alpha-2a": { category: "Immune", dose: "3-10 million IU/week", status: "FDA-Approved" },
  "Interferon Beta-1a": { category: "Immune", dose: "250 mcg 3x/week", status: "FDA-Approved" },
  "Interferon Gamma-1b": { category: "Immune", dose: "50-100 mcg/m2/day", status: "FDA-Approved" },
};

// Additional experimental peptides from CSV (rows 81-134)
const experimentalPeptides = [
  { name: "Leukotriene A4 Hydrolase Inhibitor", dose: "0.5-5 mg/day", category: "Inflammatory" },
  { name: "Prostaglandin E2 Analog", dose: "0.5-2 mcg/kg/min", category: "Cardiovascular" },
  { name: "Prostaglandin F2α Analog", dose: "50-300 mcg", category: "Hormones" },
  { name: "Thromboxane A2 Mimetic", dose: "1-5 mg/day", category: "Experimental" },
  { name: "Leukotriene B4 Analog", dose: "0.5-5 mg/day", category: "Inflammatory" },
  { name: "Lipoxin A4 Analog", dose: "1-5 mg/day", category: "Inflammatory" },
  { name: "Resolvin E1 Analog", dose: "0.5-5 mg/day", category: "Inflammatory" },
  { name: "Protectin D1 Analog", dose: "1-5 mg/day", category: "Skin" },
  { name: "Marinesin M1 Analog", dose: "0.5-5 mg/day", category: "Cardiovascular" },
  { name: "Neuroprotectin N1 Analog", dose: "1-5 mg/day", category: "Neuroprotective" },
  { name: "Docosahexaenoic Acid Resolvin", dose: "0.5-5 mg/day", category: "Omega" },
  { name: "Eicosapentaenoic Acid Resolvin", dose: "1-5 mg/day", category: "Omega" },
  { name: "Arachidonic Acid Metabolite", dose: "0.5-5 mg/day", category: "Lipid" },
  { name: "Linoleic Acid Derivative", dose: "1-5 mg/day", category: "Skin" },
  { name: "Alpha-Linolenic Acid Derivative", dose: "0.5-5 mg/day", category: "Omega" },
  { name: "Gamma-Linolenic Acid Derivative", dose: "1-5 mg/day", category: "Skin" },
  { name: "Conjugated Linoleic Acid Derivative", dose: "0.5-5 mg/day", category: "Metabolic" },
  { name: "Palmitoleic Acid Derivative", dose: "1-5 mg/day", category: "Metabolic" },
  { name: "Stearic Acid Derivative", dose: "0.5-5 mg/day", category: "Lipid" },
  { name: "Oleic Acid Derivative", dose: "1-5 mg/day", category: "Metabolic" },
  { name: "Palmitic Acid Derivative", dose: "0.5-5 mg/day", category: "Lipid" },
  { name: "Myristic Acid Derivative", dose: "1-5 mg/day", category: "Antimicrobial" },
  { name: "Lauric Acid Derivative", dose: "0.5-5 mg/day", category: "Antimicrobial" },
  { name: "Caprylic Acid Derivative", dose: "1-5 mg/day", category: "Antimicrobial" },
  { name: "Capric Acid Derivative", dose: "0.5-5 mg/day", category: "Antimicrobial" },
  { name: "Caproic Acid Derivative", dose: "1-5 mg/day", category: "Antimicrobial" },
  { name: "Butyric Acid Derivative", dose: "0.5-5 mg/day", category: "Gut Health" },
  { name: "Acetic Acid Derivative", dose: "1-5 mg/day", category: "Metabolic" },
  { name: "Formic Acid Derivative", dose: "0.5-5 mg/day", category: "Antimicrobial" },
  { name: "Propionic Acid Derivative", dose: "1-5 mg/day", category: "Gut Health" },
  { name: "Valeric Acid Derivative", dose: "0.5-5 mg/day", category: "Antimicrobial" },
  { name: "Heptanoic Acid Derivative", dose: "1-5 mg/day", category: "Antimicrobial" },
  { name: "Nonanoic Acid Derivative", dose: "0.5-5 mg/day", category: "Antimicrobial" },
  { name: "Undecanoic Acid Derivative", dose: "1-5 mg/day", category: "Skin" },
  { name: "Tridecanoic Acid Derivative", dose: "0.5-5 mg/day", category: "Immune" },
  { name: "Pentadecanoic Acid Derivative", dose: "1-5 mg/day", category: "Lipid" },
  { name: "Heptadecanoic Acid Derivative", dose: "0.5-5 mg/day", category: "Metabolic" },
  { name: "Icosanoic Acid Derivative", dose: "1-5 mg/day", category: "Inflammatory" },
  { name: "Docosanoic Acid Derivative", dose: "0.5-5 mg/day", category: "Neuroprotective" },
  { name: "Tetracosanoic Acid Derivative", dose: "1-5 mg/day", category: "Skin" },
  { name: "Hexacosanoic Acid Derivative", dose: "0.5-5 mg/day", category: "Lipid" },
  { name: "Octacosanoic Acid Derivative", dose: "1-5 mg/day", category: "Metabolic" },
  { name: "Triacosanoic Acid Derivative", dose: "0.5-5 mg/day", category: "Immune" },
];

// Read existing database
const dbPath = './src/assets/data/peptide_database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const statusMap = {
  "FDA-Approved": "excellent",
  "EMA-Approved": "good",
  "FDA-Approved (EU)": "good",
  "Phase II/III": "moderate",
  "Phase II": "moderate",
  "Investigational": "moderate",
  "Experimental": "low"
};

const evidenceMap = {
  "FDA-Approved": "clinical",
  "EMA-Approved": "clinical",
  "FDA-Approved (EU)": "clinical",
  "Phase II/III": "human_trial",
  "Phase II": "human_trial",
  "Investigational": "animal",
  "Experimental": "anecdotal"
};

function createPeptide(name, info, isExperimental = false) {
  // Parse dosage
  let beginner = 1000, intermediate = 2000, advanced = 5000;
  const doseMatch = info.dose.match(/(\d+(?:\.\d+)?)/);
  if (doseMatch) {
    const num = parseFloat(doseMatch[1]);
    if (info.dose.includes('mcg')) {
      beginner = Math.round(num * 0.8);
      intermediate = Math.round(num);
      advanced = Math.round(num * 1.5);
    } else if (info.dose.includes('mg') && !info.dose.includes('mg/kg')) {
      beginner = Math.round(num * 800);
      intermediate = Math.round(num * 1000);
      advanced = Math.round(num * 1500);
    }
  }

  return {
    name,
    full_name: name,
    category: isExperimental ? "Experimental" : (info.category || "Other"),
    description: `${name} - ${info.dose}. ${info.status}.`,
    tldr: `${info.dose} • ${info.status}`,
    mechanism: "Data from research studies. Contact healthcare provider for more information.",
    benefits: [],
    dosage: {
      male: {
        beginner,
        intermediate,
        advanced,
        timing: [{ time: "As directed", description: "Follow guidelines" }],
        frequency: "As directed"
      },
      female: {
        beginner: Math.round(beginner * 0.6),
        intermediate: Math.round(intermediate * 0.6),
        advanced: Math.round(advanced * 0.6),
        timing: [{ time: "As directed", description: "Follow guidelines" }],
        frequency: "As directed"
      },
      female_dose_multiplier: 0.6
    },
    administration: [{ route: "Subcutaneous", storage: "Store as directed" }],
    side_effects: [],
    safety_rating: statusMap[info.status] || "moderate",
    evidence_level: evidenceMap[info.status] || "anecdotal",
    requires_prescription: info.status.includes("FDA"),
    sources: [{ pmid: "", title: info.status, confidence: "medium" }],
    cycle: { recommended_length_weeks: 12, min_break_weeks: 4 }
  };
}

// Add main peptides
for (const [name, info] of Object.entries(allPeptides)) {
  if (!db.peptides[name]) {
    db.peptides[name] = createPeptide(name, info, false);
  }
}

// Add experimental peptides
for (const pep of experimentalPeptides) {
  if (!db.peptides[pep.name]) {
    db.peptides[pep.name] = createPeptide(pep.name, { ...pep, status: "Experimental" }, true);
  }
}

// Update metadata
db.metadata.total_peptides = Object.keys(db.peptides).length;
db.metadata.last_updated = "2026-04-29";

// Add Experimental category
const hasExperimental = db.categories.find(c => c.id === "experimental");
if (!hasExperimental) {
  db.categories.push({
    id: "experimental",
    name: "Experimental",
    icon: "🧪",
    description: "Research compounds and experimental peptides",
    peptides: experimentalPeptides.map(p => p.name)
  });
}

// Add Weight Loss category if not exists
const hasWeightLoss = db.categories.find(c => c.id === "weight_loss");
if (!hasWeightLoss) {
  const weightLossPeptides = Object.keys(allPeptides).filter(k => allPeptides[k].category === "Weight Loss Medications");
  db.categories.push({
    id: "weight_loss",
    name: "Weight Loss Medications",
    icon: "⚖️",
    description: "FDA-approved weight loss medications",
    peptides: weightLossPeptides
  });
}

// Update category peptide lists
const peptideNames = Object.keys(db.peptides);
db.categories.forEach(cat => {
  cat.peptides = cat.peptides.filter(p => peptideNames.includes(p));
});

// Add new category peptides
Object.entries(allPeptides).forEach(([name, info]) => {
  const catName = info.category;
  const category = db.categories.find(c => c.name.includes(catName.split(" ")[0]));
  if (category && !category.peptides.includes(name)) {
    category.peptides.push(name);
  }
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Database updated. Total peptides: ${db.metadata.total_peptides}`);
console.log(`Categories: ${db.categories.length}`);