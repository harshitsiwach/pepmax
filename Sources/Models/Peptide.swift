import Foundation

struct Peptide: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let fullName: String?
    let category: String
    let description: String
    let tldr: String
    let mechanism: String
    let benefits: [Benefit]
    let dosage: DosageInfo
    let administration: [Administration]
    let sideEffects: [SideEffect]
    let contraindications: [String]?
    let legal: LegalStatus?
    let safetyRating: String
    let halfLife: String?
    let cycle: CycleInfo
    let stacks: Stacks?
    let sources: [Source]?
    let popularityScore: Int?
    let evidenceLevel: String
    let requiresPrescription: Bool
    let lastUpdated: String?
    
    var isExperimental: Bool {
        return category == "Experimental" || evidenceLevel == "animal" || evidenceLevel == "anecdotal"
    }
    
    enum CodingKeys: String, CodingKey {
        case id = "name"
        case name, fullName, category, description, tldr, mechanism
        case benefits, dosage, administration, sideEffects, contraindications
        case legal, safetyRating, halfLife, cycle, stacks, sources
        case popularityScore, evidenceLevel, requiresPrescription, lastUpdated
    }
    
    var safetyRatingColor: String {
        switch safetyRating {
        case "excellent": return "#00FF87"
        case "good": return "#4A90D9"
        case "moderate": return "#FFB800"
        case "high-risk": return "#FF2D55"
        default: return "#666666"
        }
    }
    
    var safetyRatingLabel: String {
        switch safetyRating {
        case "excellent": return "Excellent"
        case "good": return "Good"
        case "moderate": return "Moderate"
        case "high-risk": return "High Risk"
        default: return safetyRating
        }
    }
}

struct Benefit: Codable, Hashable {
    let benefit: String
    let evidence: String
}

struct DosageInfo: Codable, Hashable {
    let male: DosageData
    let female: DosageData
    let femaleDoseMultiplier: Double
    
    enum CodingKeys: String, CodingKey {
        case male, female
        case femaleDoseMultiplier = "female_dose_multiplier"
    }
}

struct DosageData: Codable, Hashable {
    let beginner: Int
    let intermediate: Int
    let advanced: Int
    let timing: [DosageTiming]
    let frequency: String
}

struct DosageTiming: Codable, Hashable {
    let time: String
    let description: String
}

struct Administration: Codable, Hashable {
    let route: String
    let storage: String
    let reconstitution: String?
}

struct SideEffect: Codable, Hashable {
    let effect: String
    let severity: String
    let frequency: String?
}

struct LegalStatus: Codable, Hashable {
    let us: LegalCountry?
    let eu: LegalCountry?
    let uk: LegalCountry?
    let ca: LegalCountry?
}

struct LegalCountry: Codable, Hashable {
    let status: String
    let note: String?
}

struct CycleInfo: Codable, Hashable {
    let recommendedLengthWeeks: Int
    let minBreakWeeks: Int
    let maxOnTimeWeeks: Int?
    
    enum CodingKeys: String, CodingKey {
        case recommendedLengthWeeks = "recommended_length_weeks"
        case minBreakWeeks = "min_break_weeks"
        case maxOnTimeWeeks = "max_on_time_weeks"
    }
}

struct Stacks: Codable, Hashable {
    let goodWith: [StackInfo]?
    let avoidWith: [StackConflict]?
    
    enum CodingKeys: String, CodingKey {
        case goodWith = "good_with"
        case avoidWith = "avoid_with"
    }
}

struct StackInfo: Codable, Hashable {
    let peptide: String
    let level: String
    let reason: String
}

struct StackConflict: Codable, Hashable {
    let peptide: String
    let severity: String
    let reason: String
}

struct Source: Codable, Hashable {
    let pmid: String
    let title: String
    let url: String?
    let confidence: String?
}

struct Category: Identifiable, Codable {
    let id: String
    let name: String
    let icon: String
    let description: String
    let peptides: [String]
}

struct Database: Codable {
    let metadata: DatabaseMetadata
    let categories: [Category]
    let peptides: [String: Peptide]
}

struct DatabaseMetadata: Codable {
    let appName: String
    let version: String
    let totalPeptides: Int
    let categories: Int
    let lastUpdated: String
    let disclaimer: String
    
    enum CodingKeys: String, CodingKey {
        case appName = "app_name"
        case totalPeptides = "total_peptides"
        case lastUpdated = "last_updated"
    }
}