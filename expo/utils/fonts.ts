// Font configuration for Poppins
export const fonts = {
  regular: 'Poppins',
  medium: 'Poppins',
  semiBold: 'Poppins',
  bold: 'Poppins',
  extraBold: 'Poppins',
};

// To use custom fonts, you'll need to load them with expo-font
// For now, we'll use system fonts with fontWeight to simulate Poppins
export const fontStyles = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};
