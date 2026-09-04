import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

type Artist = {
  id: string;
  name: string;
};

type Track = {
  id: string;
  title: string;
  coverUrl: string;
  artist: Artist;
};

export default function TrackGrid() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get<Track[]>(
          'http://localhost:3000/api/tracks',
        );

        setTracks(response.data);
      } catch (error) {
        console.error('Помилка завантаження треків:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const renderGridItem = ({ item }: { item: Track }) => {
    const hasValidUrl =
      item.coverUrl &&
      typeof item.coverUrl === 'string' &&
      item.coverUrl.trim().length > 0;

    const cleanUri = hasValidUrl ? encodeURI(item.coverUrl.trim()) : null;

    return (
      <Pressable className="w-[31%] mb-4 active:opacity-70">
        {cleanUri ? (
          <Image
            source={{ uri: cleanUri }}
            className="w-full aspect-square rounded-md mb-1.5 bg-[#282828]"
          />
        ) : (
          <View className="w-full aspect-square bg-[#282828] rounded-md mb-1.5" />
        )}

        <Text
          className="text-white text-[13px] font-semibold"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-[#AAAAAA] text-xs" numberOfLines={1}>
          {item.artist.name}
        </Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 pt-10">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <FlatList
      data={tracks}
      keyExtractor={item => item.id}
      renderItem={renderGridItem}
      numColumns={3}
      contentContainerClassName="px-4 pt-4 pb-5 flex-grow"
      columnWrapperClassName="justify-between"
      showsVerticalScrollIndicator={false}
    />
  );
}
