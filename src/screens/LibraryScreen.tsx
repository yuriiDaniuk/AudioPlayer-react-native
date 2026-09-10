import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import Header from '../components/Header';
import { setActiveTrack, setIsPlaying } from '../store/playerSlice'; 
import { Track } from '../store/tracksSlice'; // Якщо в тебе там лежать типи

import TrackPlayer from 'react-native-track-player';
import { saveLastTrack } from '../utils/storage';

import { useTranslation } from 'react-i18next';

export default function LibraryScreen() {
  const { t } = useTranslation();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Цей хук спрацьовує КОЖЕН РАЗ, коли екран стає активним
  useFocusEffect(
    useCallback(() => {
      const fetchPlaylist = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/playlist');
          // Згадай: наш бекенд повертає об'єкт { tracks: [...] }
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

  // Функція для увімкнення треку прямо з Бібліотеки
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
  // 1. "Оптимістичне оновлення": одразу прибираємо трек з екрана, не чекаючи бекенду, щоб додаток здавався дуже швидким
  setTracks((prevTracks) => prevTracks.filter(track => track.id !== trackId));

  try {
    // 2. Відправляємо запит на видалення
    await axios.post('http://localhost:3000/api/playlist/remove', { trackId });
  } catch (error) {
    console.error("Помилка видалення", error);
    // Якщо сталась помилка, в ідеалі треба повернути трек назад у стейт, 
    // але для простоти можна просто перезапросити весь плейлист.
  }
};

  return (
    <View className="flex-1 bg-transparent">
      {/* Хедер залишається на місці */}
      <Header />
      
      <Text className="px-4 py-3 text-2xl font-bold text-white">{t('library.title')}</Text>

      {/* Показуємо спінер, поки йде запит */}
      {isLoading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : tracks.length === 0 ? (
        /* Показуємо повідомлення, якщо плейлист порожній */
        <View className="items-center justify-center flex-1">
          <Text className="text-[#AAAAAA] text-base">{t('library.empty')}</Text>
          <Text className="mt-2 text-sm text-gray-500">{t('library.addTracks')}</Text>
        </View>
      ) : (
        /* Виводимо треки вертикальним списком */
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
                  className="w-14 h-14 rounded-md bg-[#282828]"
                />
                <View className="justify-center flex-1 ml-3">
                  <Text className="text-base font-semibold text-white" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-xs text-[#AAAAAA]" numberOfLines={1}>
                    {item.artist?.name || t('player.unknownArtist')}
                  </Text>
                </View>
              </Pressable>

              <Pressable 
                onPress={() => handleRemoveTrack(item.id)}
                className="items-center justify-center w-10 h-10 ml-2 rounded-full active:bg-[#444444]"
              >
                <Text className="text-xl text-[#AAAAAA]">✕</Text>
              </Pressable>
              
            </View>
          )}
        />
      )}
    </View>
  );
}