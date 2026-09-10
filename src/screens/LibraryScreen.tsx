import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import axios from 'axios';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TrackPlayer from 'react-native-track-player';
import { useDispatch } from 'react-redux';

import Header from '../components/Header';

import { setActiveTrack, setIsPlaying } from '../store/playerSlice';
import type { Track } from '../store/tracksSlice';
import { saveLastTrack } from '../utils/storage';

/** Renders the user's saved playlist with playback and removal controls. */
export default function LibraryScreen() {
  /** Resolves localized library labels and player fallbacks. */
  const { t } = useTranslation();

  /** Provides the active theme for the loading indicator. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  /** Tracks currently returned by the library endpoint. */
  const [tracks, setTracks] = useState<Track[]>([]);

  /** Indicates whether the focused screen is loading the saved playlist. */
  const [isLoading, setIsLoading] = useState(true);

  /** Dispatches selected tracks and playback state to Redux. */
  const dispatch = useDispatch();

  // Refresh the library whenever the screen receives focus.
  useFocusEffect(
    useCallback(() => {
      /** Fetches the current saved playlist and updates the screen state. */
      const fetchPlaylist = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/playlist');
          setTracks(response.data.tracks || []);
        } catch (error) {
          console.error('Помилка завантаження плейлиста', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlaylist();
    }, []),
  );

  /** Persists a selected library track, loads it, and starts playback. */
  const handlePlayTrack = async (track: Track) => {
    dispatch(setActiveTrack(track));
    dispatch(setIsPlaying(true));
    await saveLastTrack(track);

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

  /**
   * Removes a track from local state and requests its removal from the server.
   *
   * The local list is updated before the request completes so the removal is
   * reflected immediately in the library UI.
   *
   * @param trackId Identifier of the track to remove.
   */
  const handleRemoveTrack = async (trackId: string) => {
    setTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
    try {
      await axios.post('http://localhost:3000/api/playlist/remove', { trackId });
    } catch (error) {
      console.error('Помилка видалення', error);
    }
  };

  return (
    <View className="flex-1 bg-transparent">
      {/* Shared application header and library title. */}
      <Header />

      <Text className="px-4 py-3 text-2xl font-bold text-black dark:text-white">
        {t('library.title')}
      </Text>

      {isLoading ? (
        // Keep the loading indicator visible until the focused request settles.
        <View className="items-center justify-center flex-1">
          <ActivityIndicator
            size="large"
            color={isDark ? '#FFFFFF' : '#555555'}
          />
        </View>
      ) : tracks.length === 0 ? (
        // Distinguish an empty library from a still-loading request.
        <View className="items-center justify-center flex-1">
          <Text className="text-gray-600 dark:text-[#AAAAAA] text-base">
            {t('library.empty')}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">{t('library.addTracks')}</Text>
        </View>
      ) : (
        // Render each saved track with playback and removal actions.
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center px-4 py-2 mb-2 rounded-lg">
              <Pressable
                onPress={() => handlePlayTrack(item)}
                className="flex-row items-center flex-1 active:opacity-70"
              >
                <Image
                  source={{
                    uri: item.coverUrl || 'https://via.placeholder.com/150',
                  }}
                  className="w-14 h-14 rounded-md bg-gray-300 dark:bg-[#282828]"
                />
                <View className="justify-center flex-1 ml-3">
                  <Text
                    className="text-base font-semibold text-black dark:text-white"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-xs text-gray-600 dark:text-[#AAAAAA]"
                    numberOfLines={1}
                  >
                    {item.artist?.name || t('player.unknownArtist')}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleRemoveTrack(item.id)}
                className="items-center justify-center w-10 h-10 ml-2 rounded-full active:bg-gray-200 dark:active:bg-[#444444]"
              >
                <Text className="text-xl text-gray-500 dark:text-[#AAAAAA]">✕</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}