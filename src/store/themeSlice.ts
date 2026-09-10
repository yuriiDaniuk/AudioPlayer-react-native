import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean; 
}

const initialState: ThemeState = {
  mode: 'system',
  isLoading: true,
};

export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  const savedTheme = await AsyncStorage.getItem('app_theme');
  return (savedTheme as ThemeMode) || 'system';
});

export const setTheme = createAsyncThunk('theme/setTheme', async (mode: ThemeMode) => {
  await AsyncStorage.setItem('app_theme', mode);
  return mode;
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
      state.isLoading = false;
    });
    builder.addCase(setTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  }
});

export default themeSlice.reducer;