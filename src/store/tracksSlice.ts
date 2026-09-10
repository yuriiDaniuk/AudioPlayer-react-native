import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

/** Artist metadata associated with a track. */
export type Artist = { id: string; name: string };

/** Track metadata and media URLs consumed by the player and track views. */
export type Track = {
  id: string;
  title: string;
  coverUrl: string;
  audioUrl: string;
  artist: Artist;
};

/** Redux state for the track collection request and its results. */
interface TracksState {
  /** Tracks returned by the API. */
  items: Track[];

  /** Current lifecycle state of the track request. */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';

  /** Request error message, when the latest request failed. */
  error: string | null;
}

/** Initial state before the first track request is dispatched. */
const initialState: TracksState = {
  items: [],
  status: 'idle',
  error: null,
};

/** Fetches the available tracks from the backend API. */
export const fetchTracks = createAsyncThunk('tracks/fetchTracks', async () => {
  const response = await axios.get<Track[]>('http://localhost:3000/api/tracks');
  return response.data;
});

/** Tracks request lifecycle transitions and stores the resulting collection. */
const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTracks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Щось пішло не так';
      });
  },
});

export default tracksSlice.reducer;