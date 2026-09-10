import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracks, Track } from '../store/tracksSlice';
import { AppDispatch, RootState } from '../store'; // Імпортуємо типізований Dispatch
import { setActiveTrack, setIsPlaying } from '../store/playerSlice'; // Екшен для увімкнення треку
import TrackPlayer from 'react-native-track-player';
import { saveLastTrack } from '../utils/storage';
import { useColorScheme } from 'nativewind';

export default function TrackGrid() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Використовуємо типізований dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Дістаємо треки та статус завантаження з глобального стейту
  const { items: tracks, status } = useSelector(
    (state: RootState) => state.tracks,
  );

  useEffect(() => {
    // Якщо ми ще не завантажували треки — робимо запит
    if (status === 'idle') {
      dispatch(fetchTracks());
    }
  }, [status, dispatch]);

  const handleTrackPress = async (track: Track) => {
    // 1. Оновлюємо UI (міні-плеєр з'явиться)
    dispatch(setActiveTrack(track));
    dispatch(setIsPlaying(true));
    await saveLastTrack(track);

    // 2. Передаємо дані в аудіо-рушій і запускаємо
    await TrackPlayer.reset(); // Очищаємо попередній трек
    await TrackPlayer.add({
      id: track.id,
      url: track.audioUrl, // URL самого аудіофайлу
      title: track.title,
      artist: track.artist.name,
      artwork: track.coverUrl, // Для обкладинки на екрані блокування
    });
    await TrackPlayer.play();
  };

  const renderGridItem = ({ item }: { item: Track }) => {
    const hasValidUrl =
      item.coverUrl &&
      typeof item.coverUrl === 'string' &&
      item.coverUrl.trim().length > 0;
    const cleanUri = hasValidUrl ? encodeURI(item.coverUrl.trim()) : null;

    return (
      // Додали обробник натискання:
      <Pressable
        onPress={() => handleTrackPress(item)}
        className="w-[31%] mb-4 active:opacity-70"
      >
        {cleanUri ? (
          <Image
            source={{ uri: cleanUri }}
            className="w-full aspect-square rounded-md mb-1.5 bg-[#282828]"
          />
        ) : (
          <View className="w-full aspect-square bg-[#282828] rounded-md mb-1.5" />
        )}
        <Text
          className="text-black dark:text-white text-[13px] font-semibold"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-gray-600 dark:text-[#AAAAAA] text-xs" numberOfLines={1}>
          {item.artist.name}
        </Text>
      </Pressable>
    );
  };

  if (status === 'loading') {
    return (
      <View className="items-center justify-center flex-1 pt-10">
        <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#555555'} />
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
