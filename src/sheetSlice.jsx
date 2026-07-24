import { createSlice, current } from '@reduxjs/toolkit';
import {TOTAL_ROWS, TOTAL_COLS, DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH,get_cells_keys, get_columns_keys, get_rows_keys} from './consts'
import { getColumnLabel,getColumnIndex, getAllIndividualCells, parseCellRef, evaluateExcelExpression, isNumeric} from './formula.js'




const createEmptyGrid = (sheet, bucket = null) =>{
 let res =   Array(TOTAL_ROWS).fill().map((item, index) =>
  Array(TOTAL_COLS).fill().map((item, index2) => ({sheet:sheet,x:index2,y:index,value: '', type: 'text', is_selected:false, edit_value:'', edit_mode:false}))
 );

 let res2 = (bucket)?bucket:{}

 for (let i =0; i<res.length;i++)
  for (let j =0; j<res[i].length;j++) {
 
   let _key = sheet.toString()+'_'+res[i][j].x.toString()+'_'+res[i][j].y.toString() 

   let is_selected =  (i===0&&j===0)?true:false

   res2[_key] =   {
      
      sheet:sheet,
      x:res[i][j].x, 
      y:res[i][j].y,
      z:0,
      value:res[i][j].value,
      type:res[i][j].type, 
      is_selected:is_selected, 
      is_calculated:false, 
      calculated_value:0, 
      targets:[], 
      formula:null,
      "font": {
        "font_name": "Helv",
        "font_size": 10,
        "font_style": ""
      },
      "bcolor": "#FFFFFF",
      "font_color": "#000000",
      "cell_horz": "left",
      "cell_vert": "bottom",
      "extra_border": false,
    }


  }

 return  res2;

}

const createRows = (sheet, bucket = null) =>{

 let heights = Array(TOTAL_ROWS).fill(DEFAULT_ROW_HEIGHT);

 let res = (bucket)?bucket:{};

 for (let i =0; i<TOTAL_ROWS;i++) {

   let _key = sheet.toString()+'_'+i.toString() 

   res[_key] = {sheet:sheet, rowIndex:i,  height:heights[i]} 

 }

 return res;


}

const createColumns = (sheet, bucket = null) =>{

 let widths  = Array(TOTAL_COLS).fill(DEFAULT_COL_WIDTH);
 
 let labels =  Array.from({ length: TOTAL_COLS }, (_, i) => getColumnLabel(i));

 let res = (bucket)?bucket:{};

 for (let i =0; i<TOTAL_COLS;i++) {

   let _key = sheet.toString()+'_'+i.toString() 

   res[_key] = {sheet:sheet, colIndex:i, label:labels[i], width:widths[i]} 

 }

 return res;

}


const loadTemplate = (template, the_list) => {


  if (template.tcells) {


    return template


  }


  let cells = createEmptyGrid(0);
  let columns = createColumns(0);
  let rows = createRows(0);
  let selected_cells = {'0':{sheet:0, x:0,y:0, label:'A'}};
  let cells_in_range = {'0':[{x:0, y:0}]};
  let selected_ranges = {'0':{start_x:0, end_x:0, start_y:0, end_y:0}};

  //let table_list = [];

  let selected_sheet = 0;
  let sheets = [{sheet:0, title:'Лист1', edited:false, grid_visibility:true,  table_selected:-1, table_pos:'', table_pres:''}];
  let last_created_sheet = 0;

  let pics = {}

  let diags = {}

  let mcells ={}


  for (let i=0;i<template.sheets.length;i++) {

      if (i===0) {

        sheets[0].title = template.sheets[0].title;

        sheets[0].grid_visibility = template.sheets[0].grid_visibility;


      } else {



      }



     for (let j=0; j<template.sheets[i].multicells.length;j++){

       let _key = i.toString()+'_'+j.toString()
       
       mcells[_key] = {...template.sheets[i].multicells[j], ...{sheet:i, idx:j}}

       mcells[_key].value=template.sheets[i].multicells[j].value;

       mcells[_key].font = template.sheets[i].multicells[j].font
        
       mcells[_key].bcolor = template.sheets[i].multicells[j].bcolor
    
       mcells[_key].font_color = template.sheets[i].multicells[j].font_color

       mcells[_key].cell_horz = template.sheets[i].multicells[j].cell_horz
            
       mcells[_key].cell_vert = template.sheets[i].multicells[j].cell_vert

       mcells[_key].extra_border = template.sheets[i].multicells[j].extra_border


     }
 


     for (let j=0; j<template.sheets[i].pictures.length;j++){

       let _key = i.toString()+'_'+j.toString()
       
       pics[_key] = {...template.sheets[i].pictures[j], ...{sheet:i, idx:j}}

     }



      for (let j=0; j<template.sheets[i].diags.length;j++){

       let _key = i.toString()+'_'+j.toString()

        
       
       diags[_key] = {...template.sheets[i].diags[j], ...{sheet:i, idx:j, data:null,  table_data:null, resize_whole:true}}

       if (the_list.length) {

     
          if  (diags[_key].table.show) sheets[i].table_selected =  the_list[0].plist_no;


          sheets[i].table_pos = diags[_key].table.pos;

          sheets[i].table_pres = diags[_key].table.pres;

       }  

      

     }





      for (let j = 0; j<template.sheets[i].columns.length;j++) {

      
        let key =  i.toString()+'_'+j.toString();
        
        columns[key].width =  template.sheets[i].columns[j].width

        

      }


      for (let j =0; j<template.sheets[i].rows.length;j++) {


          let key =  i.toString()+'_'+j.toString();

          rows[key].height =  template.sheets[i].rows[j].height+1

          let row_index = 0; 

          for (let m= 0; m<template.sheets[i].rows[j].cells.length; m++ ){


            let _key = i.toString() +'_'+ m.toString() + '_' +j.toString();

            if (cells[_key]) {

            if (template.sheets[i].rows[j].cells[m].value.toString().trim()!=='') {

               row_index = m;
            
               cells[_key].z= row_index+1;
            } else cells[_key].z=row_index;  


            


            cells[_key].value=template.sheets[i].rows[j].cells[m].value;

            cells[_key].font = template.sheets[i].rows[j].cells[m].font
        
            cells[_key].bcolor = template.sheets[i].rows[j].cells[m].bcolor
    
            cells[_key].font_color = template.sheets[i].rows[j].cells[m].font_color

            cells[_key].cell_horz = template.sheets[i].rows[j].cells[m].cell_horz
            
            cells[_key].cell_vert = template.sheets[i].rows[j].cells[m].cell_vert

            cells[_key].extra_border = template.sheets[i].rows[j].cells[m].extra_border

            }
    
            

          }



      }

      

  }


     
  return (
  
     {tcells: cells,
     tcolumns: columns,
     trows: rows,
     tselected_cells:selected_cells,
     is_selecting:false,
     tcells_in_range:cells_in_range,
     tselected_ranges:selected_ranges,
     selected_sheet:0,
     sheets:sheets,
     last_created_sheet:0,
     selected_object:null,
      mlink:{

      sheet:-1,
      idx:-1,
      e:null,
      type:null,
      ddx:0,
      ddy:0,




     },

    // table_list:table_list,

     
     cells:cells,
     columns:columns,
     rows:rows,
     pics: pics,
     mcells:mcells,
     diags:diags,
     selected_cells:selected_cells, 
     cells_in_range:cells_in_range,
     selected_ranges:selected_ranges})



}


