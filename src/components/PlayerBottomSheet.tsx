import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setFullPlayerOpen } from '../store/playerSlice';

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#121212',
  },
});

export default function PlayerBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const { isFullPlayerOpen, activeTrack } = useSelector((state: RootState) => state.player);

  // Висота: 100% екрану. Індекс -1 означає "приховано"
  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    if (isFullPlayerOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isFullPlayerOpen]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Початково схований
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true} // Дозволяє закрити свайпом вниз
      onClose={() => dispatch(setFullPlayerOpen(false))}
      backgroundStyle={styles.background} // Темний фон
    >
      <View className="items-center justify-center flex-1 p-4">
        <Text className="text-2xl font-bold text-white">
          {activeTrack?.title ?? 'Немає активного треку'}
        </Text>
        <Button title="Закрити" onPress={() => dispatch(setFullPlayerOpen(false))} />
      </View>
    </BottomSheet>
  );
}