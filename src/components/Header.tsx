import React from 'react';
import { View, Text, Pressable } from 'react-native';
import GradientText from './GradientText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { i18n } = useTranslation();

  // Функція перемикання мови
  const toggleLanguage = () => {
    // Якщо зараз українська ('uk') — перемикаємо на англійську ('en'), і навпаки
    const nextLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(nextLang);
  };

  const navigation = useNavigation<any>();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Pressable
        className="flex-row items-center active:opacity-70"
        onPress={() => navigation.navigate('Головна')}
      >
        <View className="items-center justify-center mr-2 bg-red-600 rounded-full w-7 h-7">
          <Text className="ml-0.5 text-xs text-white font-bold">▶</Text>
        </View>

        {/* Замінюємо звичайний Text на GradientText */}
        <GradientText
          text="Music"
          className="text-2xl font-bold tracking-tight"
          colors={['#FFFFFF', '#AAAAAA']} // Від білого до світло-сірого
        />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={toggleLanguage}
          className="px-3 py-1 bg-[#282828] rounded-full active:bg-[#404040]"
        >
          <Text className="text-sm font-semibold text-white uppercase">
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </Text>
        </Pressable>
        <Pressable className="w-8 h-8 rounded-full bg-[#444444] justify-center items-center active:bg-gray-600">
          <Text className="text-sm font-bold text-white">Ю</Text>
        </Pressable>
      </View>
    </View>
  );
}
