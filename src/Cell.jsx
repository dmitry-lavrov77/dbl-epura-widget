import { useDispatch, useSelector } from 'react-redux';
import { select_cell,  edit_mode_on, edit_mode_save, edit_mode_cancel, get_cell_info, edit_value_change } from './sheetSlice';
import { useRef, useEffect } from 'react';
import {get_row_info, get_col_info, drag_on_cell, get_table_info} from './sheetSlice'
import {show_menu} from './contextSlice'
import {measureText} from './graph_math'



export const Cell = ({sheet, x, y}) => {
  
  const dispatch = useDispatch();

  const layout_mode = useSelector(state=>state.layout.layout_mode)
  
  const cell_info = useSelector(state => get_cell_info(state, sheet, x, y));

  const cell_info_left = useSelector(state => get_cell_info(state, sheet, x-1, y));

  //const cell_info_right = useSelector(state => get_cell_info(state, sheet, x+1, y));
  
  const cell_info_top = useSelector(state => get_cell_info(state, sheet, x, y-1));
  
  //const cell_info_bottom = useSelector(state => get_cell_info(state, sheet, x, y+1));

  const table_info = useSelector(state => get_table_info(state, sheet, x, y));


  
  const sheets = useSelector(state=>state.sheet.sheets);
 
  const the_sheet = sheets.find(o=>o.sheet === sheet)

  





  const cellRef=useRef(null)
  const is_selected = cell_info.is_selected||cell_info.is_in_range;
  const is_edited = cell_info.edit_mode;
  const inputRef = useRef(null);
  
  

  let cscale = useSelector(state=>state.layout.cscale);



  let height =useSelector(state=>get_row_info(state, sheet, y)).height;
  
  let width =useSelector(state=>get_col_info(state, sheet, x)).width;

  


  height = parseFloat(height)*cscale;

  width = parseFloat(width)*cscale;




  useEffect(() => {
    if (is_edited && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [is_edited]);

  const handleMouseMove = (e) =>{

    dispatch(drag_on_cell({sheet:sheet, x:x, y:y})) 
   
  }

  const handleMouseDown = (e) => {
    e.preventDefault(); 
  };

 const startEditing = (sheet, row, col, currentValue) => {
    
    dispatch(edit_mode_on({ sheet: sheet, x: x, y: y }));
  
  };


  const onEditChange = (txt) =>{

    dispatch(edit_value_change({ sheet: sheet, x: x, y: y, txt}));

  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      dispatch(edit_mode_save({ sheet: sheet, x: x, y: y }));
    } else if (e.key === 'Escape') {
      dispatch(edit_mode_cancel({ sheet: sheet, x: x, y: y }));
    }
  };



   let prefix = '';

 if (cell_info.font.font_style.includes('bold')) prefix +='bold ';

 if (cell_info.font.font_style.includes('italic')) prefix +='italic ';

 let cfont = prefix+cell_info.font.font_size*cscale+'pt '+cell_info.font.font_name;


  let is_full = false;

  if (cell_info.is_calculated&&cell_info.calculated_value.toString().trim()!=='') is_full = true;
  else if (cell_info.value.toString().trim()!=='') is_full = true;

 const cstyle = {

    width:width +'px',

    height:height + 'px',

    font:cfont,

    color:cell_info.font_color,

    overflow:'visible',

    zIndex:cell_info.z,

    
 }   

  if (!the_sheet.grid_visibility) {


   cstyle.borderRight ='0'

    cstyle.borderBottom ='0'



  }

 
 if (cell_info.extra_border===true||cell_info.extra_border==='true') {

  
  
   if (!cell_info_top.extra_border)  cstyle.borderTop='1px solid black'

   if (!cell_info_left.extra_border)  cstyle.borderLeft='1px solid black'


   cstyle.borderBottom='1px solid black'

   cstyle.borderRight='1px solid black'
   

 }

 
 
 
  //if (!is_selected) {

     //if (is_full) cstyle.zIndex = x+1;
     //else cstyle.zIndex =0;

      cstyle.backgroundColor = cell_info.bcolor.toString()+'FF';


 //}

    // zIndex:(is_selected)?'':(is_full)?x+1:0,

  //let mt = (cellRef.current)?measureText(cellRef.current,cell_info.font.font_name,cell_info.value.toString())+20+'px':'100%'  

  if (is_edited &&layout_mode==='edit') {
    return (
      <div  data-cellrow={y} data-cellcol={x} className="sheet-cell editing" style={{ width, height, padding: 0, overflow:'visible',zIndex:'5000',backgroundColor:'white' }}>
     
            
        <input
          ref={inputRef}
          type="text"
          value={cell_info.edit_value}
          
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={()=> dispatch(edit_mode_save({ sheet: sheet, x: x, y: y }))}
          onKeyDown={handleKeyDown}
          style={{ fieldSizing:'content', zIndex:5001, height: '100%', border: 'none', outline: 'none', padding: '0 8px', font:cfont }}
        />
        
      </div>
    );
  }

 


  return (
    <div ref={cellRef} data-cellrow={y} data-cellcol={x} 
      className={`sheet-cell ${cell_info.type} ${is_selected&&layout_mode==='edit' ? 'selected active' : ''}`}
      style={cstyle}
      onMouseDown={
        (e)=>{

          

           let rr = cellRef.current.getBoundingClientRect()

        e.preventDefault();
        e.stopPropagation();

        if (layout_mode!=='edit') return;

        if (e.clientX>=rr.left&&e.clientX<=rr.right&&e.clientY>=rr.top&&e.clientY<=rr.bottom) {  

            if (event.button !== 2||!e.target.classList.contains('selected'))
            dispatch(select_cell({ sheet: sheet, x: x, y: y }));

        }else {

            cellRef.current.style.pointerEvents = 'none';

            const realTarget = document.elementFromPoint(e.clientX, e.clientY);

            cellRef.current.style.pointerEvents = '';

             const forwardedEvent = new MouseEvent('mousedown', {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,          // so it can bubble if needed
              cancelable: true,
              view: window,
              button: e.button,
              buttons: e.buttons,
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
              altKey: e.altKey,
              metaKey: e.metaKey,
           });
           realTarget.dispatchEvent(forwardedEvent);
           
           
            // realTarget.dblClick();

        }  


        }  
        
        //handleMouseDown
    
    
    
      }
      onMouseMove={handleMouseMove}
      onDoubleClick={(e) => {

        let rr = cellRef.current.getBoundingClientRect()

        e.preventDefault();
        e.stopPropagation();

        if (layout_mode!=='edit') return;

        if (e.clientX>=rr.left&&e.clientX<=rr.right&&e.clientY>=rr.top&&e.clientY<=rr.bottom) {

            
            startEditing(sheet, y, x)
        
        } else {

            cellRef.current.style.pointerEvents = 'none';

            const realTarget = document.elementFromPoint(e.clientX, e.clientY);

            cellRef.current.style.pointerEvents = '';

             const forwardedEvent = new MouseEvent('dblclick', {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,          // so it can bubble if needed
              cancelable: true,
              view: window,
              button: e.button,
              buttons: e.buttons,
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
              altKey: e.altKey,
              metaKey: e.metaKey,
           });
           realTarget.dispatchEvent(forwardedEvent);
           
           
            // realTarget.dblClick();

        }
       } 
      }
      onContextMenu={(e)=>{

         e.stopPropagation();
         e.preventDefault();    

         if (layout_mode!=='edit') return;
           

        if (cell_info.is_in_range&&!cell_info.is_selected) 
            
         {
             
            dispatch(show_menu({x:e.clientX,y:e.clientY, tpe:'multisel'}))
             
         } 


        }}
    > 
      {table_info?table_info:(cell_info.is_calculated)?cell_info.calculated_value:cell_info.value}
   
    </div>
  );
};