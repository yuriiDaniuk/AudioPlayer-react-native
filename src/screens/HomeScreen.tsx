import React from 'react';
import { View } from 'react-native';
import TrackGrid from '../components/TrackGrid';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-transparent">
      <TrackGrid />
    </View>
  );
}