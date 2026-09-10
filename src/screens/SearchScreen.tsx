import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useColorScheme } from 'nativewind';

import Header from '../components/Header';
import { setActiveTrack, setIsPlaying } from '../store/playerSlice';
import { Track } from '../store/tracksSlice';
import TrackPlayer from 'react-native-track-player';
import { saveLastTrack } from '../utils/storage';
import { useTranslation } from 'react-i18next';

// Імпортуємо іконку лупи (перевір, чи правильний шлях)
import SearchIcon from '../assets/icons/search.svg';

export default function SearchScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // ЛОГІКА ДЕБАУНСУ ТА ПОШУКУ
  useEffect(() => {
    // Якщо поле порожнє, очищаємо результати
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Встановлюємо таймер на 500мс
    const delayDebounceFn = setTimeout(async () => {
      setHasSearched(true);
      try {
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
    }, 500); // Затримка 500 мілісекунд

    // Очищаємо попередній таймер, якщо користувач продовжує друкувати
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <View className="flex-1 bg-transparent">
      <Header />

      <Text className="px-4 py-3 text-2xl font-bold text-black dark:text-white">
        {t('tabs.search')}
      </Text>

      {/* НОВЕ ПОЛЕ ВВОДУ З ІКОНКОЮ */}
      <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 48,
              paddingHorizontal: 12,
              marginHorizontal: 16,
              marginBottom: 16,
              borderRadius: 8,
              backgroundColor: isDark ? '#282828' : '#E5E7EB', // Еквівалент gray-200 / #282828
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
                includeFontPadding: false, // Головний рятувальник від скакання на Android
                height: '100%',
              }}
            />
            <SearchIcon 
              width={20} 
              height={20} 
              color={isDark ? '#AAAAAA' : '#666666'} 
            />
          </View>

      {/* РЕЗУЛЬТАТИ ПОШУКУ */}
      {isLoading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator
            size="large"
            color={isDark ? '#FFFFFF' : '#555555'}
          />
        </View>
      ) : hasSearched && results.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <Text className="text-base text-gray-600 dark:text-[#AAAAAA]">
            Нічого не знайдено
          </Text>
        </View>
      ) : (
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
