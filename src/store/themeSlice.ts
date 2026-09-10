import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/** Supported application theme preferences. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Redux state managed by the theme slice. */
interface ThemeState {
  /** Persisted theme preference applied by the theme provider. */
  mode: ThemeMode;

  /** Indicates whether the persisted theme is still being loaded. */
  isLoading: boolean;
}

/** Initial state used before the persisted theme preference is resolved. */
const initialState: ThemeState = {
  mode: 'system',
  isLoading: true,
};

/** Loads the persisted theme preference or falls back to system mode. */
export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  const savedTheme = await AsyncStorage.getItem('app_theme');
  return (savedTheme as ThemeMode) || 'system';
});

/** Persists a new theme preference and returns the saved mode. */
export const setTheme = createAsyncThunk(
  'theme/setTheme',
  async (mode: ThemeMode) => {
    await AsyncStorage.setItem('app_theme', mode);
    return mode;
  },
);

/** Handles persisted theme loading and updates from the theme-setting thunk. */
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
      state.isLoading = false;
    });
    builder.addCase(setTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export default themeSlice.reducer;