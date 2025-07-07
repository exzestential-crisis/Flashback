// colorUtils.ts

// Color data from your database
export const colorData = [
  { color_id: 1, name: "slate", hex_code: "#64748b" },
  { color_id: 2, name: "gray", hex_code: "#6b7280" },
  { color_id: 3, name: "zinc", hex_code: "#71717a" },
  { color_id: 4, name: "neutral", hex_code: "#737373" },
  { color_id: 5, name: "stone", hex_code: "#78716c" },
  { color_id: 6, name: "red", hex_code: "#ef4444" },
  { color_id: 7, name: "orange", hex_code: "#f97316" },
  { color_id: 8, name: "amber", hex_code: "#f59e0b" },
  { color_id: 9, name: "yellow", hex_code: "#eab308" },
  { color_id: 10, name: "lime", hex_code: "#84cc16" },
  { color_id: 11, name: "green", hex_code: "#22c55e" },
  { color_id: 12, name: "emerald", hex_code: "#10b981" },
  { color_id: 13, name: "teal", hex_code: "#14b8a6" },
  { color_id: 14, name: "cyan", hex_code: "#06b6d4" },
  { color_id: 15, name: "sky", hex_code: "#0ea5e9" },
  { color_id: 16, name: "blue", hex_code: "#3b82f6" },
  { color_id: 17, name: "indigo", hex_code: "#6366f1" },
  { color_id: 18, name: "violet", hex_code: "#8b5cf6" },
  { color_id: 19, name: "purple", hex_code: "#a855f7" },
  { color_id: 20, name: "fuchsia", hex_code: "#d946ef" },
  { color_id: 21, name: "pink", hex_code: "#ec4899" },
  { color_id: 22, name: "rose", hex_code: "#f43f5e" },
];

// Create lookup map for O(1) access
export const colorLookup = colorData.reduce((acc, color) => {
  acc[color.color_id] = color;
  acc[color.name] = color;
  return acc;
}, {} as Record<string | number, (typeof colorData)[0]>);

// Utility to adjust color brightness
export function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));

  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

// Convert hex to HSL for more accurate color manipulation
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Convert HSL back to hex
export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Generate color shades using HSL for better color accuracy
export function generateColorShades(baseHex: string) {
  const [h, s, l] = hexToHsl(baseHex);

  return {
    300: hslToHex(h, s, Math.min(l + 25, 90)),
    400: hslToHex(h, s, Math.min(l + 15, 85)),
    500: baseHex, // This is your base color
    600: hslToHex(h, s, Math.max(l - 15, 15)),
    700: hslToHex(h, s, Math.max(l - 25, 10)),
  };
}

// Get color variants for a given color ID (simplified version)
export function getColorVariants(colorId: number | string) {
  const color = colorLookup[colorId];
  if (!color) {
    // Fallback to amber if color not found
    return {
      light: "#fbbf24", // amber-400
      base: "#f59e0b", // amber-500
      dark: "#d97706", // amber-600
    };
  }

  const baseHex = color.hex_code;

  return {
    light: adjustColorBrightness(baseHex, 40), // 400 equivalent
    base: baseHex, // 500 equivalent
    dark: adjustColorBrightness(baseHex, -30), // 600 equivalent
  };
}

// Get comprehensive color variants with all shades
export function getColorShades(colorId: number | string) {
  const color = colorLookup[colorId];
  if (!color) return null;

  const shades = generateColorShades(color.hex_code);

  return {
    name: color.name,
    baseHex: color.hex_code,
    shades,
    variants: {
      light: shades[400],
      base: shades[500],
      dark: shades[600],
    },
  };
}

// Get color by name or ID
export function getColor(identifier: string | number) {
  return colorLookup[identifier] || null;
}

// Get all available colors
export function getAllColors() {
  return colorData;
}

// Check if a color exists
export function colorExists(colorId: number | string): boolean {
  return colorId in colorLookup;
}

// Get random color
export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorData.length);
  return colorData[randomIndex];
}

// CSS custom properties helper
export function getColorCSSVars(colorId: number | string) {
  const colorShades = getColorShades(colorId);
  if (!colorShades) return {};

  return {
    "--color-300": colorShades.shades[300],
    "--color-400": colorShades.shades[400],
    "--color-500": colorShades.shades[500],
    "--color-600": colorShades.shades[600],
    "--color-700": colorShades.shades[700],
  };
}

// Style objects helper
export function getColorStyles(colorId: number | string) {
  const colors = getColorVariants(colorId);

  return {
    backgroundLight: { backgroundColor: colors.light },
    backgroundBase: { backgroundColor: colors.base },
    backgroundDark: { backgroundColor: colors.dark },
    textLight: { color: colors.light },
    textBase: { color: colors.base },
    textDark: { color: colors.dark },
    borderLight: { borderColor: colors.light },
    borderBase: { borderColor: colors.base },
    borderDark: { borderColor: colors.dark },
  };
}
