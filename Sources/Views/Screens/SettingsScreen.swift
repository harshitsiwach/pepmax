import SwiftUI

struct SettingsScreen: View {
    @EnvironmentObject var userStore: UserStore
    @EnvironmentObject var cycleStore: CycleStore
    @EnvironmentObject var logStore: LogStore
    
    @State private var showCountryPicker = false
    @State private var showResetAlert = false
    
    var body: some View {
        NavigationStack {
            Form {
                // Profile Section
                Section {
                    // Gender
                    Picker("Gender", selection: Binding(
                        get: { userStore.gender },
                        set: { userStore.setGender($0) }
                    )) {
                        ForEach(Gender.allCases, id: \.self) { gender in
                            Text(gender.label).tag(gender)
                        }
                    }
                    
                    // Weight
                    HStack {
                        Text("Weight")
                        Spacer()
                        TextField("70", value: Binding(
                            get: { userStore.weight },
                            set: { userStore.setWeight($0) }
                        ), format: .number)
                        .keyboardType(.decimalPad)
                        .frame(width: 60)
                        .multilineTextAlignment(.trailing)
                        
                        Text(userStore.unitSystem == .metric ? "kg" : "lbs")
                            .foregroundColor(ThemeColors().textMuted)
                    }
                    
                    // Unit Toggle
                    Picker("Units", selection: Binding(
                        get: { userStore.unitSystem },
                        set: { userStore.setUnitSystem($0) }
                    )) {
                        Text("Metric (kg)").tag(UnitSystem.metric)
                        Text("Imperial (lbs)").tag(UnitSystem.imperial)
                    }
                    
                    // Country
                    Button(action: { showCountryPicker.toggle() }) {
                        HStack {
                            Text("Country (Legal Filter)")
                            Spacer()
                            Text(userStore.country)
                                .foregroundColor(ThemeColors().textMuted)
                        }
                    }
                } header: {
                    Text("Profile")
                }
                
                // App Settings
                Section {
                    Toggle("Notifications", isOn: Binding(
                        get: { userStore.notifications },
                        set: { userStore.setNotifications($0) }
                    ))
                    
                    Toggle("Dark Mode", isOn: Binding(
                        get: { userStore.darkMode },
                        set: { userStore.setDarkMode($0) }
                    ))
                } header: {
                    Text("App")
                }
                
                // Disclaimer
                Section {
                    Button("Re-accept Disclaimer") {
                        userStore.passAgeGate()
                        userStore.acceptDisclaimer()
                    }
                } header: {
                    Text("Legal")
                } footer: {
                    Text("For research purposes only. Not medical advice.")
                }
                
                // Data
                Section {
                    Button(role: .destructive, action: {
                        showResetAlert = true
                    }) {
                        Text("Reset All Data")
                    }
                } header: {
                    Text("Data")
                } footer: {
                    Text("This will delete all your cycles and logs.")
                }
                
                // About
                Section {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(ThemeColors().textMuted)
                    }
                    
                    HStack {
                        Text("Peptides")
                        Spacer()
                        Text("\(DatabaseLoader.shared.getAllPeptides().count)")
                            .foregroundColor(ThemeColors().textMuted)
                    }
                } header: {
                    Text("About")
                }
            }
            .navigationTitle("Settings")
            .alert("Reset All Data?", isPresented: $showResetAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Reset", role: .destructive) {
                    resetData()
                }
            } message: {
                Text("This will permanently delete all your cycles and logs.")
            }
            .sheet(isPresented: $showCountryPicker) {
                CountryPickerView(selectedCountry: Binding(
                    get: { userStore.country },
                    set: { userStore.setCountry($0) }
                ))
            }
        }
    }
    
    func resetData() {
        // Clear all data
        UserDefaults.standard.removeObject(forKey: "pepmax_user")
        UserDefaults.standard.removeObject(forKey: "pepmax_cycles")
        UserDefaults.standard.removeObject(forKey: "pepmax_logs")
        
        // Reset stores
        cycleStore.cycles = []
        cycleStore.activeCycle = nil
        logStore.logs = []
        
        userStore.loadFromStorage()
    }
}

struct CountryPickerView: View {
    @Binding var selectedCountry: String
    @Environment(\.dismiss) var dismiss
    
    let countries = [
        ("US", "United States"),
        ("UK", "United Kingdom"),
        ("CA", "Canada"),
        ("AU", "Australia"),
        ("DE", "Germany"),
        ("FR", "France"),
        ("EU", "European Union")
    ]
    
    var body: some View {
        NavigationStack {
            List(countries, id: \.0) { code, name in
                Button(action: {
                    selectedCountry = code
                    dismiss()
                }) {
                    HStack {
                        Text(name)
                            .foregroundColor(ThemeColors().text)
                        Spacer()
                        if selectedCountry == code {
                            Image(systemImage: "checkmark")
                                .foregroundColor(Theme.Colors.primary)
                        }
                    }
                }
            }
            .navigationTitle("Select Country")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}

#Preview {
    SettingsScreen()
        .environmentObject(UserStore())
        .environmentObject(CycleStore())
        .environmentObject(LogStore())
}