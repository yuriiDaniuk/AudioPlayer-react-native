import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Описуємо типи (використовуємо той самий тип Track, що й раніше)
interface PlayerState {
  activeTrack: any | null; // Поки ставимо any, потім типізуємо під Track
  isPlaying: boolean;
  isFullPlayerOpen: boolean;
}

const initialState: PlayerState = {
  activeTrack: null,
  isPlaying: false,
  isFullPlayerOpen: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Дія для перемикання треку (коли клікаємо на пісню в сітці)
    setActiveTrack: (state, action: PayloadAction<any>) => {
      state.activeTrack = action.payload;
      state.isPlaying = true;
    },
    // Дія для кнопки Play/Pause
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setFullPlayerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFullPlayerOpen = action.payload;
    },
  },
});

export const { setActiveTrack, setIsPlaying, setFullPlayerOpen } = playerSlice.actions;
export default playerSlice.reducer;
