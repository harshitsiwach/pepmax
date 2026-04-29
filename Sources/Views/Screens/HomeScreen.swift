import SwiftUI

struct HomeScreen: View {
    @EnvironmentObject var userStore: UserStore
    @EnvironmentObject var cycleStore: CycleStore
    @State private var selectedGoal: String?
    @State private var navigateToEncyclopedia = false
    
    private let categories = DatabaseLoader.shared.getAllCategories()
    
    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                        Text("PEPMAX")
                            .font(.system(size: 36, weight: .black))
                            .foregroundColor(Theme.Colors.primary)
                        
                        Text("Maxxing your peptides")
                            .font(.subheadline)
                            .foregroundColor(ThemeColors().textMuted)
                    }
                    .padding(.top, Theme.Spacing.lg)
                    .padding(.horizontal, Theme.Spacing.md)
                    
                    // Gender Toggle
                    VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                        Text("YOUR PROFILE")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(ThemeColors().textMuted)
                            .padding(.horizontal, Theme.Spacing.md)
                        
                        GenderToggle()
                    }
                    .padding(.horizontal, Theme.Spacing.md)
                    
                    // Active Cycle
                    if let activeCycle = cycleStore.activeCycle {
                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            Text("ACTIVE CYCLE")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(ThemeColors().textMuted)
                            
                            CycleCard(cycle: activeCycle)
                        }
                        .padding(.horizontal, Theme.Spacing.md)
                    }
                    
                    // Goals Section
                    VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                        Text("What's your goal?")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(ThemeColors().text)
                            .padding(.horizontal, Theme.Spacing.md)
                        
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: Theme.Spacing.md) {
                            ForEach(categories.prefix(6)) { category in
                                GoalCard(category: category)
                                    .onTapGesture {
                                        selectedGoal = category.id
                                        navigateToEncyclopedia = true
                                    }
                            }
                        }
                        .padding(.horizontal, Theme.Spacing.md)
                    }
                    
                    // Browse All Button
                    Button(action: {
                        navigateToEncyclopedia = true
                    }) {
                        HStack {
                            Text("Browse All Peptides")
                                .fontWeight(.semibold)
                            Image(systemImage: "arrow.right")
                        }
                        .foregroundColor(ThemeColors().text)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Theme.Spacing.md)
                        .background(ThemeColors().surface)
                        .cornerRadius(Theme.CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                .stroke(ThemeColors().border, lineWidth: 1)
                        )
                    }
                    .padding(.horizontal, Theme.Spacing.md)
                    .padding(.bottom, Theme.Spacing.xxl)
                }
            }
            .background(ThemeColors().background)
            .navigationDestination(isPresented: $navigateToEncyclopedia) {
                EncyclopediaScreen()
            }
        }
    }
}

struct GenderToggle: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        HStack(spacing: Theme.Spacing.xs) {
            ForEach(Gender.allCases, id: \.self) { gender in
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        userStore.setGender(gender)
                    }
                }) {
                    Text(gender.label)
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(userStore.gender == gender ? .white : ThemeColors().textMuted)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Theme.Spacing.sm)
                        .background(userStore.gender == gender ? Theme.Colors.primary : Color.clear)
                        .cornerRadius(Theme.CornerRadius.sm)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.sm)
                                .stroke(ThemeColors().border, lineWidth: 1)
                        )
                }
            }
        }
        .glassCard()
        .padding(4)
    }
}

struct GoalCard: View {
    let category: Category
    
    var body: some View {
        VStack(spacing: Theme.Spacing.sm) {
            Text(category.icon)
                .font(.system(size: 32))
            
            Text(category.name)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(ThemeColors().text)
                .multilineTextAlignment(.center)
            
            Text("\(category.peptides.count) peptides")
                .font(.caption2)
                .foregroundColor(ThemeColors().textMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(Theme.Spacing.md)
        .glassCard()
    }
}

struct CycleCard: View {
    let cycle: Cycle
    
    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.md) {
            HStack {
                Text(cycle.name)
                    .font(.headline)
                    .foregroundColor(ThemeColors().text)
                
                Spacer()
                
                Text("ACTIVE")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .foregroundColor(Theme.Colors.primary)
                    .padding(.horizontal, Theme.Spacing.sm)
                    .padding(.vertical, 2)
                    .background(Theme.Colors.primary.opacity(0.2))
                    .cornerRadius(Theme.CornerRadius.sm)
            }
            
            // Progress Bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(ThemeColors().surfaceElevated)
                        .frame(height: 8)
                    
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Theme.Colors.primary)
                        .frame(width: geometry.size.width * cycle.progress, height: 8)
                }
            }
            .frame(height: 8)
            
            HStack {
                Text("Days left: \(cycle.daysLeft)")
                    .font(.caption)
                    .foregroundColor(ThemeColors().textMuted)
                
                Spacer()
                
                Text("\(Int(cycle.progress * 100))%")
                    .font(.caption)
                    .foregroundColor(ThemeColors().textMuted)
            }
        }
        .padding(Theme.Spacing.md)
        .glassCard()
    }
}

#Preview {
    HomeScreen()
        .environmentObject(UserStore())
        .environmentObject(CycleStore())
        .environmentObject(LogStore())
}