const initialState = () =>{

  let cells = createEmptyGrid(0);
  let columns = createColumns(0);
  let rows = createRows(0);
  let selected_cells = {'0':{sheet:0, x:0,y:0, label:'A'}};
  let cells_in_range = {'0':[{x:0, y:0}]};
  let selected_ranges = {'0':{start_x:0, end_x:0, start_y:0, end_y:0}};
  //let table_list = [];


  
  return (
    
   {
     
     tcells: cells,
     tcolumns: columns,
     trows: rows,
     tselected_cells:selected_cells,
     is_selecting:false,
     tcells_in_range:cells_in_range,
     tselected_ranges:selected_ranges,
     selected_sheet:0,
     sheets:[{sheet:0, title:'Лист1', edited:false, grid_visibility:true,  table_selected:-1, table_pos:'', table_pres:''}],
     last_created_sheet:0,
     selected_object:null,
     
     ////////////////////////////////////////
     
     cells:cells,
     columns:columns,
     rows:rows,
     pics: {},
     diags:{},
     mcells:{},
     selected_cells:selected_cells, 
     cells_in_range:cells_in_range,
     selected_ranges:selected_ranges,
     mlink:{

      sheet:-1,
      idx:-1,
      e:null,
      type:null,
      ddx:0,
      ddy:0,



     }
    // table_list:table_list,
   
     
     ////////////////////////////////////////

   }

  )

};


const parser_helper = (state, s, rels) => {

    if (s.edit_value.toString().trim().startsWith('=')) {

          let rr = getAllIndividualCells(s.edit_value.toString().trim().substring(1))

          
          s.formula = s.edit_value.toString().trim().substring(1);

        
          
          // rels.push({sheet:s.sheet, target_x:s.x, target_y:s.y, fromula:s.edit_value.toString().trim().substring(1), args:rr})

          for (let i=0; i<rr.length;i++) {

           let cc = parseCellRef(rr[i]);

           let _key  = s.sheet.toString()+'_'+cc.col.toString()+'_'+cc.row.toString()

           state.cells[_key].targets.push({x:s.x,y:s.y});

          }


          

          s.is_calculated = true;

          s.calculated_value = evaluateExcelExpression(s.formula, state.cells, s.sheet).value;

          

       } else  {
      
        s.is_calculated = false;

        

        if (s.formula) {

         let rr = getAllIndividualCells(s.formula); 

         for (let i=0; i<rr.length;i++) {

            let cc = parseCellRef(rr[i]);

            let _key  = s.sheet.toString()+'_'+cc.col.toString()+'_'+cc.row.toString()

            let f = state.cells[_key].targets.findIndex(o=>o.x===cc.x&&o.y===cc.y);

            if (f!==-1) state.cells[_key].targets.splice(f,1);

         }

         s.formula = null; 
       }
        
        
      
      }


}

