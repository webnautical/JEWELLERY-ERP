import { createSlice } from '@reduxjs/toolkit';

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        language: localStorage.getItem('language') || 'en',
    },
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
        },  
    },
});

export const { setLanguage } = globalSlice.actions;
export default globalSlice.reducer;