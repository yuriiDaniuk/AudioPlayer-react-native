import React from 'react';
import { View, Text, Pressable } from 'react-native';
import HomeIcon from '../assets/icons/home.svg';
import SearchIcon from '../assets/icons/search.svg';
import LibraryIcon from '../assets/icons/library.svg';

export default function BottomNav() {
  return (
    <View className="flex-row bg-black py-2 border-t border-[#222222]">
      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <HomeIcon width={24} height={24} fill="white" color="white" />
        <Text className="text-white text-[10px] mt-1 font-regular">
          Головна
        </Text>
      </Pressable>

      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <SearchIcon width={24} height={24} color="#AAAAAA" />
        <Text className="text-[#AAAAAA] text-[10px] mt-1 font-regular">
          Пошук
        </Text>
      </Pressable>

      <Pressable className="items-center justify-center flex-1 active:opacity-50">
        <LibraryIcon width={24} height={24} color="#AAAAAA" />
        <Text className="text-[#AAAAAA] text-[10px] mt-1 font-regular">
          Бібліотека
        </Text>
      </Pressable>
    </View>
  );
}