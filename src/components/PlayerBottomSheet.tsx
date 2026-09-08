import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

// Додаємо setIsPlaying для керування кнопкою
import { setFullPlayerOpen, setIsPlaying } from '../store/playerSlice'; 
import TrackPlayer from 'react-native-track-player';

// 1. Імпортуємо Reanimated
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.85; // Обкладинка займатиме 85% ширини екрана

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#121212',
  },
});

export default function PlayerBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  
  // 2. Дістаємо isPlaying з Redux
  const { isFullPlayerOpen, activeTrack, isPlaying } = useSelector((state: RootState) => state.player);

  const snapPoints = useMemo(() => ['100%'], []);

  // === АНІМАЦІЯ ОБКЛАДИНКИ ===
  // Якщо грає - масштаб 1 (100%), якщо пауза - 0.9 (90%)
  const scale = useSharedValue(isPlaying ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(isPlaying ? 1 : 0.9, {
      damping: 15, 
      stiffness: 150, 
    });
  }, [isPlaying, scale]);

  // Прив'язуємо значення до стилів
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  // ==========================

  useEffect(() => {
    if (isFullPlayerOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isFullPlayerOpen]);

  // Функція для перемикання музики
  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  const cleanUri = activeTrack?.coverUrl ? encodeURI(activeTrack.coverUrl.trim()) : null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      onClose={() => dispatch(setFullPlayerOpen(false))}
      backgroundStyle={styles.background}
      handleIndicatorStyle={{ backgroundColor: '#ffffff', opacity: 0.3 }} // Біла смужка зверху
    >
      <View className="items-center flex-1 px-6 pt-10">
        
        {/* 3. Анімована обкладинка */}
        <Animated.Image 
          source={{ uri: cleanUri || '' }}
          style={[
            { width: ARTWORK_SIZE, height: ARTWORK_SIZE, borderRadius: 16, backgroundColor: '#181818' },
            animatedImageStyle // Підключаємо нашу анімацію
          ]}
        />

        <View className="items-center w-full mt-10 mb-8">
          <Text className="mb-1 text-2xl font-bold text-white" numberOfLines={1}>
            {activeTrack?.title ?? 'Немає активного треку'}
          </Text>
          <Text className="text-[#AAAAAA] text-lg" numberOfLines={1}>
            {activeTrack?.artist?.name ?? 'Невідомий артист'}
          </Text>
        </View>

        {/* Кнопка керування для тестування анімації (поки що текстові емодзі для простоти) */}
        <Pressable 
          onPress={togglePlayPause} 
          className="items-center justify-center w-20 h-20 mt-4 bg-white rounded-full active:scale-95"
        >
           <Text className="text-3xl text-black">
             {isPlaying ? '⏸' : '▶️'}
           </Text>
        </Pressable>

      </View>
    </BottomSheet>
  );
}