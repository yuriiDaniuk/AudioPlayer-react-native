import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setIsPlaying } from '../store/playerSlice';

export default function MiniPlayer() {
  const dispatch = useDispatch();

  // 1. Читаємо поточний трек і статус відтворення з глобального сховища
  const { activeTrack, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  // 2. Якщо трек ще не вибрано (додаток щойно запущено) — плеєр взагалі не відображається
  if (!activeTrack) {
    return null;
  }

  // 3. Обробник для кнопки Play/Pause
  const togglePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  // 4. Очищення URL для обкладинки (як ми робили в сітці)
  const cleanUri = activeTrack.coverUrl
    ? encodeURI(activeTrack.coverUrl.trim())
    : null;

  return (
    <View className="flex-row items-center bg-[#282828] p-2 mx-4 mb-4 rounded-md">
      {/* Обкладинка */}
      {cleanUri ? (
        <Image
          source={{ uri: cleanUri }}
          className="w-10 h-10 rounded-sm bg-[#181818]"
        />
      ) : (
        <View className="w-10 h-10 rounded-sm bg-[#181818]" />
      )}

      {/* Інформація про трек */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-white" numberOfLines={1}>
          {activeTrack.title}
        </Text>
        <Text className="text-[#AAAAAA] text-xs" numberOfLines={1}>
          {activeTrack.artist.name}
        </Text>
      </View>

      {/* Кнопка Play/Pause */}
      <Pressable
        onPress={togglePlayPause}
        className="px-4 py-2 active:opacity-70"
      >
        <Text className="text-lg text-white">
          {isPlaying ? (
            <PlayIcon width={24} height={24} color="white" />
          ) : (
            <PauseIcon width={24} height={24} color="white" />
          )}
        </Text>
      </Pressable>
    </View>
  );
}