const sheetSlice = createSlice({
  name: 'sheet',
  initialState,
  
  reducers: {

    add_sheet:(state) =>{

     let ll = (state.last_created_sheet+1).toString();

     
     

     let keys = get_cells_keys(state.selected_sheet);//Object.keys(state.cells)

     for (let i =0; i<keys.length; i++) {

        state.tcells[keys[i]] = state.cells[keys[i]];

     }



     keys = get_rows_keys(state.selected_sheet)//Object.keys(state.rows)


     for (let i =0; i<keys.length; i++) {

        state.trows[keys[i]] = state.rows[keys[i]];

     }



     keys = get_columns_keys(state.selected_sheet)//Object.keys(state.columns)

     for (let i =0; i<keys.length; i++) {

        state.tcolumns[keys[i]] = state.columns[keys[i]];

     }


    
     
     state.cells = createEmptyGrid(state.last_created_sheet+1);
     state.columns = createColumns(state.last_created_sheet+1);
     state.rows = createRows(state.last_created_sheet+1);




     state.tcells ={ ...state.tcells, ...state.cells };
     state.tcolumns ={ ...state.tcolumns, ...state.columns };
     state.trows ={ ...state.trows, ...state.rows };


     keys = Object.keys(state.selected_cells) 

     for (let i =0; i<keys.length; i++) {

        state.tselected_cells[keys[i]] = state.selected_cells[keys[i]];

     }

      keys = Object.keys(state.cells_in_range)

     for (let i =0; i<keys.length; i++) {

        state.tcells_in_range[keys[i]] = state.cells_in_range[keys[i]];

     }

      keys = Object.keys(state.selected_ranges)
    
      for (let i =0; i<keys.length; i++) {

        state.tselected_ranges[keys[i]] = state.selected_ranges[keys[i]];

     }

     

     state.selected_cells[ll] = {sheet:state.last_created_sheet+1, x:0,y:0, label:'A'};
     state.selected_object=null,
     state.cells_in_range[ll] = {[ll]:[{x:0, y:0}]};
     state.selected_ranges[ll] = {[ll]:{start_x:0, end_x:0, start_y:0, end_y:0}};

     
     state.tselected_cells = {...state.tselected_cells, ...state.selected_cells};
     state.tcells_in_range = {...state.tcells_in_range, ...state.cells_in_range};
     state.tselected_ranges = {...state.tselected_ranges, ...state.selected_ranges};

     state.is_selecting = false,
         
     state.selected_sheet = state.last_created_sheet+1,
     state.sheets.push({sheet:state.last_created_sheet+1, title:'Лист'+(state.last_created_sheet+2).toString(), edited:false, grid_visibility:true, table_selected:-1, table_pos:'', table_pres:''});
     state.last_created_sheet++;

    },

    load_template:(state, action)=>{

     
     return loadTemplate(action.payload.template, action.payload.the_list);
     


    },

    select_object:(state,action) =>{

        state.selected_object = {

           tpe:action.payload.tpe,

           sheet:action.payload.sheet,

           idx:action.payload.idx,
           

        }

    },



    // set_table_list:(state, action)=>{

   

    //   state.table_list = action.payload.table_list;

    // },

    set_sheet_list:(state, action)=>{

       let s =  state.sheets.find(o=>o.sheet===action.payload.sheet)

       s.table_selected = action.payload.table_selected;

    },


    edit_sheet_tab:(state,action)=>{

     let s =  state.sheets.find(o=>o.sheet===action.payload.sheet) 
     s.edited = action.payload.editing;

    },

    update_grid_visibility:(state,action)=>{

     let s =  state.sheets.find(o=>o.sheet===state.selected_sheet) 
     s.grid_visibility = action.payload.grid_visibility;

    },
    
    rename_sheet:(state, action)=>{

     let s =  state.sheets.find(o=>o.sheet===action.payload.sheet)  

     if (s) s.title = action.payload.title;

    },

    toggle_resize_mode:(state, action) =>{

       let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

       state.diags[key].resize_whole = action.payload.resize_whole;

    },

    toggle_lock:(state, action)=>{


       let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

       if (action.payload.axis==='x'&&action.payload.number===1) state.diags[key].axis_x_mark1_lock_opened = !state.diags[key].axis_x_mark1_lock_opened;

       if (action.payload.axis==='x'&&action.payload.number===2) state.diags[key].axis_x_mark2_lock_opened = !state.diags[key].axis_x_mark2_lock_opened;
       
       if (action.payload.axis==='y'&&action.payload.number===1) state.diags[key].axis_y_mark1_lock_opened = !state.diags[key].axis_y_mark1_lock_opened;

       if (action.payload.axis==='y'&&action.payload.number===2) state.diags[key].axis_y_mark2_lock_opened = !state.diags[key].axis_y_mark2_lock_opened;




    },



    update_table_pos:(state, action)=>{


      let the_sheet = state.sheets.find(o=>o.sheet === action.payload.sheet);
      
      the_sheet.table_pos = action.payload.pos
      

    },



    update_table_pres:(state, action)=>{


      let the_sheet = state.sheets.find(o=>o.sheet === action.payload.sheet);
      
      the_sheet.table_pres = action.payload.pos
      

    },



    set_diag_data:(state,action)=>{


      //let the_sheet = state.sheets.find(o=>o.sheet === action.payload.sheet);

      /*
      
      let shift_x = 0;
      
      let shift_y = 0;

      let good = true;

      if (the_sheet&&the_sheet.table_pos.toString().trim()!==''){

        let pos = the_sheet.table_pos.split('$');

        if (pos.length!==2) good = false;

        if (good) {

          if (pos[0].length>2||pos[0].length===0) good = false;


        }

        if (good) {

          if (pos[0][0]<='A'||pos[0][0]>='Z') good = false;


        }

        if (good&&pos[0].length===2) {

          if (pos[0][1]<='A'||pos[0][1]>='Z') good = false;



        } 

        if (good&&parseFloat(pos[1])>=0) {

          shift_x = getColumnIndex(pos[0]); 
          
          shift_y = parseFloat(pos[1]);


    

        }
        

      }

      */ 

      let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

      state.diags[key].data = action.payload.data;

      let res = action.payload.table_data?{}:null

      
      //let min_x=0; 
      //let min_y=0;
      /*
      if (res&&shift_x&&shift_y&&action.payload.table_data.length) {

        min_x = action.payload.table_data[0].x
        
        min_y = action.payload.table_data[0].y
        
        for (let i=1; i<action.payload.table_data.length;i++){

           if (action.payload.table_data[i].x<min_x) min_x = action.payload.table_data[i].x;

           if (action.payload.table_data[i].y<min_y) min_y = action.payload.table_data[i].y;
           


          }


      } */
      
      if (res)
      for (let i=0; i<action.payload.table_data.length;i++) {

         res[action.payload.table_data[i].plist_no.toString()+'_'+

         action.payload.table_data[i].x.toString()+
         
         //(shift_x-min_x+parseFloat(action.payload.table_data[i].x)).toString()+
         
         
         '_'+(parseFloat(action.payload.table_data[i].y)-1).toString()]=action.payload.table_data[i].value
         
         //(shift_y-min_y+parseFloat(action.payload.table_data[i].y)-1).toString()] = action.payload.table_data[i].value

      }
     
      state.diags[key].table_data  = res;
      

    },
    

    update_diag_position:(state, action)=>{

       let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

       state.diags[key].left = action.payload.left;

       state.diags[key].top = action.payload.top;


    },
  
      
  
    
    update_diag_size:(state, action)=>{

        let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

        state.diags[key].width = action.payload.width;

        state.diags[key].height = action.payload.height;

        if (action.payload.cleft!=='none') state.diags[key].cleft = action.payload.cleft;

        if (action.payload.ctop!=='none') state.diags[key].ctop = action.payload.ctop;

        if (action.payload.cright!=='none') state.diags[key].cright = action.payload.cright;

        if (action.payload.cbottom!=='none') state.diags[key].cbottom = action.payload.cbottom;

    },






     update_pic_position:(state, action)=>{

       let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

       state.pics[key].left = action.payload.left;

       state.pics[key].top = action.payload.top;

    },
    
    
    update_pic_size:(state, action)=>{

        let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

        state.pics[key].width = action.payload.width;

        state.pics[key].height = action.payload.height;
        

    },





    select_sheet:(state, action)=>{

      


      let keys = get_cells_keys(state.selected_sheet);

      for (let i =0; i<keys.length; i++) {
      
        state.tcells[keys[i]] = state.cells[keys[i]]; 

      }

       keys = get_columns_keys(state.selected_sheet) 

       

       for (let i =0; i<keys.length; i++) {
      
        state.tcolumns[keys[i]] = state.columns[keys[i]]; 

      }

      keys =get_rows_keys(state.selected_sheet)
      
     

      for (let i =0; i<keys.length; i++) {
 
       
        state.trows[keys[i]] = state.rows[keys[i]]; 

      }


     state.tselected_cells[state.selected_sheet.toString()] = state.selected_cells[state.selected_sheet.toString()]
     state.tcells_in_range[state.selected_sheet.toString()] = state.cells_in_range[state.selected_sheet.toString()]
     state.tselected_ranges[state.selected_sheet.toString()] = state.selected_ranges[state.selected_sheet.toString()]


      let sheet = action.payload.sheet.toString();

       keys = get_cells_keys(action.payload.sheet);
      
     

      state.cells = {};

      for (let i =0; i<keys.length; i++) {
      
        state.cells[keys[i]] = state.tcells[keys[i]]; 

      }

     


      keys = get_columns_keys(action.payload.sheet) //Object.keys(state.tcolumns)

       state.columns = {};

      for (let i =0; i<keys.length; i++) {
      
        state.columns[keys[i]] = state.tcolumns[keys[i]]; 

      }

      keys =get_rows_keys(action.payload.sheet)
      
      state.rows = {};

      for (let i =0; i<keys.length; i++) {
      
        state.rows[keys[i]] = state.trows[keys[i]]; 

      }


     
      
     state.selected_cells = {[sheet]:state.tselected_cells[sheet]};
     state.cells_in_range = {[sheet]:state.tcells_in_range[sheet]};
     state.selected_ranges = {[sheet]:state.tselected_ranges[sheet]};
     state.selected_object = null,

     state.is_selecting = false;

     


     state.selected_sheet = action.payload.sheet;

  

    },
    
    delete_sheet:(state, action) =>{

      if (state.sheets.length===1) return;
      
      let ii = action.payload.sheet
    

      let new_sheet = ii//state.selected_sheet;

     
      let the_sheet = -1;

      while (new_sheet>0) {
         
         new_sheet--;

         if (state.sheets.find(o=>o.sheet === new_sheet))

          {the_sheet = new_sheet; break;} 

      }

      if (the_sheet===-1) {

        new_sheet = ii//state.selected_sheet;

        while (true) {
          
          new_sheet++;

          if (state.sheets.find(o=>o.sheet === new_sheet)) 
            {the_sheet = new_sheet; break;}


        }


      }

      let keys = get_cells_keys(/*state.selected_sheet*/ii.toString());

      for (let i =0; i<keys.length; i++) {
      
        delete  state.tcells[keys[i]]; 

      }

      keys = get_columns_keys(/*state.selected_sheet*/ii.toString()) 

       

       for (let i =0; i<keys.length; i++) {
      
        delete state.tcolumns[keys[i]] 

      }

      keys =get_rows_keys(/*state.selected_sheet*/ii.toString())
      
     

      for (let i =0; i<keys.length; i++) {
 
        delete state.trows[keys[i]]; 

      }

      let pics = Object.keys(state.pics);

      let diags = Object.keys(state.diags);

      let mcells = Object.keys(state.mcells);

      


      for (let i=0;i<mcells.length;i++) {

        if (mcells[i].split('_')[0].toString()===ii.toString()) {

          delete state.mcells[mcells[i]]

        }

      }



      for (let i=0;i<pics.length;i++) {

        if (pics[i].split('_')[0].toString()===ii.toString()) {

          delete state.pics[pics[i]]

        }

      }



       for (let i=0;i<diags.length;i++) {

        if (diags[i].split('_')[0].toString()===ii.toString()) {

          delete state.diags[diags[i]]

        }

      }




     delete state.tselected_cells[/*state.selected_sheet*/ii.toString()];

     delete state.cells_in_range[/*state.selected_sheet*/ii.toString()]; 
     
     delete state.selected_ranges[/*state.selected_sheet*/ii.toString()];

     state.is_selecting = false;

     state.selected_object = null;



      keys = get_cells_keys(the_sheet.toString());


     state.cells = {}

     for (let i =0; i<keys.length; i++) {
      
        state.cells[keys[i]] = state.tcells[keys[i]];  

      }

       keys = get_columns_keys(the_sheet.toString()) 

       state.columns = {}

       for (let i =0; i<keys.length; i++) {
      
         state.columns[keys[i]] = state.tcolumns[keys[i]] 

      }

      keys =get_rows_keys(the_sheet.toString())
      
       state.rows = {}
     

      for (let i =0; i<keys.length; i++) {
 
         state.rows[keys[i]] = state.trows[keys[i]]; 

      }

     state.selected_cells = {}; 

     state.selected_object = null;
    
     state.selected_cells[the_sheet.toString()] = state.tselected_cells[the_sheet.toString()]
     

     state.cells_in_range = {}

     state.cells_in_range[the_sheet.toString()] = state.tcells_in_range[the_sheet.toString()]
   
     
     state.selected_ranges = {}

     state.selected_ranges[the_sheet.toString()] =state.tselected_ranges[the_sheet.toString()]
     

     let i = state.sheets.findIndex(o=>o.sheet === ii/*state.selected_sheet*/);

      state.selected_sheet = the_sheet;
     
     if (i!==-1) state.sheets.splice(i,1)

    },
  
    select_cell: (state, action) => {
      
      let _key  = action.payload.sheet.toString()+'_'+action.payload.x.toString()+'_'+action.payload.y.toString()
     
    
      let s =Object.values(state.cells).find(child => child.sheet===action.payload.sheet&&child.is_selected === true)
    
     
      if (s) s.is_selected = false;
      
      for (let i=0;i<state.cells_in_range[action.payload.sheet.toString()].length;i++) {

        let cc = state.cells_in_range[action.payload.sheet.toString()][i];

        let _keykey = action.payload.sheet.toString()+'_'+cc.x.toString()+'_'+cc.y.toString();

        state.cells[_keykey].is_in_range = false;

      }
      

      s =Object.values(state.cells).find(child => child.edit_mode === true)
    
      if (s) {

         s.edit_mode = false;

         

         s.value = s.edit_value;

     

         if (s.value.toString().trim()==='') s.calculated_value = 0;
         else if (isNumeric(s.value.toString()))  s.calculated_value = parseFloat(s.value.toString())
         

       
        
         parser_helper(state, s, state.rels);

           s.edit_value = ''


          if (s.value.toString().trim()!=='') {

            for (let ii=s.x+1;ii<TOTAL_COLS;ii++) {

           
            let kkey  = action.payload.sheet.toString()+'_'+ii.toString()+'_'+s.y.toString();

            if (state.cells[kkey].z<s.x) state.cells[kkey].z = s.x;  


       } 

       s.z = action.payload.x+1;



        }  else {

             
           // let vv = 0;

           // if (s.x>0){
              
           //   let _key2 = action.payload.sheet.toString()+'_'+(s.x-1).toString()+'_'+s.y.toString();

           //   vv = state.cells[_key2].z;

           //   if (vv>0) vv--;

           // }

            //let _key2 = (s.x>0)?action.payload.sheet.toString()+'_'+(s.x-1).toString()+'_'+s.y.toString():
                       //action.payload.sheet.toString()+'_'+(s.x-1).toString()+'_'+s.y.toString()


            for (let ii =s.x;ii<TOTAL_COLS;ii++) {

              let s2 = action.payload.sheet.toString()+'_'+ii.toString()+'_'+s.y.toString()

              if (state.cells[s2].value.toString().trim()!=='') break;

              state.cells[s2].z = 0; 


            }           

            //let s1 = 



        }

         if (s.targets.length) {
          
          for (let i =0;i<s.targets.length;i++) {

            let ttt = s.targets[i];

            let _key  = s.sheet.toString()+'_'+ttt.x.toString()+'_'+ttt.y.toString();


            if (state.cells[_key].formula) {

              state.cells[_key].calculated_value = evaluateExcelExpression(state.cells[_key].formula, state.cells, s.sheet).value;

             
              
            
            }


          }
          
         

         } 

        

      } 

      state.is_selecting = true;

      state.selected_object = null;

      state.cells[_key].is_selected = true;

      state.cells[_key].is_in_range = true;

      state.selected_ranges[action.payload.sheet.toString()] = { start_x:action.payload.x, 
                                                                 end_x:action.payload.x, 
                                                                 start_y:action.payload.y, 
                                                                 end_y:action.payload.y}

      state.cells_in_range[action.payload.sheet.toString()] = [{x:action.payload.x,y:action.payload.y}]                                                         


     
    },

    stop_selecting:(state)=>{

       state.is_selecting = false;

    },

    drag_on_cell:(state, action) =>{

     if (state.is_selecting) {

     
      
      let current_range = state.selected_ranges[action.payload.sheet.toString()];

      let cells_in_range = state.cells_in_range[action.payload.sheet.toString()];

      let x = action.payload.x;
      
      let y = action.payload.y;

      let new_cells_in_range = [];

     

      const minRow = Math.min(current_range.start_y, y);
      const row_count = Math.abs(current_range.start_y - y);
      const minCol = Math.min(current_range.start_x, x);
      const col_count = Math.abs(current_range.start_x - x);

      for (let i = minRow; i<=minRow+row_count;i++)
        for (let j = minCol; j<=minCol+col_count;j++){

           new_cells_in_range.push({x:j, y:i})

         

           let _key  = action.payload.sheet.toString()+'_'+j.toString()+'_'+i.toString()
     
           state.cells[_key].is_in_range = true;

        }  
        
        
     

      for (let i =0; i<cells_in_range.length;i++){

        if (!new_cells_in_range.find(o=>o.x===cells_in_range[i].x&&o.y===cells_in_range[i].y)) {

         let _key  = action.payload.sheet.toString()+'_'+cells_in_range[i].x.toString()+'_'+cells_in_range[i].y.toString()

         state.cells[_key].is_in_range = false;

        }


      } 
      
      state.cells_in_range[action.payload.sheet.toString()] = new_cells_in_range;

      state.selected_ranges[action.payload.sheet.toString()].end_x = action.payload.x;
      
      state.selected_ranges[action.payload.sheet.toString()].end_y = action.payload.y;
      

     } 

    },

    edit_value_change:(state,action) =>{

       let _key  = action.payload.sheet.toString()+'_'+action.payload.x.toString()+'_'+action.payload.y.toString()
     
       state.cells[_key].edit_value = action.payload.txt;


    },

   

    edit_mode_on:(state, action) =>{

       let _key  = action.payload.sheet.toString()+'_'+action.payload.x.toString()+'_'+action.payload.y.toString()

       let s =Object.values(state.cells).find(child => child.edit_mode === true)

       

       if (s) {
        
        s.edit_mode = false;

        s.value = s.edit_value;

        if (s.value.toString().trim()==='') s.calculated_value = 0;
        
        else if (isNumeric(s.value.toString()))  s.calculated_value = parseFloat(s.value.toString())

        
      


        parser_helper(state, s, state.rels);

          s.edit_value = ''


        if (s.targets.length) {
          
          for (let i =0;i<s.targets.length;i++) {

            let ttt = s.targets[i];

            let _key  = s.sheet.toString()+'_'+ttt.x.toString()+'_'+ttt.y.toString();


            if (state.cells[_key].formula) {

              state.cells[_key].calculated_value = evaluateExcelExpression(state.cells[_key].formula, state.cells, s.sheet).value;

              
            
            }


          }
         
         
         

        }  
         

       

        

       
       } 


       s =Object.values(state.cells).find(child => child.is_selected === true)

       if (s) s.is_selected = false;

       state.cells[_key].is_selected = true;

       state.cells[_key].edit_mode = true;

       state.cells[_key].edit_value = state.cells[_key].value 

    },

    edit_mode_save:(state, action) =>{

     
        
     let _key  = action.payload.sheet.toString()+'_'+action.payload.x.toString()+'_'+action.payload.y.toString();

     state.cells[_key].edit_mode = false;




     parser_helper(state, state.cells[_key], state.rels);

     if (state.cells[_key].targets.length) {
      
       let s = state.cells[_key]

       for (let i =0;i<s.targets.length;i++) {

            let ttt = s.targets[i];

            let _key0  = s.sheet.toString()+'_'+ttt.x.toString()+'_'+ttt.y.toString();


            if (state.cells[_key0].formula) {

               state.cells[_key0].calculated_value = evaluateExcelExpression(state.cells[_key0].formula, state.cells, s.sheet).value

              
            
            }


          }
      
     

     } 

     

     state.cells[_key].value = state.cells[_key].edit_value

    

     if ( state.cells[_key].value.toString().trim()==='')  state.cells[_key].calculated_value = 0;
         else if (isNumeric( state.cells[_key].value.toString()))   state.cells[_key].calculated_value = parseFloat( state.cells[_key].value.toString())

     state.cells[_key].edit_value = '';


     
     if (state.cells[_key].value.toString().trim()!=='') {

       for (let ii=action.payload.x+1;ii<TOTAL_COLS;ii++) {

           
          
            let kkey  = action.payload.sheet.toString()+'_'+ii.toString()+'_'+action.payload.y.toString();

            if (state.cells[kkey].z<action.payload.x) state.cells[kkey].z = action.payload.x;  


       } 

       state.cells[_key].z = action.payload.x+1;



     } else {


       for (let ii =state.cells[_key].x;ii<TOTAL_COLS;ii++) {

              let s2 = action.payload.sheet.toString()+'_'+ii.toString()+'_'+state.cells[_key].y.toString()

              if (state.cells[s2].value.toString().trim()!=='') break;

              state.cells[s2].z = 0; 


            }           



     }


    },

    edit_mode_cancel:(state, action) =>{

     let _key  = action.payload.sheet.toString()+'_'+action.payload.x.toString()+'_'+action.payload.y.toString();

     state.cells[_key].edit_mode = false;

     state.cells[_key].edit_value = '';


    },

    update_col_width:(state, action) =>{

     
     let _key  = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

     state.columns[_key].width = action.payload.new_width;


    },

    update_row_height:(state, action) =>{
     
     let _key  = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

     state.rows[_key].height = action.payload.new_height;

    },


  update_diag_property:(state, action) =>{

    if (state.selected_object.tpe!=='diag') return;

    let _key = state.selected_object.sheet.toString() +'_' + state.selected_object.idx.toString();

    if (action.payload.field==='diagram_id') state.diags[_key].diagram_id = action.payload.value;
    else if (action.payload.field==='axis_x_visible') state.diags[_key].axis_x_visible = action.payload.value;
    else if (action.payload.field==='axis_x_min') state.diags[_key].axis_x_min = action.payload.value;
    else if (action.payload.field==='axis_x_max') state.diags[_key].axis_x_max = action.payload.value;
    else if (action.payload.field==='axis_x_mark1') state.diags[_key].axis_x_mark1 = action.payload.value;
    else if (action.payload.field==='axis_x_mark2') state.diags[_key].axis_x_mark2 = action.payload.value;
    else if (action.payload.field==='axis_x_step') state.diags[_key].axis_x_step = action.payload.value;

    else if (action.payload.field==='axis_y_visible') state.diags[_key].axis_y_visible = action.payload.value;
    else if (action.payload.field==='axis_y_min') state.diags[_key].axis_y_min = action.payload.value;
    else if (action.payload.field==='axis_y_max') state.diags[_key].axis_y_max = action.payload.value;
    else if (action.payload.field==='axis_y_mark1') state.diags[_key].axis_y_mark1 = action.payload.value;
    else if (action.payload.field==='axis_y_mark2') state.diags[_key].axis_y_mark2 = action.payload.value;
    else if (action.payload.field==='axis_y_step') state.diags[_key].axis_y_step = action.payload.value;
    else if (action.payload.field==='legend_show') state.diags[_key].legend.show = action.payload.value;
    else if (action.payload.field==='legend_pos') state.diags[_key].legend.pos = action.payload.value;


  },

  
  update_autos:(state, action) =>{

    
    let _key = action.payload.sheet.toString() +'_' + action.payload.idx.toString();

    //state.diags[_key].

     

      state.diags[_key].auto_x_min = (action.payload.auto_vals.auto_x_min)?action.payload.auto_vals.auto_x_min:'0'

      state.diags[_key].auto_x_max = action.payload.auto_vals.auto_x_max?action.payload.auto_vals.auto_x_max:'0'

      state.diags[_key].auto_y_min = action.payload.auto_vals.auto_y_min?action.payload.auto_vals.auto_y_min:'0'

      state.diags[_key].auto_y_max = action.payload.auto_vals.auto_y_max?action.payload.auto_vals.auto_y_max:'0'

      state.diags[_key].auto_x_step = action.payload.auto_vals.auto_x_step?action.payload.auto_vals.auto_x_step:'0'

      state.diags[_key].auto_y_step = action.payload.auto_vals.auto_y_step?action.payload.auto_vals.auto_y_step:'0'

    


  },

  
  
  move_link:(state, action)=>{

     state.mlink.sheet = action.payload.sheet

     state.mlink.idx = action.payload.idx
    
     state.mlink.e = action.payload.e

     state.mlink.type = action.payload.type;

     let key = action.payload.sheet.toString()+'_'+action.payload.idx.toString();

     let diag = state.diags[key];

     let pic = state.pics[key];

     if (diag&&pic) {

      state.mlink.ddx=pic.left-diag.left;

      state.mlink.ddy=pic.top-diag.top;
      

     } else {state.mlink.ddx=0; state.mlink.ddy=0}


    

  },

  
  update_cell_property:(state, action) =>{


    let _key  = action.payload.sheet.toString()+'_'+action.payload.x.toString()+'_'+action.payload.y.toString();

  
    if (action.payload.field==='fontFamily') state.cells[_key].font.font_name = action.payload.value;
    else if (action.payload.field==='fontSize') state.cells[_key].font.font_size = action.payload.value;
    else if (action.payload.field==='fontWeight') state.cells[_key].font.font_style = action.payload.value;
    else if (action.payload.field==='fontColor')  state.cells[_key].font_color = action.payload.value;
    else if (action.payload.field==='verticalAlign')  state.cells[_key].cell_vert = action.payload.value;
    else if (action.payload.field==='horizontalAlign')  state.cells[_key].cell_horz = action.payload.value;
    else if (action.payload.field==='bgColor')  state.cells[_key].bcolor = action.payload.value;
    else if (action.payload.field==='border')   if (!action.payload.value||action.payload.value==='false')
                                                   state.cells[_key].extra_border = false;
                                                 else  state.cells[_key].extra_border = true;

   
  




  },

  
  }, 


  

  selectors:{

    get_cell_info:(state, sheet, x, y) => state.cells[sheet.toString()+'_'+x.toString()+'_'+y.toString()],

    get_table_info:(state, sheet, x, y) =>{

      let rr = Object.values(state.diags);

      let s =  state.sheets.find(o=>o.sheet===sheet)

      for (let i =0; i<rr.length;i++) {

        if (rr[i].table_data) {

          let shift_x = 0;
      
          let shift_y = 0;

          let good = true;

          if (s&&s.table_pos.toString().trim()!==''){

          let pos = s.table_pos.split('$');

          if (pos.length!==2) good = false;

          if (good) {

            if (pos[0].length>2||pos[0].length===0) good = false;

          }

          if (good) {

           if (pos[0][0]<='A'||pos[0][0]>='Z') good = false;

          }

          if (good&&pos[0].length===2) {

            if (pos[0][1]<='A'||pos[0][1]>='Z') good = false;

          } 

         if (good&&parseFloat(pos[1])>=0) {

          shift_x = getColumnIndex(pos[0]); 
          
          shift_y = parseFloat(pos[1]);


         }
        

       } else good =false;
         let min_x ='first'; let min_y ='first'; 

         if (good) {

           let kk = Object.keys(rr[i].table_data);

        
          
          for (let jj=0;jj<kk.length;jj++) {

            if (kk[jj].split('_')[0]===s.table_selected.toString()){


              if (min_x==='first') min_x = parseFloat(kk[jj].split('_')[1]);
              else if (parseFloat(kk[jj].split('_')[1])<min_x) min_x = parseFloat(kk[jj].split('_')[1])

              if (min_y==='first') min_y = parseFloat(kk[jj].split('_')[2]);
              else if (parseFloat(kk[jj].split('_')[2])<min_y) min_y = parseFloat(kk[jj].split('_')[2])
              


            }
             
            //if (rr[i].table_data[kk[jj]]&&)

          }

        }


          if (min_x ==='first') min_x = 0;
      
          if (min_y ==='first') min_y = 0;

          let rrr =  rr[i].table_data[s.table_selected.toString()+'_'+(parseFloat(x)+min_x-parseFloat(shift_x)).toString()+'_'+(parseFloat(y)+min_y+1-parseFloat(shift_y)).toString()]


          if (s.table_pres.toString().trim()!=='') {
           
            if (rrr&&rrr.toString().trim()!=='') rrr=parseFloat(rrr).toFixed(parseFloat(s.table_pres)).toString();
          }
          return rrr

        } else return null;


      }


    },

    
    get_row_info: (state, sheet, idx) => {

     
      
     return  state.rows[sheet.toString()+'_'+idx.toString()]

    },

     get_pic_info:  (state, sheet, idx) => {

      let key = sheet.toString()+'_'+idx.toString()

      return state.pics[key]
     
    
    },


    get_mcell_info:  (state, sheet, idx) => {

      let key = sheet.toString()+'_'+idx.toString()

      return state.mcells[key]
     
    
    },

    
    get_diag_info:  (state, sheet, idx) => {

      let key = sheet.toString()+'_'+idx.toString()

      return state.diags[key]
     
    
    },

    
    
    get_row_heights:(state, sheet) =>{

      let keys = get_rows_keys(sheet);

      let res = [];

      for (let i=0;i<keys.length;i++) {

        res.push(state.rows[keys[i]].height);


      }

      return res;
  
       //let s =Object.values(state.rows).find(child => child.sheet===sheet)

    },
    
    get_col_info: (state, sheet, idx) => state.columns[sheet.toString()+'_'+idx.toString()],

    get_selected_cell:(state, sheet)=>{
      
      let s =Object.values(state.cells).find(child => child.sheet===sheet&&child.is_selected === true)

      if (s) return s

      else return null;


    }

    
 
    
    

  }
});

export const {
  
  select_cell,

  edit_mode_on,

  update_col_width,

  update_row_height,
  
  edit_mode_save,
  
  edit_mode_cancel,
  
  edit_value_change,

  stop_selecting,

  drag_on_cell,

  add_sheet,
  
  select_sheet,

  delete_sheet,

  rename_sheet,

  edit_sheet_tab,

  load_template,

  toggle_lock,

  toggle_resize_mode,

  set_diag_data,

  update_diag_size,

  update_pic_size,

  update_diag_position,

  update_pic_position,

  update_cell_property,

  select_object,

  update_diag_property,

  update_autos,

  update_grid_visibility,

  update_table_pos,

  update_table_pres,


  set_sheet_list,

  move_link,
  
} = sheetSlice.actions;

export const {  get_table_info, get_cell_info, get_mcell_info, get_row_info, get_col_info, get_selected_cell, get_row_heights, get_pic_info, get_diag_info} = sheetSlice.selectors;

export default sheetSlice.reducer;