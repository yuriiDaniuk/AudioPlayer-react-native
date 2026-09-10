import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import HomeIcon from '../assets/icons/home.svg';
import SearchIcon from '../assets/icons/search.svg';
import LibraryIcon from '../assets/icons/library.svg';

export default function BottomNav() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row bg-[#F5F5F5] dark:bg-black py-2 border-t border-[#E5E5E5] dark:border-[#222222]">
      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <HomeIcon width={24} height={24} fill={isDark ? 'white' : '#111111'} color={isDark ? 'white' : '#111111'} />
        <Text className="text-[#111111] dark:text-white text-[10px] mt-1 font-regular">
          Головна
        </Text>
      </Pressable>

      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <SearchIcon width={24} height={24} color={isDark ? '#AAAAAA' : '#4B4B4B'} />
        <Text className="text-[#4B4B4B] dark:text-[#AAAAAA] text-[10px] mt-1 font-regular">
          Пошук
        </Text>
      </Pressable>

      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <LibraryIcon width={24} height={24} color={isDark ? '#AAAAAA' : '#4B4B4B'} />
        <Text className="text-[#4B4B4B] dark:text-[#AAAAAA] text-[10px] mt-1 font-regular">
          Бібліотека
        </Text>
      </Pressable>
    </View>
  );
}