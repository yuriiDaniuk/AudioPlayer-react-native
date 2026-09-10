import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';

export default function SearchScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-transparent">
      <Header />
      <View className="items-center justify-center flex-1">
        <Text className="text-xl font-bold text-black dark:text-white">{t('search.title')}</Text>
      </View>
    </View>
  );
}
