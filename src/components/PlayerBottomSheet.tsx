import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setFullPlayerOpen, setIsPlaying } from '../store/playerSlice';

// Імпортуємо TrackPlayer та useProgress для слайдера
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

// Імпортуємо наші SVG іконки
import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import SkipBackIcon from '../assets/icons/skip-back.svg';
import SkipForwardIcon from '../assets/icons/skip-forward.svg';

import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.85;

const styles = StyleSheet.create({
  background: { backgroundColor: '#121212' },
});

export default function PlayerBottomSheet() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();

  const { isFullPlayerOpen, activeTrack, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  // Дістаємо поточний час пісні для слайдера
  const { position, duration } = useProgress();

  const snapPoints = useMemo(() => ['100%'], []);
  const scale = useSharedValue(isPlaying ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(isPlaying ? 1 : 0.9, {
      damping: 15,
      stiffness: 150,
    });
  }, [isPlaying, scale]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (isFullPlayerOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isFullPlayerOpen]);

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleAddToPlaylist = async () => {
    // Перевіряємо, чи є взагалі активний трек
    if (!activeTrack) return;

    try {
      // Axios сам налаштовує заголовки і парсить JSON
      const response = await axios.post(
        'http://localhost:3000/api/playlist/add',
        {
          trackId: activeTrack.id,
        },
      );

      // Якщо помилок немає, показуємо сповіщення
      if (response.data.success) {
        showMessage({
          message: t('alerts.success'),
          description: t('alerts.added'),
          type: 'success',
          icon: 'success',
        });
      }
    } catch (error: any) {
      // Axios ховає відповідь сервера з помилкою в error.response.data
      const errorMessage =
        error.response?.data?.error || t('alerts.serverError');

      showMessage({
        message: t('alerts.error'),
        description: errorMessage,
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  const cleanUri = activeTrack?.coverUrl
    ? encodeURI(activeTrack.coverUrl.trim())
    : null;

  // Функція для форматування секунд у вигляд 00:00
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      onClose={() => dispatch(setFullPlayerOpen(false))}
      backgroundStyle={[
        styles.background,
        { backgroundColor: isDark ? '#121212' : '#F5F5F5' },
      ]}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#ffffff' : '#000000',
        opacity: 0.3,
      }}
    >
      <View className="items-center flex-1 px-6 pt-10">
        <Animated.Image
          source={{ uri: cleanUri || '' }}
          style={[
            {
              width: ARTWORK_SIZE,
              height: ARTWORK_SIZE,
              borderRadius: 16,
              backgroundColor: isDark ? '#181818' : '#E5E5E5',
            },
            animatedImageStyle,
          ]}
        />

        <View className="items-center w-full mt-10 mb-8">
          <Text
            className="mb-1 text-2xl font-bold text-black dark:text-white"
            numberOfLines={1}
          >
            {activeTrack?.title ?? 'Немає активного треку'}
          </Text>
          <Text
            className="text-gray-600 dark:text-[#AAAAAA] text-lg"
            numberOfLines={1}
          >
            {activeTrack?.artist?.name ?? 'Невідомий артист'}
          </Text>
        </View>

        {/* --- СЛАЙДЕР --- */}
        <View className="w-full mt-4 mb-8">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            minimumTrackTintColor={isDark ? '#FFFFFF' : '#111111'}
            maximumTrackTintColor={isDark ? '#404040' : '#D1D1D1'}
            thumbTintColor={isDark ? '#FFFFFF' : '#111111'}
            onSlidingComplete={async (value: number) => {
              await TrackPlayer.seekTo(value);
            }}
          />
          <View className="flex-row justify-between mt-[-5]">
            <Text className="text-gray-600 dark:text-[#AAAAAA] text-xs">
              {formatTime(position)}
            </Text>
            <Text className="text-gray-600 dark:text-[#AAAAAA] text-xs">
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* --- КНОПКИ КЕРУВАННЯ --- */}
        <View className="flex-row items-center justify-center w-full gap-10 mt-4">
          {/* ЗАГЛУШКА: Кнопка Назад */}
          <Pressable className="active:opacity-70">
            <SkipBackIcon
              width={36}
              height={36}
              color={isDark ? 'white' : '#111111'}
            />
          </Pressable>

          <Pressable
            onPress={togglePlayPause}
            className="items-center justify-center w-20 h-20 rounded-full bg-[#111111] dark:bg-white active:scale-95"
          >
            {isPlaying ? (
              <PauseIcon
                width={36}
                height={36}
                color={isDark ? 'black' : 'white'}
              />
            ) : (
              <View className="ml-1">
                <PlayIcon
                  width={36}
                  height={36}
                  color={isDark ? 'black' : 'white'}
                />
              </View>
            )}
          </Pressable>

          {/* ЗАГЛУШКА: Кнопка Далі */}
          <Pressable className="active:opacity-70">
            <SkipForwardIcon
              width={36}
              height={36}
              color={isDark ? 'white' : '#111111'}
            />
          </Pressable>
        </View>
        <View className="items-center justify-center w-full mt-4">
          <Pressable
            onPress={handleAddToPlaylist}
            className="items-center justify-center w-full h-12 rounded-full bg-gray-200 active:bg-gray-300 dark:bg-[#282828] dark:active:bg-[#404040]"
          >
            <Text className="text-xl text-gray-900 dark:text-white">
              {t('player.addTrack')}
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}
