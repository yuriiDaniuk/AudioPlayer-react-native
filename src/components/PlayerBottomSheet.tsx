import React, { useEffect, useMemo, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import axios from 'axios';
import BottomSheet from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';

import PauseIcon from '../assets/icons/pause.svg';
import PlayIcon from '../assets/icons/play.svg';
import SkipBackIcon from '../assets/icons/skip-back.svg';
import SkipForwardIcon from '../assets/icons/skip-forward.svg';

import { setFullPlayerOpen, setIsPlaying } from '../store/playerSlice';

import type { RootState } from '../store';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.85;

const styles = StyleSheet.create({
  background: { backgroundColor: '#121212' },
});

/** Renders the expanded player sheet with playback, seeking, and playlist controls. */
export default function PlayerBottomSheet() {
  /** Resolves localized player labels and alert messages. */
  const { t } = useTranslation();

  /** Provides the active theme for sheet, artwork, and control colors. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  /** Maintains the imperative reference used to open and close the bottom sheet. */
  const bottomSheetRef = useRef<BottomSheet>(null);

  /** Dispatches player state changes to the Redux store. */
  const dispatch = useDispatch();

  /** Reads sheet visibility, track metadata, and playback state from global state. */
  const { isFullPlayerOpen, activeTrack, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  /** Provides the current playback position and duration for the slider. */
  const { position, duration } = useProgress();

  /** Keeps the sheet at a full-screen snap point. */
  const snapPoints = useMemo(() => ['100%'], []);

  /** Animated artwork scale used to reflect the current playback state. */
  const scale = useSharedValue(isPlaying ? 1 : 0.9);

  // Animate the artwork toward its playing or paused scale when playback changes.
  useEffect(() => {
    scale.value = withSpring(isPlaying ? 1 : 0.9, {
      damping: 15,
      stiffness: 150,
    });
  }, [isPlaying, scale]);

  /** Maps the shared scale value to the artwork transform style. */
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Keep the imperative sheet position synchronized with Redux visibility state.
  useEffect(() => {
    if (isFullPlayerOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isFullPlayerOpen]);

  /** Toggles native playback and updates the corresponding Redux state. */
  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  /**
   * Adds the active track to the server-side playlist and displays the result.
   *
   * The handler exits when no track is selected and maps server failures to a
   * localized fallback message when the response does not contain an error.
   */
  const handleAddToPlaylist = async () => {
    // A playlist request cannot be completed without an active track identifier.
    if (!activeTrack) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/playlist/add',
        {
          trackId: activeTrack.id,
        },
      );

      if (response.data.success) {
        showMessage({
          message: t('alerts.success'),
          description: t('alerts.added'),
          type: 'success',
          icon: 'success',
        });
      }
    } catch (error: any) {
      // Prefer the server-provided error and fall back to the localized message.
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

  /** Converts a duration in seconds into a minutes-and-seconds display string. */
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
        {/* Animated artwork for the active track. */}
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

        {/* Active track title and artist metadata. */}
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

        {/* Playback progress slider and formatted elapsed/remaining times. */}
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
              // Commit the seek only after the user releases the slider thumb.
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

        {/* Playback controls; skip buttons remain presentational placeholders. */}
        <View className="flex-row items-center justify-center w-full gap-10 mt-4">
          {/* Placeholder for the previous-track action. */}
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

          {/* Placeholder for the next-track action. */}
          <Pressable className="active:opacity-70">
            <SkipForwardIcon
              width={36}
              height={36}
              color={isDark ? 'white' : '#111111'}
            />
          </Pressable>
        </View>

        {/* Adds the currently active track to the user's playlist. */}
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
