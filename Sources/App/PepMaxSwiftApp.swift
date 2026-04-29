import SwiftUI

@main
struct PepMaxSwiftApp: App {
    @StateObject private var userStore = UserStore()
    @StateObject private var cycleStore = CycleStore()
    @StateObject private var logStore = LogStore()
    
    init() {
        setupAppearance()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(userStore)
                .environmentObject(cycleStore)
                .environmentObject(logStore)
                .preferredColorScheme(userStore.darkMode ? .dark : .light)
        }
    }
    
    private func setupAppearance() {
        let tabBarAppearance = UITabBarAppearance()
        tabBarAppearance.configureWithDefaultBackground()
        tabBarAppearance.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.8)
        UITabBar.appearance().standardAppearance = tabBarAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabBarAppearance
    }
}