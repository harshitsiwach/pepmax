export const colors = {
  dark: {
    background: '#080808',
    surface: '#141414',
    surfaceElevated: '#1A1A1A',
    primary: '#FF2D55',
    primarySoft: '#FF6B82',
    text: '#FFFFFF',
    textMuted: '#666666',
    border: '#2A2A2A',
    success: '#00FF87',
    warning: '#FFB800',
    error: '#FF2D55',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceElevated: '#EBEBEB',
    primary: '#FF2D55',
    primarySoft: '#FF6B82',
    text: '#000000',
    textMuted: '#666666',
    border: '#E0E0E0',
    success: '#00C853',
    warning: '#FFB800',
    error: '#FF2D55',
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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export function getColors(isDark: boolean) {
  return isDark ? colors.dark : colors.light;
}