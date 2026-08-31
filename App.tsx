import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import Header from './src/components/Header';
import TrackGrid from './src/components/TrackGrid';
import MiniPlayer from './src/components/MiniPlayer';
import BottomNav from './src/components/BottomNav';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        
        <Header />
        <TrackGrid />
        <MiniPlayer />
        <BottomNav />
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}