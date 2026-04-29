import Foundation

class DatabaseLoader {
    static let shared = DatabaseLoader()
    
    private(set) var database: Database?
    private(set) var categories: [Category] = []
    private(set) var peptides: [Peptide] = []
    
    private init() {
        loadDatabase()
    }
    
    private func loadDatabase() {
        // For now, we'll create a simplified database
        // In production, this would load from JSON file
        createMockDatabase()
    }
    
    private func createMockDatabase() {
        categories = [
            Category(id: "healing_regenerative", name: "Healing & Regenerative", icon: "🩹", description: "Tissue repair, wound healing", peptides: ["BPC-157", "TB-500", "GHK-Cu"]),
            Category(id: "growth_hormone", name: "Growth Hormone", icon: "💪", description: "GH secretagogues", peptides: ["Ipamorelin", "Sermorelin", "CJC-1295", "GHRP-6"]),
            Category(id: "fat_loss", name: "Fat Loss & Metabolism", icon: "🔥", description: "Weight management", peptides: ["AOD-9604", "Semaglutide", "Tirzepatide"]),
            Category(id: "cognitive", name: "Cognitive & Nootropic", icon: "🧠", description: "Brain enhancement", peptides: ["Semax", "Selank", "Cerebrolysin"]),
            Category(id: "anti_aging", name: "Anti-Aging", icon: "⭐", description: "Longevity support", peptides: ["Epitalon", "Thymosin Alpha-1", "MOTS-c"]),
            Category(id: "sexual_health", name: "Sexual Health", icon: "❤️", description: "Libido & function", peptides: ["PT-141", "Oxytocin", "Bremelanotide"]),
            Category(id: "muscle_growth", name: "Muscle Growth", icon: "🏋️", description: "Performance", peptides: ["Follistatin", "IGF-1"]),
            Category(id: "experimental", name: "Experimental", icon: "🧪", description: "Research compounds", peptides: ["Test Compound A", "Test Compound B"])
        ]
        
        let samplePeptides = createSamplePeptides()
        peptides = samplePeptides
    }
    
