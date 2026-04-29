import SwiftUI

struct EncyclopediaScreen: View {
    @EnvironmentObject var userStore: UserStore
    @State private var searchText = ""
    @State private var selectedCategory: String?
    @State private var selectedPeptide: Peptide?
    
    private let peptides = DatabaseLoader.shared.getAllPeptides()
    private let categories = DatabaseLoader.shared.getAllCategories()
    
    var filteredPeptides: [Peptide] {
        var result = peptides
        
        if let category = selectedCategory {
            result = result.filter { $0.category == categories.first { $0.id == category }?.name }
        }
        
        if !searchText.isEmpty {
            result = result.filter {
                $0.name.localizedCaseInsensitiveContains(searchText) ||
                $0.description.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        return result
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search Bar
                HStack {
                    Image(systemImage: "magnifyingglass")
                        .foregroundColor(ThemeColors().textMuted)
                    
                    TextField("Search peptides...", text: $searchText)
                        .foregroundColor(ThemeColors().text)
                    
                    if !searchText.isEmpty {
                        Button(action: { searchText = "" }) {
                            Image(systemImage: "xmark.circle.fill")
                                .foregroundColor(ThemeColors().textMuted)
                        }
                    }
                }
                .padding(Theme.Spacing.sm)
                .background(ThemeColors().surface)
                .cornerRadius(Theme.CornerRadius.md)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                        .stroke(ThemeColors().border, lineWidth: 1)
                )
                .padding(.horizontal, Theme.Spacing.md)
                .padding(.top, Theme.Spacing.sm)
                
                // Category Chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Theme.Spacing.sm) {
                        CategoryChip(title: "All", isSelected: selectedCategory == nil) {
                            selectedCategory = nil
                        }
                        
                        ForEach(categories) { category in
                            CategoryChip(
                                title: category.name.components(separatedBy: " ").first ?? category.name,
                                icon: category.icon,
                                isSelected: selectedCategory == category.id
                            ) {
                                withAnimation(.spring(response: 0.3)) {
                                    selectedCategory = selectedCategory == category.id ? nil : category.id
                                }
                            }
                        }
                    }
                    .padding(.horizontal, Theme.Spacing.md)
                    .padding(.vertical, Theme.Spacing.md)
                }
                
                // Peptide List
                ScrollView(showsIndicators: false) {
                    LazyVStack(spacing: Theme.Spacing.md) {
                        ForEach(filteredPeptides) { peptide in
                            PeptideCardView(peptide: peptide)
                                .onTapGesture {
                                    selectedPeptide = peptide
                                }
                                .transition(.asymmetric(
                                    insertion: .opacity.combined(with: .scale(scale: 0.95)),
                                    removal: .opacity
                                ))
                        }
                    }
                    .padding(.horizontal, Theme.Spacing.md)
                    .padding(.bottom, Theme.Spacing.xxl)
                }
            }
            .background(ThemeColors().background)
            .navigationTitle("Encyclopedia")
            .navigationBarTitleDisplayMode(.large)
            .sheet(item: $selectedPeptide) { peptide in
                PeptideDetailView(peptide: peptide)
            }
        }
    }
}

struct CategoryChip: View {
    let title: String
    var icon: String?
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing.xs) {
                if let icon = icon {
                    Text(icon)
                        .font(.caption)
                }
                Text(title)
                    .font(.caption)
                    .fontWeight(.semibold)
            }
            .foregroundColor(isSelected ? .white : ThemeColors().text)
            .padding(.horizontal, Theme.Spacing.md)
            .padding(.vertical, Theme.Spacing.sm)
            .background(isSelected ? Theme.Colors.primary : ThemeColors().surface)
            .cornerRadius(Theme.CornerRadius.full)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                    .stroke(ThemeColors().border, lineWidth: 1)
            )
        }
    }
}

