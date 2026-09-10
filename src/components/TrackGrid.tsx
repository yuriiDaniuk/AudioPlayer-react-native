import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useColorScheme } from 'nativewind';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';

import { setActiveTrack, setIsPlaying } from '../store/playerSlice';
import { fetchTracks } from '../store/tracksSlice';
import { saveLastTrack } from '../utils/storage';

import type { AppDispatch, RootState } from '../store';
import type { Track } from '../store/tracksSlice';

/** Loads tracks and renders them as a three-column playable grid. */
export default function TrackGrid() {
  /** Provides the active theme for the loading indicator. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  /** Dispatches typed track-loading and player actions to Redux. */
  const dispatch = useDispatch<AppDispatch>();

  /** Reads the cached tracks and their current loading status from Redux. */
  const { items: tracks, status } = useSelector(
    (state: RootState) => state.tracks,
  );

  // Fetch tracks only on the initial idle state; subsequent renders use the store cache.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTracks());
    }
  }, [status, dispatch]);

  /**
   * Activates a selected track and starts playback through TrackPlayer.
   *
   * @param track Track selected from the grid.
   * @returns Promise that resolves after the track has started playing.
   */
  const handleTrackPress = async (track: Track) => {
    dispatch(setActiveTrack(track));
    dispatch(setIsPlaying(true));
    await saveLastTrack(track);

    // Replace the current player queue with the selected track before playback.
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: track.id,
      url: track.audioUrl,
      title: track.title,
      artist: track.artist.name,
      artwork: track.coverUrl,
    });
    await TrackPlayer.play();
  };

  /** Renders one track tile with normalized artwork and playback interaction. */
  const renderGridItem = ({ item }: { item: Track }) => {
    // Reject missing or whitespace-only URLs before passing them to the native image view.
    const hasValidUrl =
      item.coverUrl &&
      typeof item.coverUrl === 'string' &&
      item.coverUrl.trim().length > 0;
    const cleanUri = hasValidUrl ? encodeURI(item.coverUrl.trim()) : null;

    return (
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
    // Keep the grid area stable while the initial track request is pending.
    return (
      <View className="items-center justify-center flex-1 pt-10">
        <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#555555'} />
      </View>
    );
  }

  // Render the cached track collection as a responsive three-column list.
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
