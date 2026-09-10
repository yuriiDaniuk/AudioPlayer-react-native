import React from 'react';
import { View, Text, Pressable } from 'react-native';
import GradientText from './GradientText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store';
import { setTheme, ThemeMode } from '../store/themeSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const navigation = useNavigation<any>();

  const toggleTheme = () => {
    // Якщо зараз темна (або системна) — вмикаємо світлу, інакше — темну
    const nextTheme: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(nextTheme));
  };

  const toggleLanguage = () => {
    // Якщо зараз українська ('uk') — перемикаємо на англійську ('en'), і навпаки
    const nextLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(nextLang);
  };

  // Визначаємо кольори градієнта залежно від теми (щоб текст не зливався зі світлим фоном)
  const gradientColors = themeMode === 'dark' 
    ? ['#FFFFFF', '#AAAAAA'] // Біло-сірий для темної теми
    : ['#121212', '#666666']; // Темно-сірий для світлої теми

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Логотип */}
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

      {/* Контейнер для кнопок праворуч */}
      <View className="flex-row items-center gap-3">
        
        {/* НОВА КНОПКА: Перемикач теми */}
        <Pressable 
          onPress={toggleTheme}
          className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full dark:bg-[#282828] active:opacity-70"
        >
          <Text className="text-base">
            {themeMode === 'dark' ? '☀️' : '🌙'}
          </Text>
        </Pressable>

        {/* Кнопка мови (тепер з підтримкою світлої теми) */}
        <Pressable
          onPress={toggleLanguage}
          className="items-center justify-center h-8 px-3 bg-gray-200 rounded-full dark:bg-[#282828] active:opacity-70"
        >
          <Text className="text-sm font-semibold text-black uppercase dark:text-white">
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </Text>
        </Pressable>

        {/* Аватарка (тепер з підтримкою світлої теми) */}
        <Pressable className="items-center justify-center w-8 h-8 bg-gray-300 rounded-full dark:bg-[#444444] active:opacity-70">
          <Text className="text-sm font-bold text-black dark:text-white">Ю</Text>
        </Pressable>
        
      </View>
    </View>
  );
}