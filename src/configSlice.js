import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  baseUrl: '', // will be set during init
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
    },
  },
});

export const { setBaseUrl } = configSlice.actions;
export default configSlice.reducer;