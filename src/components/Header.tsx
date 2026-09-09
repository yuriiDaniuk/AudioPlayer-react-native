import React from 'react';
import { View, Text, Pressable } from 'react-native';
import GradientText from './GradientText'; 
import { useNavigation } from '@react-navigation/native';

export default function Header() {
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
      <Pressable className="w-8 h-8 rounded-full bg-[#444444] justify-center items-center active:bg-gray-600">
        <Text className="text-sm font-bold text-white">Ю</Text>
      </Pressable>
    </View>
  );
}