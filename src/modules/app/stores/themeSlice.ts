import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'light' | 'dark';
  lang: 'en' | 'ar';
}

const initialState: ThemeState = {
  theme: 'light',
  lang: 'en',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleLang: (state) => {
        state.lang = state.lang === 'en' ? 'ar' : 'en';
    },
  },
});

export const { toggleTheme,toggleLang } = themeSlice.actions;

export default themeSlice.reducer;
