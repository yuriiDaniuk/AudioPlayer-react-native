import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';

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

export default function TrackGrid() {
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
    <FlatList
      data={MOCK_GRID_DATA}
      keyExtractor={item => item.id}
      renderItem={renderGridItem}
      numColumns={3}
      contentContainerClassName="px-4 pt-4 pb-5 flex-grow"
      columnWrapperClassName="justify-between"
      showsVerticalScrollIndicator={false}
    />
  );
}