import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useColorScheme } from 'nativewind';

import HomeIcon from '../assets/icons/home.svg';
import LibraryIcon from '../assets/icons/library.svg';
import SearchIcon from '../assets/icons/search.svg';

/** Renders the application's bottom navigation controls with theme-aware styling. */
export default function BottomNav() {
  /** Provides the current light or dark theme used to select icon colors. */
  const { colorScheme } = useColorScheme();

  /** Indicates whether dark theme colors should be applied to the navigation bar. */
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row bg-[#F5F5F5] dark:bg-black py-2 border-t border-[#E5E5E5] dark:border-[#222222]">
      {/* Navigation container shared by the three primary destinations. */}
      {/* Home destination with the active light or dark foreground color. */}
      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <HomeIcon width={24} height={24} fill={isDark ? 'white' : '#111111'} color={isDark ? 'white' : '#111111'} />
        <Text className="text-[#111111] dark:text-white text-[10px] mt-1 font-regular">
          Головна
        </Text>
      </Pressable>

      {/* Search destination using the inactive navigation color. */}
      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <SearchIcon width={24} height={24} color={isDark ? '#AAAAAA' : '#4B4B4B'} />
        <Text className="text-[#4B4B4B] dark:text-[#AAAAAA] text-[10px] mt-1 font-regular">
          Пошук
        </Text>
      </Pressable>

      {/* Library destination using the inactive navigation color. */}
      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <LibraryIcon width={24} height={24} color={isDark ? '#AAAAAA' : '#4B4B4B'} />
        <Text className="text-[#4B4B4B] dark:text-[#AAAAAA] text-[10px] mt-1 font-regular">
          Бібліотека
        </Text>
      </Pressable>
    </View>
  );
}