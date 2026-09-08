import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';

import { store } from './src/store';
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
