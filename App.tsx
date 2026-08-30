import React from 'react';
import { View, Text, FlatList, StatusBar, Pressable } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

type GridItem = {
  id: string;
  title: string;
  subtitle: string;
};

const MOCK_GRID_DATA: GridItem[] = [
  { id: '1', title: "PORvaNo Plat'e", subtitle: 'Кравц' },
  { id: '2', title: 'Jah Khalib - С...', subtitle: 'Сжигая дотла' },
  { id: '3', title: 'Dikiy jad', subtitle: 'Mrid' },
  { id: '4', title: 'Лютики', subtitle: 'Просто Лера' },
  { id: '5', title: 'Стилево', subtitle: 'Макс Корж' },
  { id: '6', title: 'All The Time', subtitle: 'Jeremih' },
  { id: '7', title: 'Малолетка', subtitle: 'Макс Корж' },
  { id: '8', title: 'Открой глаза', subtitle: 'Макс Корж' },
  { id: '9', title: 'Placeholder', subtitle: '...' },
];

export default function App() {
  const renderGridItem = ({ item }: { item: GridItem }) => (
    <Pressable className="w-[31%] mb-4 active:opacity-70">
      <View className="w-full aspect-square bg-[#282828] rounded-md mb-1.5" />
      <Text className="text-white text-[13px] font-semibold" numberOfLines={1}>
        {item.title}
      </Text>
      <Text className="text-[#AAAAAA] text-xs" numberOfLines={1}>
        {item.subtitle}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        {/* 1. HEADER */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            <View className="items-center justify-center mr-2 bg-red-600 rounded-full w-7 h-7">
              <Text className="ml-0.5 text-xs text-white">▶</Text>
            </View>
            <Text className="text-2xl font-bold tracking-tight text-white">
              Music
            </Text>
          </View>
          <Pressable className="w-8 h-8 rounded-full bg-[#444444] justify-center items-center active:bg-gray-600">
            <Text className="text-sm font-bold text-white">Ю</Text>
          </Pressable>
        </View>

        {/* 2. MAIN CONTENT (Сітка 3x3) */}
        <FlatList
          data={MOCK_GRID_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          numColumns={3}
          contentContainerClassName="px-4 pt-4 pb-5 flex-grow"
          columnWrapperClassName="justify-between"
          showsVerticalScrollIndicator={false}
        />

        {/* 3. MINI PLAYER */}
        {/* Замість прозорості, міні-плеєр тепер трохи світлішає при натисканні */}
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
            <Pressable className="active:opacity-50">
              <Text className="mr-2 text-lg text-white">▶</Text>
            </Pressable>
          </View>
        </Pressable>

        {/* 4. BOTTOM NAVIGATION */}
        <View className="flex-row bg-black py-3 border-t border-[#222222]">
          <Pressable className="items-center justify-center flex-1 active:opacity-50">
            <Text className="mb-1 text-xl text-white">🏠</Text>
            <Text className="text-white text-[10px] font-bold mt-1">Головна</Text>
          </Pressable>

          <Pressable className="items-center justify-center flex-1 active:opacity-50">
            <Text className="text-xl text-[#AAAAAA] mb-1">🔍</Text>
            <Text className="text-[#AAAAAA] text-[10px] mt-1">Пошук</Text>
          </Pressable>

          <Pressable className="items-center justify-center flex-1 active:opacity-50">
            <Text className="text-xl text-[#AAAAAA] mb-1">📚</Text>
            <Text className="text-[#AAAAAA] text-[10px] mt-1">Бібліотека</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}