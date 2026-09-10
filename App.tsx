import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
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

import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';

import './src/locales/i18n';

import { loadTheme } from './src/store/themeSlice';
import ThemeProvider from './src/components/ThemeProvider';

import { useColorScheme } from 'nativewind';

// 1. Створюємо дві теми для навігації
const LightNavTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

// 2. Створюємо компонент-обгортку для контенту
function RootApp() {
  // Дістаємо поточну тему від NativeWind (яка вже синхронізована з Redux!)
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Динамічні кольори для фонового градієнта
  const gradientColors = isDark 
    ? ['#062329', '#020d10', '#000000'] 
    : ['#E0F7FA', '#F5F5F5', '#FFFFFF']; // Світлий, приємний градієнт

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.6, 1]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <NavigationContainer theme={isDark ? DarkNavTheme : LightNavTheme}>
            <TabNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </LinearGradient>
      
      <PlayerBottomSheet />
    </SafeAreaProvider>
  );
}

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
  const { t } = useTranslation();
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function runSetup() {
      store.dispatch(loadTheme());

      const ready = await setupPlayer();
      
      if (ready) {
        const savedTrack = await getLastTrack();
        if (savedTrack && savedTrack.audioUrl) {
          store.dispatch(setActiveTrack(savedTrack));
          store.dispatch(setIsPlaying(false));
          
          // 2. ВАЖЛИВО: Завантажуємо трек у нативний рушій!
          await TrackPlayer.reset(); // Очищаємо чергу
          
          // Створюємо ідеально чистий об'єкт для нативного iOS
          const trackToAdd: any = {
            id: String(savedTrack.id),
            url: savedTrack.audioUrl, // Обов'язкове поле
            title: savedTrack.title || 'Unknown Title',
            artist: savedTrack.artist?.name || 'Unknown Artist',
          };

          // Додаємо обкладинку ТІЛЬКИ якщо вона реально існує (щоб уникнути EXC_BAD_ACCESS)
          if (savedTrack.coverUrl) {
            trackToAdd.artwork = savedTrack.coverUrl;
          }

          await TrackPlayer.add([trackToAdd]);
        }
      }
      
      setIsPlayerReady(ready);
    }
    runSetup();
  }, []);

  useEffect(() => {
    // Підписуємося на зміни мережі
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
        // Якщо інтернет зник
        showMessage({
          message: t('alerts.connectionLostTitle'),
          description: t('alerts.connectionLostDescription'),
          type: 'danger',
          icon: 'danger',
          duration: 4000,
        });
      } else if (state.isConnected === true && state.isInternetReachable === true) {
      }
    });

    // Відписуємося при розмонтуванні
    return () => {
      unsubscribe();
    };
  }, [t]);

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
        <ThemeProvider>
        <RootApp />
        <FlashMessage position="top" />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}