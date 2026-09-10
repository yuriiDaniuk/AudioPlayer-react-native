import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import NetInfo from '@react-native-community/netinfo';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useColorScheme } from 'nativewind';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';

import './src/locales/i18n';

import PlayerBottomSheet from './src/components/PlayerBottomSheet';
import ThemeProvider from './src/components/ThemeProvider';
import TabNavigator from './src/navigation/TabNavigator';

import { store } from './src/store';
import { setActiveTrack, setIsPlaying } from './src/store/playerSlice';
import { loadTheme } from './src/store/themeSlice';
import { getLastTrack } from './src/utils/storage';

/** Navigation theme for light mode with a transparent screen background. */
const LightNavTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

/** Navigation theme for dark mode with a transparent screen background. */
const DarkNavTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

/** Provides themed application backgrounds, navigation, and the expanded player. */
function RootApp() {
  /** Reads the NativeWind theme synchronized by ThemeProvider. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use contrasting background gradients so content remains readable in both themes.
  const gradientColors = isDark
    ? ['#062329', '#020d10', '#000000']
    : ['#E0F7FA', '#F5F5F5', '#FFFFFF'];

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

/**
 * Initializes TrackPlayer once and configures its supported transport controls.
 *
 * @returns Whether TrackPlayer is ready for use.
 */
async function setupPlayer() {
  let isSetup = false;
  try {
    // Probe the existing player so hot reload does not initialize it twice.
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

/** Bootstraps theme, audio playback, network feedback, and the application tree. */
export default function App() {
  /** Resolves localized network status messages. */
  const { t } = useTranslation();

  /** Indicates whether the player and persisted playback state are ready. */
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    /** Initializes dependencies and restores the last active track. */
    async function runSetup() {
      store.dispatch(loadTheme());

      const ready = await setupPlayer();
      
      if (ready) {
        const savedTrack = await getLastTrack();
        if (savedTrack && savedTrack.audioUrl) {
          store.dispatch(setActiveTrack(savedTrack));
          store.dispatch(setIsPlaying(false));
          
          // Restore the saved track in the native player without starting playback.
          await TrackPlayer.reset();

          // Build a minimal native track object to avoid passing unsupported fields.
          const trackToAdd: any = {
            id: String(savedTrack.id),
            url: savedTrack.audioUrl,
            title: savedTrack.title || 'Unknown Title',
            artist: savedTrack.artist?.name || 'Unknown Artist',
          };

          // Add artwork only when present to avoid native image-loading failures.
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
    // Subscribe to connectivity changes so users receive immediate offline feedback.
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
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

    // Remove the listener when the application root unmounts.
    return () => {
      unsubscribe();
    };
  }, [t]);

  // Block the main application tree until player initialization and restoration finish.
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