struct PeptideCardView: View {
    let peptide: Peptide
    
    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            // Warning for experimental
            if peptide.isExperimental {
                HStack(spacing: Theme.Spacing.xs) {
                    Text("⚠️")
                        .font(.caption)
                    Text("Experimental - Try at your own risk")
                        .font(.caption)
                        .fontWeight(.medium)
                }
                .foregroundColor(Theme.Colors.warning)
                .padding(.horizontal, Theme.Spacing.sm)
                .padding(.vertical, Theme.Spacing.xs)
                .background(Theme.Colors.warning.opacity(0.15))
                .cornerRadius(Theme.CornerRadius.sm)
            }
            
            // Header
            HStack {
                Text(peptide.name)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(ThemeColors().text)
                
                Spacer()
                
                Text(peptide.safetyRatingLabel)
                    .font(.caption2)
                    .fontWeight(.bold)
                    .padding(.horizontal, Theme.Spacing.sm)
                    .padding(.vertical, 2)
                    .background(Color(hex: peptide.safetyRatingColor).opacity(0.2))
                    .foregroundColor(Color(hex: peptide.safetyRatingColor))
                    .cornerRadius(Theme.CornerRadius.sm)
            }
            
            // Description
            Text(peptide.tldr)
                .font(.subheadline)
                .foregroundColor(ThemeColors().textMuted)
                .lineLimit(2)
            
            // Footer
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("DOSE")
                        .font(.caption2)
                        .foregroundColor(ThemeColors().textMuted)
                    Text("\(peptide.dosage.male.beginner)-\(peptide.dosage.male.advanced) mcg")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)
                }
                
                Spacer()
                
                Text(peptide.category)
                    .font(.caption2)
                    .foregroundColor(ThemeColors().textMuted)
            }
        }
        .padding(Theme.Spacing.md)
        .glassCard()
    }
}

struct PeptideDetailView: View {
    @EnvironmentObject var userStore: UserStore
    @Environment(\.dismiss) var dismiss
    let peptide: Peptide
    
    @State private var selectedLevel: ExperienceLevel = .intermediate
    
    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                        HStack {
                            Text(peptide.name)
                                .font(.system(size: 28, weight: .black))
                                .foregroundColor(ThemeColors().text)
                            
                            Spacer()
                            
                            if peptide.requiresPrescription {
                                Text("Rx")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundColor(Theme.Colors.warning)
                                    .padding(.horizontal, Theme.Spacing.sm)
                                    .padding(.vertical, 2)
                                    .background(Theme.Colors.warning.opacity(0.2))
                                    .cornerRadius(Theme.CornerRadius.sm)
                            }
                        }
                        
                        if let fullName = peptide.fullName {
                            Text(fullName)
                                .font(.subheadline)
                                .foregroundColor(ThemeColors().textMuted)
                        }
                        
