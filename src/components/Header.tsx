import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center">
        <View className="items-center justify-center mr-2 bg-red-600 rounded-full w-7 h-7">
          <Text className="ml-0.5 text-xs text-white font-bold">▶</Text>
        </View>
        <Text className="text-2xl font-bold tracking-tight text-white">
          Music
        </Text>
      </View>
      <Pressable className="w-8 h-8 rounded-full bg-[#444444] justify-center items-center active:bg-gray-600">
        <Text className="text-sm font-bold text-white">Ю</Text>
      </Pressable>
    </View>
  );
}