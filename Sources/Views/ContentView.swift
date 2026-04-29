import SwiftUI

struct ContentView: View {
    @EnvironmentObject var userStore: UserStore
    @State private var selectedTab = 0
    
    var body: some View {
        Group {
            if !userStore.hasPassedAgeGate || !userStore.hasAcceptedDisclaimer {
                DisclaimerView()
            } else {
                TabView(selection: $selectedTab) {
                    HomeScreen()
                        .tabItem {
                            Label("Home", systemImage: "house.fill")
                        }
                        .tag(0)
                    
                    EncyclopediaScreen()
                        .tabItem {
                            Label("Peptides", systemImage: "flask.fill")
                        }
                        .tag(1)
                    
                    TrackerScreen()
                        .tabItem {
                            Label("Tracker", systemImage: "chart.bar.fill")
                        }
                        .tag(2)
                    
                    SettingsScreen()
                        .tabItem {
                            Label("Settings", systemImage: "gearshape.fill")
                        }
                        .tag(3)
                }
                .tint(Theme.Colors.primary)
            }
        }
        .animation(.easeInOut(duration: 0.3), value: userStore.hasPassedAgeGate)
    }
}

struct DisclaimerView: View {
    @EnvironmentObject var userStore: UserStore
    
    var body: some View {
        ZStack {
            ThemeColors().background
                .ignoresSafeArea()
            
            VStack(spacing: Theme.Spacing.xl) {
                Spacer()
                
                Text("⚠️")
                    .font(.system(size: 60))
                
                Text("RESEARCH USE ONLY")
                    .font(.system(size: 28, weight: .black, design: .default))
                    .foregroundColor(ThemeColors().text)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                Text("This app contains information about research chemicals. Not medical advice.\n\nConsult a healthcare professional before use.")
                    .font(.body)
                    .foregroundColor(ThemeColors().textMuted)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, Theme.Spacing.xl)
                
                Spacer()
                
                Button(action: {
                    userStore.passAgeGate()
                    userStore.acceptDisclaimer()
                }) {
                    Text("I AGREE - I AM 21+")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Theme.Spacing.md)
                        .background(Theme.Colors.primary)
                        .cornerRadius(Theme.CornerRadius.md)
                }
                .padding(.horizontal, Theme.Spacing.xl)
                
                Spacer()
                    .frame(height: Theme.Spacing.xxl)
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(UserStore())
        .environmentObject(CycleStore())
        .environmentObject(LogStore())
}