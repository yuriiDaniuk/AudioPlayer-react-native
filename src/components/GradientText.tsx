import React from 'react';
import { Text } from 'react-native';
import MaskedViewBase from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

// Приводимо його до any, щоб TypeScript не застосовував старі зламані типи
const MaskedView = MaskedViewBase as any;

interface GradientTextProps {
  text: string;
  className?: string;
  colors?: string[];
}

export default function GradientText({ 
  text, 
  className = '', 
  colors = ['#FF0000', '#FF8C00'] 
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text className={`${className} bg-transparent`}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className={`${className} opacity-0`}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}