                        HStack(spacing: Theme.Spacing.sm) {
                            Text(peptide.safetyRatingLabel)
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(Color(hex: peptide.safetyRatingColor))
                            
                            Text("•")
                                .foregroundColor(ThemeColors().textMuted)
                            
                            Text(peptide.category)
                                .font(.caption)
                                .foregroundColor(ThemeColors().textMuted)
                        }
                    }
                    
                    // TL;DR
                    VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                        Text("TL;DR")
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundColor(ThemeColors().textMuted)
                        
                        Text(peptide.description)
                            .font(.body)
                            .foregroundColor(ThemeColors().text)
                    }
                    .padding(Theme.Spacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .glassCard()
                    
                    // Dosage
                    VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                        Text("DOSAGE")
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundColor(ThemeColors().textMuted)
                        
                        // Level Selector
                        HStack(spacing: Theme.Spacing.xs) {
                            ForEach(ExperienceLevel.allCases, id: \.self) { level in
                                Button(action: {
                                    withAnimation(.spring(response: 0.3)) {
                                        selectedLevel = level
                                    }
                                }) {
                                    Text(level.rawValue.uppercased())
                                        .font(.caption)
                                        .fontWeight(.bold)
                                        .foregroundColor(selectedLevel == level ? .white : ThemeColors().textMuted)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, Theme.Spacing.sm)
                                        .background(selectedLevel == level ? Theme.Colors.primary : Color.clear)
                                        .cornerRadius(Theme.CornerRadius.sm)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: Theme.CornerRadius.sm)
                                                .stroke(ThemeColors().border, lineWidth: 1)
                                        )
                                }
                            }
                        }
                        
                        // Dose Display
                        HStack {
                            Text("Your dose:")
                                .font(.subheadline)
                                .foregroundColor(ThemeColors().textMuted)
                            
                            Spacer()
                            
                            Text("\(calculateDose()) mcg")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(Theme.Colors.primary)
                        }
                        .padding(Theme.Spacing.md)
                        .glassCard()
                        
                        if userStore.gender != .male {
                            HStack {
                                Text("Female (\(Int(peptide.dosage.femaleDoseMultiplier * 100))% of male):")
                                    .font(.caption)
                                    .foregroundColor(ThemeColors().textMuted)
                                
                                Spacer()
                                
                                Text("\(calculateDose(female: true)) mcg")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(Theme.Colors.primary)
                            }
                            .padding(Theme.Spacing.sm)
                            .background(Theme.Colors.primary.opacity(0.1))
                            .cornerRadius(Theme.CornerRadius.sm)
                        }
                        
                        // Timing
                        if let timing = peptide.dosage.male.timing.first {
                            HStack {
                                Text("TIMING")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundColor(ThemeColors().textMuted)
                                
                                Spacer()
                                
                                VStack(alignment: .trailing, spacing: 2) {
                                    Text(timing.time)
                                        .font(.subheadline)
                                        .fontWeight(.medium)
                                        .foregroundColor(ThemeColors().text)
                                    Text(timing.description)
                                        .font(.caption)
                                        .foregroundColor(ThemeColors().textMuted)
                                }
                            }
                        }
                    }
                    
                    // Benefits
                    if !peptide.benefits.isEmpty {
                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            Text("BENEFITS")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(ThemeColors().textMuted)
                            
                            ForEach(peptide.benefits, id: \.benefit) { benefit in
                                HStack {
                                    Text(benefit.benefit)
                                        .font(.subheadline)
                                        .foregroundColor(ThemeColors().text)
                                    
                                    Spacer()
                                    
                                    Text(benefit.evidence.uppercased())
                                        .font(.caption2)
                                        .fontWeight(.bold)
                                        .foregroundColor(benefit.evidence == "high" ? Theme.Colors.success : Theme.Colors.warning)
                                }
                                .padding(Theme.Spacing.sm)
                                .background(ThemeColors().surface)
                                .cornerRadius(Theme.CornerRadius.sm)
                            }
                        }
                    }
                    
                    // Cycle Info
                    VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                        Text("CYCLE PROTOCOL")
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundColor(ThemeColors().textMuted)
                        
                        HStack {
                            Text("Duration:")
                                .foregroundColor(ThemeColors().textMuted)
                            Spacer()
                            Text("\(peptide.cycle.recommendedLengthWeeks) weeks")
                                .fontWeight(.semibold)
                        }
                        
                        HStack {
                            Text("Break:")
                                .foregroundColor(ThemeColors().textMuted)
                            Spacer()
                            Text("\(peptide.cycle.minBreakWeeks) weeks")
                                .fontWeight(.semibold)
                        }
                    }
                    .padding(Theme.Spacing.md)
                    .glassCard()
                    
                    // Disclaimer
                    Text("For research purposes only. Not medical advice.")
                        .font(.caption)
                        .foregroundColor(ThemeColors().textMuted)
                        .frame(maxWidth: .infinity)
                        .padding(.bottom, Theme.Spacing.xxl)
                }
                .padding(Theme.Spacing.md)
            }
            .background(ThemeColors().background)
            .navigationTitle(peptide.name)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    func calculateDose(female: Bool = false) -> Int {
        let dosage = female ? peptide.dosage.female : peptide.dosage.male
        let baseDose: Int
        
        switch selectedLevel {
        case .beginner:
            baseDose = dosage.beginner
        case .intermediate:
            baseDose = dosage.intermediate
        case .advanced:
            baseDose = dosage.advanced
        }
        
        let weightMultiplier = userStore.weight / 70.0
        return Int(Double(baseDose) * weightMultiplier)
    }
}

#Preview {
    EncyclopediaScreen()
        .environmentObject(UserStore())
        .environmentObject(CycleStore())
        .environmentObject(LogStore())
}