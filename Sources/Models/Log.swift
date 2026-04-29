import Foundation

struct DailyLog: Identifiable, Codable {
    let id: String
    var date: String
    var entries: [LogEntry]
    var metrics: LogMetrics?
    var notes: String?
}

struct LogEntry: Identifiable, Codable {
    let id: String
    var peptide: String
    var dose: Double?
    var taken: Bool
    var skipped: Bool?
    var time: String?
    var site: String?
    var notes: String?
}

struct LogMetrics: Codable {
    var energy: Int?
    var sleep: Int?
    var mood: Int?
    var hunger: Int?
    var strength: Int?
}

class LogStore: ObservableObject {
    @Published var logs: [DailyLog] = []
    
    private let userDefaults = UserDefaults.standard
    private let storageKey = "pepmax_logs"
    
    init() {
        loadFromStorage()
    }
    
    func loadFromStorage() {
        if let data = userDefaults.data(forKey: storageKey),
           let decoded = try? JSONDecoder().decode(LogStorage.self, from: data) {
            logs = decoded.logs
        }
    }
    
    func saveToStorage() {
        let storage = LogStorage(logs: logs)
        if let data = try? JSONEncoder().encode(storage) {
            userDefaults.set(data, forKey: storageKey)
        }
    }
    
    func getLogForDate(_ date: String) -> DailyLog? {
        return logs.first { $0.date == date }
    }
    
    func addLog(_ log: DailyLog) {
        if let index = logs.firstIndex(where: { $0.date == log.date }) {
            logs[index] = log
        } else {
            logs.append(log)
        }
        saveToStorage()
    }
    
    func addEntry(_ date: String, _ entry: LogEntry) {
        if let index = logs.firstIndex(where: { $0.date == date }) {
            logs[index].entries.append(entry)
        } else {
            let newLog = DailyLog(id: date, date: date, entries: [entry])
            logs.append(newLog)
        }
        saveToStorage()
    }
}

struct LogStorage: Codable {
    let logs: [DailyLog]
}