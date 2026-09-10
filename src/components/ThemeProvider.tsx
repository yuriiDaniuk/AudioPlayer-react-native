import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 

// Додаємо типізацію для props
interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { setColorScheme } = useColorScheme();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    if (themeMode === 'system') {
      const systemTheme = Appearance.getColorScheme();
      setColorScheme(systemTheme === 'dark' ? 'dark' : 'light');
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode, setColorScheme]);

  return <>{children}</>;
}