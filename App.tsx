import React from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import Header from './src/components/Header';
import TrackGrid from './src/components/TrackGrid';
import MiniPlayer from './src/components/MiniPlayer';
import BottomNav from './src/components/BottomNav';

// Створюємо "всеїдний" StatusBar, який ігнорує суворі типи
const StatusBar = RNStatusBar as any;

export default function App() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#062329', '#020d10', '#000000']}
        locations={[0, 0.35, 0.7]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 bg-transparent">
          
          <StatusBar 
            barStyle="light-content" 
            {...(Platform.OS === 'android' ? { translucent: true, backgroundColor: 'transparent' } : {})}
          />
          
          <Header />
          <TrackGrid />
          <MiniPlayer />
          <BottomNav />
          
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}