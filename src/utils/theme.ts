export const colors = {
  dark: {
    background: '#0A0A0F',
    surface: 'rgba(30, 30, 40, 0.6)',
    surfaceElevated: 'rgba(40, 40, 55, 0.7)',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
    primary: '#FF2D55',
    primarySoft: '#FF6B82',
    primaryGlow: 'rgba(255, 45, 85, 0.3)',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.12)',
    success: '#00FF87',
    warning: '#FFB800',
    error: '#FF2D55',
    cardGradientStart: 'rgba(30, 30, 40, 0.8)',
    cardGradientEnd: 'rgba(20, 20, 30, 0.9)',
  },
  light: {
    background: '#F5F5F7',
    surface: 'rgba(255, 255, 255, 0.7)',
    surfaceElevated: 'rgba(255, 255, 255, 0.85)',
    glass: 'rgba(255, 255, 255, 0.25)',
    glassBorder: 'rgba(0, 0, 0, 0.1)',
    primary: '#FF2D55',
    primarySoft: '#FF6B82',
    primaryGlow: 'rgba(255, 45, 85, 0.2)',
    text: '#1A1A1F',
    textMuted: 'rgba(0, 0, 0, 0.5)',
    border: 'rgba(0, 0, 0, 0.1)',
    success: '#00C853',
    warning: '#FF9500',
    error: '#FF2D55',
    cardGradientStart: 'rgba(255, 255, 255, 0.9)',
    cardGradientEnd: 'rgba(245, 245, 247, 0.95)',
  },
};

export const glassStyle = {
  dark: {
    backgroundColor: 'rgba(30, 30, 40, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  mono: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
};

export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export function getColors(isDark: boolean) {
  return isDark ? colors.dark : colors.light;
}

export function getGlassStyle(isDark: boolean) {
  return isDark ? glassStyle.dark : glassStyle.light;
}