import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { useColorScheme } from 'nativewind';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';

import PauseIcon from '../assets/icons/pause.svg';
import PlayIcon from '../assets/icons/play.svg';

import { setFullPlayerOpen, setIsPlaying } from '../store/playerSlice';

import type { GestureResponderEvent } from 'react-native';
import type { RootState } from '../store';

/** Renders the compact player controls for the currently active track. */
export default function MiniPlayer() {
  /** Provides the active theme for icon and progress-bar colors. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  /** Dispatches player state changes to the Redux store. */
  const dispatch = useDispatch();

  /** Reads the active track and current playback state from the global store. */
  const { activeTrack, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  /** Provides the current playback position and total track duration in seconds. */
  const { position, duration } = useProgress();

  /** Stores the measured width used to convert tap coordinates into seek positions. */
  const [barWidth, setBarWidth] = useState(0);

  // Do not render player controls until a track has been selected.
  if (!activeTrack) {
    return null;
  }

  /** Toggles native playback and synchronizes the local player state in Redux. */
  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  /**
   * Seeks to the position represented by a tap on the progress bar.
   *
   * @param event Press event containing the tap's horizontal coordinate.
   */
  const handleSeek = async (event: GestureResponderEvent) => {
    if (duration === 0 || barWidth === 0) return;

    // Convert the tap coordinate into a normalized position within the progress bar.
    const clickX = event.nativeEvent.locationX;
    const percentage = clickX / barWidth;
    const targetTime = duration * percentage;

    await TrackPlayer.seekTo(targetTime);
  };

  // Normalize the artwork URL before passing it to the native image component.
  const cleanUri = activeTrack.coverUrl
    ? encodeURI(activeTrack.coverUrl.trim())
    : null;

  // Guard against division by zero before converting progress into a percentage.
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Pressable 
      onPress={() => dispatch(setFullPlayerOpen(true))}
      className="flex-row items-center bg-[#EAEAEA] dark:bg-[#282828] p-2 mx-2 mb-2 rounded-md overflow-hidden relative active:opacity-95 border border-[#D4D4D4] dark:border-transparent"
    >
      {/* Track artwork, with a placeholder when no valid URL is available. */}
      {cleanUri ? (
        <Image
          source={{ uri: cleanUri }}
          className="w-10 h-10 rounded-sm bg-gray-300 dark:bg-[#181818]"
        />
      ) : (
        <View className="w-10 h-10 rounded-sm bg-gray-300 dark:bg-[#181818]" />
      )}

      {/* Track metadata displayed beside the artwork. */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-black dark:text-white" numberOfLines={1}>
          {activeTrack.title}
        </Text>
        <Text className="text-gray-600 dark:text-[#AAAAAA] text-xs" numberOfLines={1}>
          {activeTrack.artist.name}
        </Text>
      </View>

      {/* Nested control toggles playback without opening the full player. */}
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          togglePlayPause().catch(console.error);
        }}
        className="flex items-center justify-center px-4 py-2 active:opacity-70"
      >
        {isPlaying ? (
          <PauseIcon width={24} height={24} color={isDark ? 'white' : 'black'} />
        ) : (
          <PlayIcon width={24} height={24} color={isDark ? 'white' : 'black'} />
        )}
      </Pressable>

      {/* Full-width progress target supports tap-to-seek interaction. */}
      <Pressable
        // Measure the rendered width so tap coordinates can be mapped to time.
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        onPress={(event) => {
          event.stopPropagation();
          handleSeek(event).catch(console.error);
        }}
        // Keep the hit area taller than the visible bar while anchoring the bar at the bottom.
        className="absolute bottom-0 left-0 right-0 justify-end h-4"
      >
        <View className="h-[2px] bg-gray-300 dark:bg-[#404040] w-full relative">
          <View
            className="absolute top-0 left-0 h-full bg-black dark:bg-white"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </Pressable>
    </Pressable>
  );
}
