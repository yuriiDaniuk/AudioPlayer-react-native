import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import axios from 'axios';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import TrackPlayer from 'react-native-track-player';
import { useDispatch } from 'react-redux';

import SearchIcon from '../assets/icons/search.svg';
import Header from '../components/Header';

import { setActiveTrack, setIsPlaying } from '../store/playerSlice';
import { saveLastTrack } from '../utils/storage';

import type { Track } from '../store/tracksSlice';

/** Renders the track search experience and starts playback for a selected result. */
export default function SearchScreen() {
  /** Resolves localized labels and placeholders used by the screen. */
  const { t } = useTranslation();

  /** Dispatches player state transitions to the Redux store. */
  const dispatch = useDispatch();

  /** Provides the active application color scheme for theme-aware styles. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  /** Current value of the search input. */
  const [query, setQuery] = useState('');

  /** Tracks returned by the latest completed search request. */
  const [results, setResults] = useState<Track[]>([]);

  /** Indicates whether a non-empty query has completed its search attempt. */
  const [hasSearched, setHasSearched] = useState(false);

  /** Indicates that the debounced search request is still in progress. */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Persists a selected track, loads it into the audio player, and starts playback.
   *
   * @param track Track selected from the search results.
   * @returns Promise that resolves after the track has started playing.
   */
  const handlePlayTrack = async (track: Track) => {
    dispatch(setActiveTrack(track));
    dispatch(setIsPlaying(true));
    await saveLastTrack(track);

    // Replace the current queue with the selected track before starting playback.
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
   * Searches the playlist after the user pauses input and keeps the result state
   * synchronized with the current query.
   *
   * The cleanup function cancels a pending debounce timer when the query changes
   * or the component unmounts.
   */
  useEffect(() => {
    // An empty query resets the search state without making a network request.
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Delay the request until the user has paused typing for 500 milliseconds.
    const delayDebounceFn = setTimeout(async () => {
      setHasSearched(true);
      try {
        // Fetch the complete playlist, then apply the title and artist filters locally.
        const response = await axios.get('http://localhost:3000/api/playlist');
        const allTracks: Track[] = response.data.tracks || [];

        const filtered = allTracks.filter(
          track =>
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist?.name.toLowerCase().includes(query.toLowerCase()),
        );

        setResults(filtered);
      } catch (error) {
        console.error('Помилка пошуку', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // Cancel the previous timer when the query changes before the delay expires.
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <View className="flex-1 bg-transparent">
      {/* Global navigation and screen heading. */}
      <Header />

      <Text className="px-4 py-3 text-2xl font-bold text-black dark:text-white">
        {t('tabs.search')}
      </Text>

      {/* Search bar wrapper containing the controlled input and search icon. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 48,
          paddingHorizontal: 12,
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 8,
          backgroundColor: isDark ? '#282828' : '#E5E7EB',
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('search.placeholder')}
          placeholderTextColor="#888888"
          returnKeyType="search"
          textAlignVertical="center"
          style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 16,
            color: isDark ? '#FFFFFF' : '#000000',
            padding: 0,
            margin: 0,
            includeFontPadding: false,
            height: '100%',
          }}
        />
        <SearchIcon
          width={20}
          height={20}
          color={isDark ? '#AAAAAA' : '#666666'}
        />
      </View>

      {/* Search content: loading state, empty state, or the matching track list. */}
      {isLoading ? (
        // Display progress while the debounced playlist request is pending.
        <View className="items-center justify-center flex-1">
          <ActivityIndicator
            size="large"
            color={isDark ? '#FFFFFF' : '#555555'}
          />
        </View>
      ) : hasSearched && results.length === 0 ? (
        // Display feedback when a completed search produced no matching tracks.
        <View className="items-center justify-center flex-1">
          <Text className="text-base text-gray-600 dark:text-[#AAAAAA]">
            {t('search.noResults')}
          </Text>
        </View>
      ) : (
        // Render each matching track as an actionable playback row.
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePlayTrack(item)}
              className="flex-row items-center px-4 py-2 mb-2 rounded-lg active:opacity-70"
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
          )}
        />
      )}
    </View>
  );
}
