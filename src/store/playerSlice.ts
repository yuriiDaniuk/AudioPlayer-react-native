import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

/** Redux state managed by the player slice. */
interface PlayerState {
  /** Track currently loaded into the player, when one has been selected. */
  activeTrack: any | null;

  /** Indicates whether the native player should be considered active. */
  isPlaying: boolean;

  /** Indicates whether the expanded player sheet is visible. */
  isFullPlayerOpen: boolean;
}

/** Default player state before a track is selected. */
const initialState: PlayerState = {
  activeTrack: null,
  isPlaying: false,
  isFullPlayerOpen: false,
};

/** State transitions for track selection, playback, and player visibility. */
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    /** Loads a track and marks playback as active. */
    setActiveTrack: (state, action: PayloadAction<any>) => {
      state.activeTrack = action.payload;
      state.isPlaying = true;
    },

    /** Updates the playback status shown by player controls. */
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    /** Updates whether the expanded player sheet is open. */
    setFullPlayerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFullPlayerOpen = action.payload;
    },
  },
});

export const { setActiveTrack, setIsPlaying, setFullPlayerOpen } =
  playerSlice.actions;
export default playerSlice.reducer;
