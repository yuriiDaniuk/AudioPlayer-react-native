import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import GradientText from './GradientText';

import { setTheme } from '../store/themeSlice';

import type { AppDispatch, RootState } from '../store';
import type { ThemeMode } from '../store/themeSlice';

/** Renders the application logo and controls for navigation, theme, and language. */
export default function Header() {
  /** Provides access to the active language and language-switching method. */
  const { i18n } = useTranslation();

  /** Dispatches typed theme actions to the Redux store. */
  const dispatch = useDispatch<AppDispatch>();

  /** Reads the currently selected theme mode from application state. */
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  /** Provides navigation actions for the header logo. */
  const navigation = useNavigation<any>();

  /** Switches between the light and dark theme modes. */
  const toggleTheme = () => {
    const nextTheme: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(nextTheme));
  };

  /** Switches between the Ukrainian and English interface languages. */
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(nextLang);
  };

  // Select contrasting logo colors so the gradient remains readable in either theme.
  const gradientColors = themeMode === 'dark'
    ? ['#FFFFFF', '#AAAAAA']
    : ['#121212', '#666666'];

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Logo button navigates to the home screen. */}
      <Pressable
        className="flex-row items-center active:opacity-70"
        onPress={() => navigation.navigate('Головна')}
      >
        <View className="items-center justify-center mr-2 bg-red-600 rounded-full w-7 h-7">
          <Text className="ml-0.5 text-xs font-bold text-white">▶</Text>
        </View>

        <GradientText
          text="Music"
          className="text-2xl font-bold tracking-tight"
          colors={gradientColors} 
        />
      </Pressable>

      {/* Header action buttons for theme, language, and profile access. */}
      <View className="flex-row items-center gap-3">
        {/* Toggles between light and dark theme modes. */}
        <Pressable
          onPress={toggleTheme}
          className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full dark:bg-[#282828] active:opacity-70"
        >
          <Text className="text-base">
            {themeMode === 'dark' ? '☀️' : '🌙'}
          </Text>
        </Pressable>

        {/* Toggles the interface language and displays the language to activate. */}
        <Pressable
          onPress={toggleLanguage}
          className="items-center justify-center h-8 px-3 bg-gray-200 rounded-full dark:bg-[#282828] active:opacity-70"
        >
          <Text className="text-sm font-semibold text-black uppercase dark:text-white">
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </Text>
        </Pressable>

        {/* Displays the current profile affordance. */}
        <Pressable className="items-center justify-center w-8 h-8 bg-gray-300 rounded-full dark:bg-[#444444] active:opacity-70">
          <Text className="text-sm font-bold text-black dark:text-white">Ю</Text>
        </Pressable>
      </View>
    </View>
  );
}