import SwiftUI

struct Theme {
    // MARK: - Colors
    struct Colors {
        static let primary = Color(hex: "#FF2D55")
        static let primarySoft = Color(hex: "#FF6B82")
        static let success = Color(hex: "#00FF87")
        static let warning = Color(hex: "#FFB800")
        static let error = Color(hex: "#FF2D55")
        
        struct Dark {
            static let background = Color(hex: "#0A0A0F")
            static let surface = Color(hex: "#141414")
            static let surfaceElevated = Color(hex: "#1A1A1A")
            static let text = Color.white
            static let textMuted = Color.white.opacity(0.5)
            static let border = Color.white.opacity(0.12)
            static let glass = Color.white.opacity(0.08)
            static let glassBorder = Color.white.opacity(0.15)
        }
        
        struct Light {
            static let background = Color(hex: "#F5F5F7")
            static let surface = Color.white.opacity(0.7)
            static let surfaceElevated = Color.white.opacity(0.85)
            static let text = Color(hex: "#1A1A1F")
            static let textMuted = Color.black.opacity(0.5)
            static let border = Color.black.opacity(0.1)
            static let glass = Color.white.opacity(0.25)
            static let glassBorder = Color.black.opacity(0.1)
        }
    }
    
    // MARK: - Spacing
    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }
    
    // MARK: - Corner Radius
    struct CornerRadius {
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 28
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Glass Card Modifier
struct GlassCard: ViewModifier {
    @EnvironmentObject var userStore: UserStore
    
    func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                    .fill(userStore.darkMode ? Theme.Colors.Dark.glass : Theme.Colors.Light.glass)
            )
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                    .stroke(userStore.darkMode ? Theme.Colors.Dark.glassBorder : Theme.Colors.Light.glassBorder, lineWidth: 1)
            )
            .shadow(color: .black.opacity(userStore.darkMode ? 0.3 : 0.1), radius: 16, x: 0, y: 8)
    }
}

extension View {
    func glassCard() -> some View {
        modifier(GlassCard())
    }
}

// MARK: - Theme Colors
struct ThemeColors {
    @EnvironmentObject var userStore: UserStore
    
    var background: Color { userStore.darkMode ? Theme.Colors.Dark.background : Theme.Colors.Light.background }
    var surface: Color { userStore.darkMode ? Theme.Colors.Dark.surface : Theme.Colors.Light.surface }
    var surfaceElevated: Color { userStore.darkMode ? Theme.Colors.Dark.surfaceElevated : Theme.Colors.Light.surfaceElevated }
    var text: Color { userStore.darkMode ? Theme.Colors.Dark.text : Theme.Colors.Light.text }
    var textMuted: Color { userStore.darkMode ? Theme.Colors.Dark.textMuted : Theme.Colors.Light.textMuted }
    var border: Color { userStore.darkMode ? Theme.Colors.Dark.border : Theme.Colors.Light.border }
    var primary: Color { Theme.Colors.primary }
    var success: Color { Theme.Colors.success }
    var warning: Color { Theme.Colors.warning }
    var error: Color { Theme.Colors.error }
}