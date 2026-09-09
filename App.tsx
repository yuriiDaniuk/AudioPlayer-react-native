import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';

import { store } from './src/store';
import { setActiveTrack, setIsPlaying } from './src/store/playerSlice';
import { getLastTrack } from './src/utils/storage';
import PlayerBottomSheet from './src/components/PlayerBottomSheet';

// Імпортуємо TrackPlayer для ініціалізації
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';

const TransparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

// Функція ініціалізації плеєра
async function setupPlayer() {
  let isSetup = false;
  try {
    // Перевіряємо, чи плеєр вже ініціалізовано (щоб не крашилося при Hot Reload)
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
      progressUpdateEventInterval: 2,
    });
    isSetup = true;
  }
  return isSetup;
}

export default function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function runSetup() {
      const ready = await setupPlayer();
      
      if (ready) {
        const savedTrack = await getLastTrack();
        if (savedTrack) {
          // 1. Відправляємо в Redux для UI
          store.dispatch(setActiveTrack(savedTrack));
          // Примусово ставимо на паузу, щоб іконка показувала "Play"
          store.dispatch(setIsPlaying(false)); 
          
          // 2. ВАЖЛИВО: Завантажуємо трек у нативний рушій!
          await TrackPlayer.reset(); // Очищаємо чергу
          
          // Виводимо в консоль, щоб бачити, які дані прийшли
          console.log('Відновлений трек:', savedTrack);
          
          await TrackPlayer.add([{
            // Безпечне перетворення ID в рядок (вирішує помилку)
            id: String(savedTrack.id), 
            // Додаємо fallback на випадок, якщо поле називається інакше
            url: savedTrack.audioUrl,
            title: savedTrack.title || 'Невідомий трек',
            artist: savedTrack.artist?.name ?? 'Unknown Artist',
            artwork: savedTrack.coverUrl || '',
          }]);
        }
      }
      
      setIsPlayerReady(ready);
    }
    runSetup();
  }, []);

  // ПОКИ ПЛЕЄР ВМИКАЄТЬСЯ — ПОКАЗУЄМО ЗАВАНТАЖЕННЯ
  if (!isPlayerReady) {
    return (
      <SafeAreaProvider
        style={{
          flex: 1,
          backgroundColor: '#121212',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Provider store={store}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <LinearGradient
            colors={['#062329', '#020d10', '#000000']}
            locations={[0, 0.6, 1]}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <NavigationContainer theme={TransparentTheme}>
                <TabNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </LinearGradient>
        </SafeAreaProvider>

        <PlayerBottomSheet />
      </Provider>
    </GestureHandlerRootView>
  );
}