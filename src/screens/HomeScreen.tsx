import React from 'react';
import { View } from 'react-native';

import Header from '../components/Header';
import TrackGrid from '../components/TrackGrid';

/** Renders the home screen with navigation controls and the track collection. */
export default function HomeScreen() {
  return (
    <View className="flex-1 bg-transparent">
      {/* Shared application header with navigation and user controls. */}
      <Header />

      {/* Track collection with loading, artwork, and playback interactions. */}
      <TrackGrid />
    </View>
  );
}