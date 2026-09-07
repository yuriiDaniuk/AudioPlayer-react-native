import React, { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import Header from './src/components/Header';
import TrackGrid from './src/components/TrackGrid';
import MiniPlayer from './src/components/MiniPlayer';
import BottomNav from './src/components/BottomNav';

import { Provider } from 'react-redux';
import { store } from './src/store';

import TrackPlayer from 'react-native-track-player';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PlayerBottomSheet from './src/components/PlayerBottomSheet';

// Створюємо "всеїдний" StatusBar, який ігнорує суворі типи
const StatusBar = RNStatusBar as any;

export default function App() {
  useEffect(() => {
    async function setupPlayer() {
      try {
        await TrackPlayer.setupPlayer();
        console.log('✅ Плеєр успішно ініціалізовано');
      } catch (e) {
        console.log('Помилка ініціалізації плеєра:', e);
      }
    }
    setupPlayer();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Provider store={store}>
        {/* 1. ДОДАНО: style={{ flex: 1 }} для SafeAreaProvider */}
        <SafeAreaProvider style={{ flex: 1 }}>
          
          {/* 2. ЗАМІНЕНО: className="flex-1" на надійний style={{ flex: 1 }} */}
          <LinearGradient
            colors={['#062329', '#020d10', '#000000']}
            locations={[0, 0.35, 0.7]}
            style={{ flex: 1 }} 
          >
            <SafeAreaView className="flex-1 bg-transparent">
              <StatusBar
                barStyle="light-content"
                {...(Platform.OS === 'android'
                  ? { translucent: true, backgroundColor: 'transparent' }
                  : {})}
              />

              <Header />
              <TrackGrid />
              <MiniPlayer />
              <BottomNav />
            </SafeAreaView>
          </LinearGradient>
          
          <PlayerBottomSheet />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}