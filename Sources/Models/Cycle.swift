import Foundation

struct Cycle: Identifiable, Codable {
    let id: String
    var name: String
    var peptides: [String]
    var startDate: Date
    var durationWeeks: Int
    var breakWeeks: Int
    var frequency: String
    var notes: String?
    var isActive: Bool
    
    var endDate: Date {
        Calendar.current.date(byAdding: .day, value: durationWeeks * 7, to: startDate) ?? startDate
    }
    
    var daysLeft: Int {
        let days = Calendar.current.dateComponents([.day], from: Date(), to: endDate).day ?? 0
        return max(0, days)
    }
    
    var progress: Double {
        let total = durationWeeks * 7
        let elapsed = total - daysLeft
        return min(1.0, max(0, Double(elapsed) / Double(total)))
    }
}

class CycleStore: ObservableObject {
    @Published var cycles: [Cycle] = []
    @Published var activeCycle: Cycle?
    
    private let userDefaults = UserDefaults.standard
    private let storageKey = "pepmax_cycles"
    
    init() {
        loadFromStorage()
    }
    
    func loadFromStorage() {
        if let data = userDefaults.data(forKey: storageKey),
           let decoded = try? JSONDecoder().decode(CycleStorage.self, from: data) {
            cycles = decoded.cycles
            activeCycle = decoded.activeCycle
        }
    }
    
    func saveToStorage() {
        let storage = CycleStorage(cycles: cycles, activeCycle: activeCycle)
        if let data = try? JSONEncoder().encode(storage) {
            userDefaults.set(data, forKey: storageKey)
        }
    }
    
    func addCycle(_ cycle: Cycle) {
        cycles.append(cycle)
        activeCycle = cycle
        saveToStorage()
    }
    
    func updateCycle(_ cycle: Cycle) {
        if let index = cycles.firstIndex(where: { $0.id == cycle.id }) {
            cycles[index] = cycle
            if activeCycle?.id == cycle.id {
                activeCycle = cycle
            }
            saveToStorage()
        }
    }
    
    func deleteCycle(_ id: String) {
        cycles.removeAll { $0.id == id }
        if activeCycle?.id == id {
            activeCycle = nil
        }
        saveToStorage()
    }
    
    func endCycle(_ id: String) {
        if let index = cycles.firstIndex(where: { $0.id == id }) {
            cycles[index].isActive = false
            if activeCycle?.id == id {
                activeCycle = nil
            }
            saveToStorage()
        }
    }
}

struct CycleStorage: Codable {
    let cycles: [Cycle]
    let activeCycle: Cycle?
}