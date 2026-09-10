import { configureStore } from '@reduxjs/toolkit';

import playerReducer from './playerSlice';
import themeReducer from './themeSlice';
import tracksReducer from './tracksSlice';

/** Central Redux store containing player, track, and theme state. */
export const store = configureStore({
  reducer: {
    player: playerReducer,
    tracks: tracksReducer,
    theme: themeReducer,
  },
});

/** Root state inferred from the configured reducer tree. */
export type RootState = ReturnType<typeof store.getState>;

/** Dispatch type inferred from the configured Redux store. */
export type AppDispatch = typeof store.dispatch;