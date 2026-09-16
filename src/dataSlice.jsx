import { createSlice } from '@reduxjs/toolkit';

const initialState ={

  epuraData:null


}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  
  reducers: {

    setEpuraData: (state, action) => {

     

      state.epuraData = action.payload;
    },


  },


  });

  export const {setEpuraData} = dataSlice.actions;
  export default dataSlice.reducer;