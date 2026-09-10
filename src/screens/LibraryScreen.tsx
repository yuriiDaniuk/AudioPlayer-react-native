import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import Header from '../components/Header';
import { setActiveTrack, setIsPlaying } from '../store/playerSlice'; 
import { Track } from '../store/tracksSlice'; 

import TrackPlayer from 'react-native-track-player';
import { saveLastTrack } from '../utils/storage';

import { useTranslation } from 'react-i18next';
// Додаємо імпорт теми для спінера
import { useColorScheme } from 'nativewind';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchPlaylist = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/playlist');
          setTracks(response.data.tracks || []);
        } catch (error) {
          console.error("Помилка завантаження плейлиста", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlaylist();
    }, [])
  );

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

  const handleRemoveTrack = async (trackId: string) => {
    setTracks((prevTracks) => prevTracks.filter(track => track.id !== trackId));
    try {
      await axios.post('http://localhost:3000/api/playlist/remove', { trackId });
    } catch (error) {
      console.error("Помилка видалення", error);
    }
  };

  return (
    <View className="flex-1 bg-transparent">
      <Header />
      
      <Text className="px-4 py-3 text-2xl font-bold text-black dark:text-white">
        {t('library.title')}
      </Text>

      {isLoading ? (
        <View className="items-center justify-center flex-1">
          {/* Робимо спінер сірим, щоб його було видно на обох фонах */}
          <ActivityIndicator size="large" color={isDark ? "#FFFFFF" : "#555555"} />
        </View>
      ) : tracks.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <Text className="text-gray-600 dark:text-[#AAAAAA] text-base">{t('library.empty')}</Text>
          <Text className="mt-2 text-sm text-gray-500">{t('library.addTracks')}</Text>
        </View>
      ) : (
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
                  source={{ uri: item.coverUrl || 'https://via.placeholder.com/150' }} 
                  // Додано адаптивний фон для плейсхолдера картинки
                  className="w-14 h-14 rounded-md bg-gray-300 dark:bg-[#282828]"
                />
                <View className="justify-center flex-1 ml-3">
                  {/* Додано text-black */}
                  <Text className="text-base font-semibold text-black dark:text-white" numberOfLines={1}>
                    {item.title}
                  </Text>
                  {/* Додано text-gray-600 */}
                  <Text className="text-xs text-gray-600 dark:text-[#AAAAAA]" numberOfLines={1}>
                    {item.artist?.name || t('player.unknownArtist')}
                  </Text>
                </View>
              </Pressable>

              <Pressable 
                onPress={() => handleRemoveTrack(item.id)}
                // Додано адаптивний ефект натискання
                className="items-center justify-center w-10 h-10 ml-2 rounded-full active:bg-gray-200 dark:active:bg-[#444444]"
              >
                {/* Додано text-gray-500 */}
                <Text className="text-xl text-gray-500 dark:text-[#AAAAAA]">✕</Text>
              </Pressable>
              
            </View>
          )}
        />
      )}
    </View>
  );
}