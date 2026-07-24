import { createSlice, current } from '@reduxjs/toolkit';



const initialState = {
  
   context_menu:{

    visible:false,

    x:0,

    y:0,

    tpe:'blank',

    arg:null,

   }


}

const contextSlice = createSlice({
  name: 'cmenu',
  
  initialState,
  
  reducers: {

       show_menu:(state,action) =>{

          state.context_menu.visible = true;
          
          state.context_menu.x = action.payload.x;
          
          state.context_menu.y = action.payload.y;

          state.context_menu.tpe = action.payload.tpe;

          state.context_menu.arg = action.payload.arg?action.payload.arg:null

       },

       close_menu:(state) =>{


         state.context_menu.visible = false;

         

       }
     

  }});

  export const {

    show_menu,

    close_menu,
    
        
  } = contextSlice.actions;
  
  
  export default contextSlice.reducer;
