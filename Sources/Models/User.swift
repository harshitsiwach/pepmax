import Foundation
import SwiftUI

enum Gender: String, Codable, CaseIterable {
    case male = "male"
    case female = "female"
    case other = "other"
    
    var label: String {
        switch self {
        case .male: return "MALE"
        case .female: return "FEMALE"
        case .other: return "OTHER"
        }
    }
}

enum UnitSystem: String, Codable {
    case metric
    case imperial
}

struct UserSettings: Codable {
    var gender: Gender
    var weight: Double
    var unitSystem: UnitSystem
    var country: String
    var hasAcceptedDisclaimer: Bool
    var hasPassedAgeGate: Bool
    var notifications: Bool
    var darkMode: Bool
    
    static let `default` = UserSettings(
        gender: .male,
        weight: 70,
        unitSystem: .metric,
        country: "US",
        hasAcceptedDisclaimer: false,
        hasPassedAgeGate: false,
        notifications: true,
        darkMode: true
    )
}

class UserStore: ObservableObject {
    @Published var gender: Gender = .male
    @Published var weight: Double = 70
    @Published var unitSystem: UnitSystem = .metric
    @Published var country: String = "US"
    @Published var hasAcceptedDisclaimer: Bool = false
    @Published var hasPassedAgeGate: Bool = false
    @Published var notifications: Bool = true
    @Published var darkMode: Bool = true
    
    private let userDefaults = UserDefaults.standard
    private let storageKey = "pepmax_user"
    
    init() {
        loadFromStorage()
    }
    
    func loadFromStorage() {
        if let data = userDefaults.data(forKey: storageKey),
           let settings = try? JSONDecoder().decode(UserSettings.self, from: data) {
            gender = settings.gender
            weight = settings.weight
            unitSystem = settings.unitSystem
            country = settings.country
            hasAcceptedDisclaimer = settings.hasAcceptedDisclaimer
            hasPassedAgeGate = settings.hasPassedAgeGate
            notifications = settings.notifications
            darkMode = settings.darkMode
        }
    }
    
    func saveToStorage() {
        let settings = UserSettings(
            gender: gender,
            weight: weight,
            unitSystem: unitSystem,
            country: country,
            hasAcceptedDisclaimer: hasAcceptedDisclaimer,
            hasPassedAgeGate: hasPassedAgeGate,
            notifications: notifications,
            darkMode: darkMode
        )
        if let data = try? JSONEncoder().encode(settings) {
            userDefaults.set(data, forKey: storageKey)
        }
    }
    
    func setGender(_ g: Gender) { gender = g; saveToStorage() }
    func setWeight(_ w: Double) { weight = w; saveToStorage() }
    func setUnitSystem(_ u: UnitSystem) { unitSystem = u; saveToStorage() }
    func setCountry(_ c: String) { country = c; saveToStorage() }
    func acceptDisclaimer() { hasAcceptedDisclaimer = true; saveToStorage() }
    func passAgeGate() { hasPassedAgeGate = true; saveToStorage() }
    func setNotifications(_ n: Bool) { notifications = n; saveToStorage() }
    func setDarkMode(_ d: Bool) { darkMode = d; saveToStorage() }
}