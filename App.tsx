import React from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const MOCK_GRID_DATA = [
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
  const renderGridItem = ({ item }: { item: (typeof MOCK_GRID_DATA)[0] }) => (
    <TouchableOpacity className="w-[31%] mb-4" activeOpacity={0.7}>
      <View className="w-full aspect-square bg-[#282828] rounded-md mb-1.5" />
      <Text className="text-white text-[13px] font-semibold" numberOfLines={1}>
        {item.title}
      </Text>
      <Text className="text-[#AAAAAA] text-xs" numberOfLines={1}>
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        {/* 1. HEADER */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <View className="flex-row items-center">
            <View className="w-7 h-7 rounded-full bg-red-600 justify-center items-center mr-2">
              <Text className="text-white text-xs ml-0.5">▶</Text>
            </View>
            <Text className="text-white text-2xl font-bold tracking-tight">
              Music
            </Text>
          </View>
          <TouchableOpacity className="w-8 h-8 rounded-full bg-[#444444] justify-center items-center">
            <Text className="text-white font-bold text-sm">Ю</Text>
          </TouchableOpacity>
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
        <TouchableOpacity
          className="flex-row items-center justify-between bg-[#212121] px-4 py-2 mx-2 mb-2 rounded-lg"
          activeOpacity={0.9}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#444444] rounded mr-3" />
            <View>
              <Text className="text-white text-sm font-semibold">
                Гостиница Космос
              </Text>
              <Text className="text-[#AAAAAA] text-xs">E Mnogoznaal</Text>
            </View>
          </View>
          <View className="flex-row items-center space-x-4">
            <Text className="text-lg text-white">📺</Text>
            <Text className="text-lg text-white mr-2">▶</Text>
          </View>
        </TouchableOpacity>

        {/* 4. BOTTOM NAVIGATION */}
        <View className="flex-row bg-black py-3 border-t border-[#222222]">
          <TouchableOpacity className="flex-1 items-center justify-center">
            <Text className="text-xl text-white mb-1">🏠</Text>
            <Text className="text-white text-[10px] font-bold mt-1">Головна</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 items-center justify-center">
            <Text className="text-xl text-[#AAAAAA] mb-1">🔍</Text>
            <Text className="text-[#AAAAAA] text-[10px] mt-1">Пошук</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 items-center justify-center">
            <Text className="text-xl text-[#AAAAAA] mb-1">📚</Text>
            <Text className="text-[#AAAAAA] text-[10px] mt-1">Бібліотека</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}