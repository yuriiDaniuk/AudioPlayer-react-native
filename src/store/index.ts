import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import tracksReducer from './tracksSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tracks: tracksReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;