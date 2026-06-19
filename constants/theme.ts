/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Primary: #FF4747 (AliExpress Red)
// Secondary: #FF6A00 (Orange Red)
// Accent: #FFD000 (Yellow - sale badges)
// Background: #F5F5F5 (Light Gray)
// Card: #FFFFFF (White)
// Text: #333333 (Dark Gray)

const tintColorLight = '#FF4747';
const tintColorDark = '#FF4747';

export const Colors = {
  light: {
    text: '#333333',
    background: '#F5F5F5',
    tint: tintColorLight,
    icon: '#FF4747',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1a1a1a',
    tint: tintColorDark,
    icon: '#FF4747',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
  },
};

export const ThemeColors = {
  primary: '#FF4747',
  secondary: '#FF6A00',
  accent: '#FFD000',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
