import { createSlice, current } from '@reduxjs/toolkit';



export const initialState = {
  
  left:20,

  right:15,

  selected_epura:{plot_no:-1},

  dates_selected:[],

  layout_mode:'',

  xlabels:'on',
  
  ylabels:'on',
  
  formulabar:'on',

  print_mode:false,

}

const layoutSlice = createSlice({
  
  name: 'layout',
  
  initialState,
  
  reducers: {

      update_left_pane_width:(state,action) =>{

         state.left = action.payload.size;  

      }, 
      update_right_pane_width:(state,action) =>{

        state.right = action.payload.size;


      },

      set_epura:(state,action) =>{

        state.selected_epura = action.payload.plot_info;

        state.dates_selected = [];


      },


      // set_print_mode:(state,action) =>{

      //   state.print_mode = action.payload;

        


      // },





      set_layout_mode:(state,action) =>{

        state.layout_mode = action.payload;



      },



      toggle_date:(state,action)=>{

        if (action.payload.toggle) state.dates_selected.push(action.payload.value)
        else {
           
          let ind = state.dates_selected.indexOf(action.payload.value);

          if (ind!==-1) state.dates_selected.splice(ind,1);
    
    
        }     



      }
 
     

  }});

  export const {

    update_left_pane_width,
   
    update_right_pane_width,

    set_epura, toggle_date,

    set_layout_mode,

   // set_print_mode
    
        
  } = layoutSlice.actions;
  
  
  export default layoutSlice.reducer;