    private func createSamplePeptides() -> [Peptide] {
        return [
            Peptide(
                id: "BPC-157",
                name: "BPC-157",
                fullName: "Body Protection Compound-157",
                category: "Healing & Regenerative",
                description: "Pentadecapeptide that promotes angiogenesis, tendon and ligament healing, and GI mucosal protection.",
                tldr: "Powerful healing peptide for tissue repair",
                mechanism: "Binds to growth hormone receptors and promotes upregulation of growth hormone receptors while decreasing inflammation.",
                benefits: [
                    Benefit(benefit: "Accelerated wound healing", evidence: "medium"),
                    Benefit(benefit: "Tendon/ligament repair", evidence: "high"),
                    Benefit(benefit: "Gut health protection", evidence: "medium")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 250, intermediate: 500, advanced: 1000,
                                    timing: [DosageTiming(time: "Once daily", description: "Morning or evening")],
                                    frequency: "Daily"),
                    female: DosageData(beginner: 150, intermediate: 300, advanced: 600,
                                      timing: [DosageTiming(time: "Once daily", description: "Morning or evening")],
                                      frequency: "Daily"),
                    femaleDoseMultiplier: 0.6
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: nil)],
                sideEffects: [
                    SideEffect(effect: "Mild nausea", severity: "rare", frequency: "5%")
                ],
                contraindications: nil,
                legal: nil,
                safetyRating: "good",
                halfLife: "4-6 hours",
                cycle: CycleInfo(recommendedLengthWeeks: 8, minBreakWeeks: 4, maxOnTimeWeeks: 12),
                stacks: nil,
                sources: nil,
                popularityScore: 10,
                evidenceLevel: "animal",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "TB-500",
                name: "TB-500",
                fullName: "Thymosin Beta-4",
                category: "Healing & Regenerative",
                description: "Regenerative peptide that promotes cell migration, angiogenesis, and tissue repair.",
                tldr: "Advanced tissue regeneration peptide",
                mechanism: "Promotes cell migration, upregulates actin, and promotes angiogenesis for faster healing.",
                benefits: [
                    Benefit(benefit: "Muscle healing", evidence: "high"),
                    Benefit(benefit: "Injury recovery", evidence: "medium"),
                    Benefit(benefit: "Anti-inflammatory", evidence: "medium")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 2000, intermediate: 4000, advanced: 5000,
                                    timing: [DosageTiming(time: "2x weekly", description: "Divide dose")],
                                    frequency: "2x per week"),
                    female: DosageData(beginner: 1200, intermediate: 2400, advanced: 3000,
                                      timing: [DosageTiming(time: "2x weekly", description: "Divide dose")],
                                      frequency: "2x per week"),
                    femaleDoseMultiplier: 0.6
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: "Reconstitute with sterile water")],
                sideEffects: [],
                contraindications: nil,
                legal: nil,
                safetyRating: "good",
                halfLife: "24-36 hours",
                cycle: CycleInfo(recommendedLengthWeeks: 8, minBreakWeeks: 4, maxOnTimeWeeks: 12),
                stacks: nil,
                sources: nil,
                popularityScore: 9,
                evidenceLevel: "animal",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Ipamorelin",
                name: "Ipamorelin",
                fullName: "Ipamorelin",
                category: "Growth Hormone",
                description: "Selective GH secretagogue that stimulates GH release without significant appetite increase.",
                tldr: "Clean GH boost without hunger",
                mechanism: "Selectively binds to GHRP receptors, stimulating natural GH release from the pituitary.",
                benefits: [
                    Benefit(benefit: "Increased GH", evidence: "high"),
                    Benefit(benefit: "Fat loss", evidence: "medium"),
                    Benefit(benefit: "Muscle growth", evidence: "medium")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 100, intermediate: 200, advanced: 300,
                                    timing: [DosageTiming(time: "1-2x daily", description: "Before bed")],
                                    frequency: "Daily"),
                    female: DosageData(beginner: 50, intermediate: 100, advanced: 150,
                                      timing: [DosageTiming(time: "1-2x daily", description: "Before bed")],
                                      frequency: "Daily"),
                    femaleDoseMultiplier: 0.5
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: nil)],
                sideEffects: [
                    SideEffect(effect: "Tingling", severity: "common", frequency: "20%"),
                    SideEffect(effect: "Water retention", severity: "rare", frequency: "5%")
                ],
                contraindications: nil,
                legal: nil,
                safetyRating: "good",
                halfLife: "2-3 hours",
                cycle: CycleInfo(recommendedLengthWeeks: 12, minBreakWeeks: 4, maxOnTimeWeeks: 16),
                stacks: nil,
                sources: nil,
                popularityScore: 8,
                evidenceLevel: "human_trial",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Semaglutide",
                name: "Semaglutide",
                fullName: "GLP-1 Receptor Agonist",
                category: "Fat Loss & Metabolism",
                description: "FDA-approved GLP-1 agonist for weight loss and diabetes management.",
                tldr: "Most powerful weight loss medication",
                mechanism: "GLP-1 receptor agonist that reduces appetite, slows gastric emptying, and improves insulin sensitivity.",
                benefits: [
                    Benefit(benefit: "20%+ weight loss", evidence: "high"),
                    Benefit(benefit: "Improved blood sugar", evidence: "high"),
                    Benefit(benefit: "Reduced cardiovascular risk", evidence: "high")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 250, intermediate: 1000, advanced: 2400,
                                    timing: [DosageTiming(time: "Weekly", description: "Once weekly injection")],
                                    frequency: "Weekly"),
                    female: DosageData(beginner: 250, intermediate: 1000, advanced: 2400,
                                      timing: [DosageTiming(time: "Weekly", description: "Once weekly injection")],
                                      frequency: "Weekly"),
                    femaleDoseMultiplier: 1.0
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: nil)],
                sideEffects: [
                    SideEffect(effect: "Nausea", severity: "common", frequency: "30%"),
                    SideEffect(effect: "Vomiting", severity: "rare", frequency: "10%"),
                    SideEffect(effect: "Pancreatitis", severity: "serious", frequency: "rare")
                ],
                contraindications: ["History of pancreatitis", "Pregnancy"],
                legal: nil,
                safetyRating: "excellent",
                halfLife: "165 hours",
                cycle: CycleInfo(recommendedLengthWeeks: 52, minBreakWeeks: 4, maxOnTimeWeeks: nil),
                stacks: nil,
                sources: nil,
                popularityScore: 10,
                evidenceLevel: "clinical",
                requiresPrescription: true,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Tirzepatide",
                name: "Tirzepatide",
                fullName: "Dual GLP-1/GIP Agonist",
                category: "Fat Loss & Metabolism",
                description: "Most powerful weight loss peptide - dual GLP-1 and GIP receptor agonist.",
                tldr: "Next-gen dual weight loss",
                mechanism: "Activates both GLP-1 and GIP receptors for synergistic metabolic benefits.",
                benefits: [
                    Benefit(benefit: "22%+ weight loss", evidence: "high"),
                    Benefit(benefit: "Superior glycemic control", evidence: "high"),
                    Benefit(benefit: "Improved insulin sensitivity", evidence: "high")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 2500, intermediate: 5000, advanced: 15000,
                                    timing: [DosageTiming(time: "Weekly", description: "Once weekly")],
                                    frequency: "Weekly"),
                    female: DosageData(beginner: 2500, intermediate: 5000, advanced: 15000,
                                      timing: [DosageTiming(time: "Weekly", description: "Once weekly")],
                                      frequency: "Weekly"),
                    femaleDoseMultiplier: 1.0
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: nil)],
                sideEffects: [
                    SideEffect(effect: "Nausea", severity: "common", frequency: "35%"),
                    SideEffect(effect: "Diarrhea", severity: "common", frequency: "20%"),
                    SideEffect(effect: "Reduced appetite", severity: "common", frequency: "40%")
                ],
                contraindications: ["History of pancreatitis", "Pregnancy"],
                legal: nil,
                safetyRating: "excellent",
                halfLife: "116 hours",
                cycle: CycleInfo(recommendedLengthWeeks: 52, minBreakWeeks: 4, maxOnTimeWeeks: nil),
                stacks: nil,
                sources: nil,
                popularityScore: 10,
                evidenceLevel: "clinical",
                requiresPrescription: true,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Semax",
                name: "Semax",
                fullName: "Synthetic ACTH Analog",
                category: "Cognitive & Nootropic",
                description: "Russian nootropic peptide used for cognitive enhancement and neuroprotection.",
                tldr: "Brain boost from Russia",
                mechanism: "Modulates dopamine and serotonin levels, provides neuroprotective effects.",
                benefits: [
                    Benefit(benefit: "Cognitive enhancement", evidence: "high"),
                    Benefit(benefit: "Memory improvement", evidence: "medium"),
                    Benefit(benefit: "Stroke recovery", evidence: "medium")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 500, intermediate: 1000, advanced: 5000,
                                    timing: [DosageTiming(time: "Daily", description: "Morning")],
                                    frequency: "Daily"),
                    female: DosageData(beginner: 500, intermediate: 1000, advanced: 5000,
                                      timing: [DosageTiming(time: "Daily", description: "Morning")],
                                      frequency: "Daily"),
                    femaleDoseMultiplier: 1.0
                ),
                administration: [Administration(route: "Nasal", storage: "Room temperature", reconstitution: nil)],
                sideEffects: [],
                contraindications: nil,
                legal: nil,
                safetyRating: "good",
                halfLife: "20-30 minutes",
                cycle: CycleInfo(recommendedLengthWeeks: 4, minBreakWeeks: 2, maxOnTimeWeeks: 8),
                stacks: nil,
                sources: nil,
                popularityScore: 7,
                evidenceLevel: "animal",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Epitalon",
                name: "Epitalon",
                fullName: "Epithalamin Synthetic Analog",
                category: "Anti-Aging",
                description: "Russian anti-aging peptide that increases telomerase activity.",
                tldr: "Telomere lengthener",
                mechanism: "Stimulates telomerase activity, increases pineal gland function, modulates melatonin.",
                benefits: [
                    Benefit(benefit: "Telomere maintenance", evidence: "medium"),
                    Benefit(benefit: "Improved sleep", evidence: "medium"),
                    Benefit(benefit: "Immune support", evidence: "medium")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 1000, intermediate: 3000, advanced: 5000,
                                    timing: [DosageTiming(time: "Daily", description: "10-20 day course")],
                                    frequency: "Daily"),
                    female: DosageData(beginner: 1000, intermediate: 3000, advanced: 5000,
                                      timing: [DosageTiming(time: "Daily", description: "10-20 day course")],
                                      frequency: "Daily"),
                    femaleDoseMultiplier: 1.0
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: nil)],
                sideEffects: [],
                contraindications: nil,
                legal: nil,
                safetyRating: "good",
                halfLife: "Short",
                cycle: CycleInfo(recommendedLengthWeeks: 4, minBreakWeeks: 8, maxOnTimeWeeks: nil),
                stacks: nil,
                sources: nil,
                popularityScore: 6,
                evidenceLevel: "animal",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Follistatin",
                name: "Follistatin",
                fullName: "Myostatin Inhibitor",
                category: "Muscle Growth",
                description: "Powerful myostatin inhibitor that blocks muscle growth limits.",
                tldr: "Remove the muscle growth brake",
                mechanism: "Binds and neutralizes myostatin, removing the brake on muscle growth.",
                benefits: [
                    Benefit(benefit: "Muscle growth", evidence: "medium"),
                    Benefit(benefit: "Improved recovery", evidence: "medium"),
                    Benefit(benefit: "Tendon strengthening", evidence: "low")
                ],
                dosage: DosageInfo(
                    male: DosageData(beginner: 100, intermediate: 200, advanced: 500,
                                    timing: [DosageTiming(time: "Weekly", description: "1-2x weekly")],
                                    frequency: "Weekly"),
                    female: DosageData(beginner: 100, intermediate: 200, advanced: 500,
                                      timing: [DosageTiming(time: "Weekly", description: "1-2x weekly")],
                                      frequency: "Weekly"),
                    femaleDoseMultiplier: 1.0
                ),
                administration: [Administration(route: "SubQ", storage: "Refrigerate", reconstitution: nil)],
                sideEffects: [
                    SideEffect(effect: "Fluid retention", severity: "common", frequency: "30%"),
                    SideEffect(effect: "Increased appetite", severity: "common", frequency: "25%")
                ],
                contraindications: nil,
                legal: nil,
                safetyRating: "moderate",
                halfLife: "Long",
                cycle: CycleInfo(recommendedLengthWeeks: 8, minBreakWeeks: 4, maxOnTimeWeeks: nil),
                stacks: nil,
                sources: nil,
                popularityScore: 7,
                evidenceLevel: "animal",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            ),
            Peptide(
                id: "Experimental-1",
                name: "Test Compound A",
                fullName: "Research Compound A",
                category: "Experimental",
                description: "Experimental peptide with limited human data.",
                tldr: "Experimental - try at own risk",
                mechanism: "Limited research data available.",
                benefits: [],
                dosage: DosageInfo(
                    male: DosageData(beginner: 100, intermediate: 200, advanced: 500,
                                    timing: [DosageTiming(time: "As directed", description: "Follow guidelines")],
                                    frequency: "As directed"),
                    female: DosageData(beginner: 60, intermediate: 120, advanced: 300,
                                      timing: [DosageTiming(time: "As directed", description: "Follow guidelines")],
                                      frequency: "As directed"),
                    femaleDoseMultiplier: 0.6
                ),
                administration: [Administration(route: "SubQ", storage: "Store as directed", reconstitution: nil)],
                sideEffects: [],
                contraindications: nil,
                legal: nil,
                safetyRating: "moderate",
                halfLife: "Unknown",
                cycle: CycleInfo(recommendedLengthWeeks: 12, minBreakWeeks: 4, maxOnTimeWeeks: nil),
                stacks: nil,
                sources: nil,
                popularityScore: 1,
                evidenceLevel: "anecdotal",
                requiresPrescription: false,
                lastUpdated: "2025-12-31"
            )
        ]
    }
    
    func getAllPeptides() -> [Peptide] {
        return peptides
    }
    
    func getPeptide(byId id: String) -> Peptide? {
        return peptides.first { $0.id == id }
    }
    
    func getAllCategories() -> [Category] {
        return categories
    }
    
    func getPeptidesByCategory(_ categoryId: String) -> [Peptide] {
        guard let category = categories.first(where: { $0.id == categoryId }) else {
            return []
        }
        return category.peptides.compactMap { getPeptide(byId: $0) }
    }
    
    func searchPeptides(_ query: String) -> [Peptide] {
        if query.isEmpty { return peptides }
        let lowercased = query.lowercased()
        return peptides.filter {
            $0.name.lowercased().contains(lowercased) ||
            $0.description.lowercased().contains(lowercased) ||
            $0.category.lowercased().contains(lowercased)
        }
    }
    
    func calculateDose(peptide: Peptide, gender: Gender, weight: Double, level: ExperienceLevel) -> Int {
        let dosage = gender == .male ? peptide.dosage.male : peptide.dosage.female
        
        let baseDose: Int
        switch level {
        case .beginner:
            baseDose = dosage.beginner
        case .intermediate:
            baseDose = dosage.intermediate
        case .advanced:
            baseDose = dosage.advanced
        }
        
        // Weight adjustment (baseline 70kg)
        let weightMultiplier = weight / 70.0
        return Int(Double(baseDose) * weightMultiplier)
    }
}

enum ExperienceLevel: String, CaseIterable {
    case beginner = "Beginner"
    case intermediate = "Intermediate"
    case advanced = "Advanced"
}