import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-transparent">
      <Header />
      <View className="items-center justify-center flex-1">
        <Text className="text-xl font-bold text-white">Пошук</Text>
      </View>
    </View>
  );
}
