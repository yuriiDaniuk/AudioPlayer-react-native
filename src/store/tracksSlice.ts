import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Типи даних
export type Artist = { id: string; name: string };
export type Track = { id: string; title: string; coverUrl: string; audioUrl: string; artist: Artist };

interface TracksState {
  items: Track[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TracksState = {
  items: [],
  status: 'idle',
  error: null,
};

// Асинхронний екшен (Thunk) для завантаження треків
export const fetchTracks = createAsyncThunk('tracks/fetchTracks', async () => {
  const response = await axios.get<Track[]>('http://localhost:3000/api/tracks');
  return response.data;
});

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  // Обробляємо результати асинхронного запиту
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Записуємо треки в стейт
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Щось пішло не так';
      });
  },
});

export default tracksSlice.reducer;