import React from 'react';
import { Text } from 'react-native';

import MaskedViewBase from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

// The installed package types are incompatible with this project's React Native version.
const MaskedView = MaskedViewBase as any;

/** Configuration for rendering text filled with a horizontal linear gradient. */
interface GradientTextProps {
  /** Text content rendered both by the mask and the gradient layer. */
  text: string;

  /** Optional NativeWind classes applied to both text layers. */
  className?: string;

  /** Gradient color stops ordered from the left edge to the right edge. */
  colors?: string[];
}

/**
 * Renders text whose visible glyphs are filled by a horizontal linear gradient.
 *
 * @param props Text content, optional styles, and gradient color stops.
 * @returns A masked gradient containing the supplied text.
 */
export default function GradientText({
  text,
  className = '',
  colors = ['#FF0000', '#FF8C00'],
}: GradientTextProps) {
  return (
    <MaskedView
      // Use the text shape as a mask so only the gradient inside the glyphs is visible.
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