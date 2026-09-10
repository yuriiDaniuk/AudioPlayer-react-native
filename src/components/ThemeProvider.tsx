import React, { useEffect } from 'react';
import { Appearance } from 'react-native';

import { useColorScheme } from 'nativewind';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';

/** Properties accepted by the application theme provider. */
interface ThemeProviderProps {
  /** React subtree that receives the active NativeWind color scheme. */
  children: React.ReactNode;
}

/** Synchronizes the persisted theme mode with NativeWind and system appearance. */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  /** Updates the color scheme consumed by NativeWind. */
  const { setColorScheme } = useColorScheme();

  /** Reads the persisted theme preference from the Redux store. */
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // Re-apply the NativeWind scheme whenever the persisted preference changes.
  useEffect(() => {
    if (themeMode === 'system') {
      // Resolve system mode through the native appearance API and normalize null to light.
      const systemTheme = Appearance.getColorScheme();
      setColorScheme(systemTheme === 'dark' ? 'dark' : 'light');
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode, setColorScheme]);

  return <>{children}</>;
}