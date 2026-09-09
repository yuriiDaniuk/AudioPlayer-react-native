import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';

export default function LibraryScreen() {
  return (
    // 1. Головний контейнер без центрування (просто розтягується на весь екран)
    <View className="flex-1 bg-transparent">
      
      {/* 2. Хедер стає найпершим елементом і залишається зверху */}
      <Header />
      
      {/* 3. Окремий контейнер ТІЛЬКИ для контенту, який центрує все, що всередині нього */}
      <View className="items-center justify-center flex-1">
        <Text className="text-xl font-bold text-white">Моя Бібліотека</Text>
      </View>

    </View>
  );
}