import React, { useState, useMemo, useCallback } from 'react';
import { StatusBar, YellowBox } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme as DarkThemePaper,
  DefaultTheme as DefaultThemePaper,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as DarkThemeNavigation,
  DefaultTheme as DefaultThemeNavigation,
} from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import PreferencesContext from './src/context/PreferencesContext';

YellowBox.ignoreWarnings(['Calling `getNode()`']);

// The library themes are customised once, at load time, instead of being
// mutated again on every render of App.
DefaultThemePaper.colors.primary = '#1ae1f2';
DarkThemePaper.colors.primary = '#1ae1f2';
DarkThemePaper.colors.accent = '#1ae1f2';

DarkThemeNavigation.colors.background = '#192734';
DarkThemeNavigation.colors.card = '#15212b';

export default function App() {
  const [theme, setTheme] = useState('dark');

  // Stable identity and no dependency on the `theme` closure, so the memoised
  // context value below can list it honestly.
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const preference = useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme, toggleTheme],
  );

  return (
    <PreferencesContext.Provider value={preference}>
      <PaperProvider
        theme={theme === 'dark' ? DarkThemePaper : DefaultThemePaper}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <NavigationContainer
          theme={
            theme === 'dark' ? DarkThemeNavigation : DefaultThemeNavigation
          }>
          <Navigation />
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
