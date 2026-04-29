import SwiftUI

struct TrackerScreen: View {
    @EnvironmentObject var userStore: UserStore
    @EnvironmentObject var cycleStore: CycleStore
    @EnvironmentObject var logStore: LogStore
    
    @State private var selectedDate = Date()
    @State private var showLogEntry = false
    
    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter
    }()
    
    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                        Text("Tracker")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(ThemeColors().text)
                        
                        Text("Log your daily doses")
                            .font(.subheadline)
                            .foregroundColor(ThemeColors().textMuted)
                    }
                    .padding(.top, Theme.Spacing.md)
                    
                    // Active Cycle Card
                    if let activeCycle = cycleStore.activeCycle {
                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            Text("ACTIVE CYCLE")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(ThemeColors().textMuted)
                            
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(activeCycle.name)
                                        .font(.headline)
                                        .foregroundColor(ThemeColors().text)
                                    
                                    Text(activeCycle.peptides.joined(separator: ", "))
                                        .font(.caption)
                                        .foregroundColor(ThemeColors().textMuted)
                                }
                                
                                Spacer()
                                
                                VStack(alignment: .trailing) {
                                    Text("\(activeCycle.daysLeft)")
                                        .font(.title2)
                                        .fontWeight(.bold)
                                        .foregroundColor(Theme.Colors.primary)
                                    Text("days left")
                                        .font(.caption2)
                                        .foregroundColor(ThemeColors().textMuted)
                                }
                            }
                            .padding(Theme.Spacing.md)
                            .glassCard()
                        }
                    } else {
                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            HStack {
                                Image(systemImage: "exclamationmark.triangle")
                                    .foregroundColor(Theme.Colors.warning)
                                Text("No active cycle")
                                    .foregroundColor(ThemeColors().textMuted)
                            }
                            .padding(Theme.Spacing.md)
                            .frame(maxWidth: .infinity)
                            .glassCard()
                        }
                    }
                    
                    // Today's Log
                    VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                        Text("TODAY'S LOG")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(ThemeColors().textMuted)
                        
                        let todayLog = logStore.getLogForDate(dateFormatter.string(from: Date()))
                        
                        if let log = todayLog, !log.entries.isEmpty {
                            ForEach(log.entries) { entry in
                                LogEntryRow(entry: entry)
                            }
                        } else {
                            Text("No doses logged today")
                                .font(.subheadline)
                                .foregroundColor(ThemeColors().textMuted)
                                .frame(maxWidth: .infinity)
                                .padding(Theme.Spacing.lg)
                                .glassCard()
                        }
                    }
                    
                    // Quick Log Button
                    Button(action: { showLogEntry = true }) {
                        HStack {
                            Image(systemImage: "plus.circle.fill")
                            Text("Log Dose")
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Theme.Spacing.md)
                        .background(Theme.Colors.primary)
                        .cornerRadius(Theme.CornerRadius.md)
                    }
                    
                    // History
                    VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                        Text("HISTORY")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(ThemeColors().textMuted)
                        
                        let sortedLogs = logStore.logs.sorted { $0.date > $1.date }
                        ForEach(sortedLogs.prefix(7)) { log in
                            HistoryRow(log: log)
                        }
                    }
                }
                .padding(Theme.Spacing.md)
                .padding(.bottom, Theme.Spacing.xxl)
            }
            .background(ThemeColors().background)
            .sheet(isPresented: $showLogEntry) {
                LogEntrySheet()
            }
        }
    }
}

struct LogEntryRow: View {
    let entry: LogEntry
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.peptide)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(ThemeColors().text)
                
                if let dose = entry.dose {
                    Text("\(Int(dose)) mcg")
                        .font(.caption)
                        .foregroundColor(ThemeColors().textMuted)
                }
            }
            
            Spacer()
            
            if entry.taken {
                Image(systemImage: "checkmark.circle.fill")
                    .foregroundColor(Theme.Colors.success)
            } else if entry.skipped == true {
                Image(systemImage: "xmark.circle.fill")
                    .foregroundColor(Theme.Colors.error)
            }
            
            if let time = entry.time {
                Text(time)
                    .font(.caption)
                    .foregroundColor(ThemeColors().textMuted)
            }
        }
        .padding(Theme.Spacing.md)
        .glassCard()
    }
}

struct HistoryRow: View {
    let log: LogEntry
    
    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE, MMM d"
        return formatter
    }()
    
    var body: some View {
        HStack {
            Text(dateFormatter.string(from: dateFormatter.date(from: log.date) ?? Date()))
                .font(.subheadline)
                .foregroundColor(ThemeColors().text)
            
            Spacer()
            
            Text("\(log.entries.count) doses")
                .font(.caption)
                .foregroundColor(ThemeColors().textMuted)
        }
        .padding(Theme.Spacing.sm)
        .background(ThemeColors().surface)
        .cornerRadius(Theme.CornerRadius.sm)
    }
}

struct LogEntrySheet: View {
    @EnvironmentObject var userStore: UserStore
    @EnvironmentObject var logStore: LogStore
    @Environment(\.dismiss) var dismiss
    
    @State private var selectedPeptide: String = ""
    @State private var doseText: String = ""
    @State private var taken = true
    
    private let peptides = DatabaseLoader.shared.getAllPeptides()
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Peptide") {
                    Picker("Select Peptide", selection: $selectedPeptide) {
                        Text("Select...").tag("")
                        ForEach(peptides.prefix(10)) { peptide in
                            Text(peptide.name).tag(peptide.name)
                        }
                    }
                }
                
                Section("Dose (mcg)") {
                    TextField("e.g., 500", text: $doseText)
                        .keyboardType(.numberPad)
                }
                
                Section("Status") {
                    Picker("Did you take it?", selection: $taken) {
                        Text("Yes").tag(true)
                        Text("No").tag(false)
                    }
                    .pickerStyle(.segmented)
                }
            }
            .navigationTitle("Log Dose")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { saveLog() }
                        .disabled(selectedPeptide.isEmpty || doseText.isEmpty)
                }
            }
        }
    }
    
    func saveLog() {
        let entry = LogEntry(
            id: UUID().uuidString,
            peptide: selectedPeptide,
            dose: Double(doseText),
            taken: taken,
            skipped: !taken,
            time: DateFormatter().string(from: Date()),
            site: nil,
            notes: nil
        )
        
        let dateStr = {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            return formatter.string(from: Date())
        }()
        
        logStore.addEntry(dateStr, entry)
        dismiss()
    }
}

#Preview {
    TrackerScreen()
        .environmentObject(UserStore())
        .environmentObject(CycleStore())
        .environmentObject(LogStore())
}