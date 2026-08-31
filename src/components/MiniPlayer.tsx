import React from 'react';
import { View, Text, Pressable } from 'react-native';
import PlayIcon from '../assets/icons/play.svg';

export default function MiniPlayer() {
  return (
    <Pressable className="flex-row items-center justify-between bg-[#212121] px-4 py-2 mx-2 mb-2 rounded-lg active:bg-[#333333]">
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-[#444444] rounded mr-3" />
        <View>
          <Text className="text-sm font-semibold text-white">
            Гостиница Космос
          </Text>
          <Text className="text-[#AAAAAA] text-xs">E Mnogoznaal</Text>
        </View>
      </View>
      <View className="flex-row items-center space-x-4">
        <Pressable className="active:opacity-50">
          <Text className="text-lg text-white">📺</Text>
        </Pressable>
        <Pressable className="items-center justify-center w-8 h-8 active:opacity-50">
          <PlayIcon width={24} height={24} fill="white" color="white" />
        </Pressable>
      </View>
    </Pressable>
  );
}