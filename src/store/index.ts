import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import tracksReducer from './tracksSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tracks: tracksReducer,
  },
});

// Експортуємо типи стейту та діспатчу для правильної роботи TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;