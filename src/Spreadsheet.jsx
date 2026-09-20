import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Row, RowHeaders} from './Row'
import { TOTAL_ROWS} from './consts'
import {update_col_width, update_row_height,  stop_selecting, get_grid_visibility} from './sheetSlice'
import {Toolbar} from  './Toolbar'
import {StatusBar} from  './StatusBar'
import {ColumnHeaders} from  './ColumnHeaders'
import {Pic} from './Pic'
import { isNumeric } from './formula';
import { getColumnIndex } from './formula';

import {Diag} from './Diag'




import './Spreadsheet.css';



const Sheet = React.memo(({sheet = 0, handleColumnResizeStart, handleRowResizeStart}) =>{

 const gridContainerRef = useRef(null);
 
 const cellsScrollRef = useRef(null);

 const rowHeadersRef = useRef(null);

 const colHeadersRef = useRef(null);

 const pics = useSelector(store => store.sheet.pics);

 const diags = useSelector(store => store.sheet.diags);

 const xlabels=useSelector(store => store.layout.xlabels);

 const ylabels=useSelector(store => store.layout.ylabels);

 const grid_visibility = useSelector(state=>get_grid_visibility(state, sheet))

 
 const sheets = useSelector(state=>state.sheet.sheets)

 const sh = sheets.find(o=>o.sheet ===sheet);

 const table = useSelector(state=>state.data.epuraData)

 const k = parseFloat(sh.table_selected);

  const { tableMap } = useMemo(() => {
    const raw = table?.table_data;
    if (!raw) return { ttt: null, tableMap: null };

    let min_x = 100000;
    let min_y = 100000;
    let shift_x = 0;
    let shift_y = 0;
    let good = true;

    // --- parse table position (e.g. "B$3") ---
    if (sh.table_pos.toString().trim() !== '') {
      const pos = sh.table_pos.split('$');
      if (pos.length !== 2) good = false;

      if (good && (pos[0].length > 2 || pos[0].length === 0)) good = false;
      if (good && (pos[0][0] < 'A' || pos[0][0] > 'Z')) good = false;
      if (good && pos[0].length === 2 && (pos[0][1] < 'A' || pos[0][1] > 'Z')) good = false;

      if (good && parseFloat(pos[1]) >= 0) {
        shift_x = getColumnIndex(pos[0]);
        shift_y = parseFloat(pos[1]);
      }
    } else {
      good = false;
    }

    // --- find min x/y for the selected table list ---
    if (good) {
      for (let i = 0; i < raw.length; i++) {
        if (raw[i].plist_no !== k) continue;
        if (raw[i].x < min_x) min_x = raw[i].x;
        if (raw[i].y < min_y) min_y = raw[i].y;
      }
    }

    // --- filter, clone, transform ---
    const tttArr = raw
      .filter(o => o.plist_no === k && o.value !== null)
      .map(o => ({ ...o }));

    const tablePres = sh.table_pres.toString().trim();

    for (let i = 0; i < tttArr.length; i++) {

      tttArr[i].x = tttArr[i].x-1

      tttArr[i].y = tttArr[i].y-1

      if (good) {
        tttArr[i].x = tttArr[i].x - min_x + 1 + shift_x;
        tttArr[i].y = tttArr[i].y - min_y + shift_y;
      }
      if (tablePres !== '') {
        let rrr = tttArr[i].value;
        if (rrr.toString().trim() !== '' && isNumeric(rrr.toString())) {
          rrr = parseFloat(rrr).toFixed(parseFloat(tablePres)).toString();
        }
        tttArr[i].value = rrr;
      }
    }

    // --- build O(1) lookup map ---
    const map = new Map();
    for (const item of tttArr) {
      map.set(item.x + '_' + item.y, item.value);
    }

    return { ttt: tttArr, tableMap: map };
  }, [table?.table_data, k, sh.table_pres, sh.table_pos]);




 


 const sync_scroll = useCallback((e) => {

 
  if (rowHeadersRef.current) {
    rowHeadersRef.current.scrollTop = e.target.scrollTop;
  }
  if (colHeadersRef.current) {
    colHeadersRef.current.scrollLeft = e.target.scrollLeft;
  }
}, []);

 

  return (

    <div className="grid-container on-print" ref={gridContainerRef}>
     <div style={{display:'flex', flexDirection:'row'}}>
       <div className="fixed-cell"></div>
       {xlabels!=='off'&&<ColumnHeaders  ref={colHeadersRef} sheet={sheet} onColumnResizeStart={handleColumnResizeStart} />} 
     </div>
     <div className="grid-body on-print">
      <div className='on-print' style={{display:'flex', flexDirection:'row', overflow:'hidden'}}>
       {ylabels!=='off'&&<RowHeaders ref={rowHeadersRef} sheet={sheet} onRowResizeStart={handleRowResizeStart}></RowHeaders>}
        <div ref={cellsScrollRef} onScroll={sync_scroll} className='sync-scroll on-print' /*style={{overflow:'auto'}}*/>
        <div style={{position:'relative'}}>
 {Array.from({ length: TOTAL_ROWS }).map((_, rowIdx) => (
           
            
           <Row
               key={rowIdx}
              sheet={sheet}
             rowIndex={rowIdx}
              // onRowResizeStart={handleRowResizeStart}
              grid_visibility={grid_visibility}
              tableMap = {tableMap}
              // height={parseFloat(rowHeights[rowIdx]) * parseFloat(cscale)}
            />
         ))}

         {Object.values(pics).filter(o=>o.sheet===sheet).map((item)=>{

        

            return <Pic key = {item.sheet.toString()+'_'+item.idx.toString()} sheet={item.sheet} idx={item.idx}></Pic>})}

           {Object.values(diags).filter(o=>o.sheet===sheet).map((item)=>{

        

          return <Diag key = {item.sheet.toString()+'_'+item.idx.toString()} sheet={item.sheet} idx={item.idx}></Diag>})}

{/* <Pic></Pic> */}
</div>
        </div>
        
      </div>
     
      
     </div>

    
     
    </div>


  )


})


const ExcelApp = () => {


  const sheet = useSelector(state=>state.sheet.selected_sheet);


  
 

  const isResizing = useRef(false);

  const resizeObject = useRef(null);

  const dispatch = useDispatch();

 

 const handleRowResizeStart = useCallback((e, idx, cscale) => {
     resizeObject.current = {
      sheet:sheet,
      idx:idx,
      tpe:'row',
      obj:e.target.parentElement,
      startY: e.clientY,
      startHeight:e.target.parentElement.clientHeight,
      cscale:cscale

    }

    let rails = e.target.parentElement.querySelectorAll('.row-header-rail');

    for (let i =0; i<rails.length;i++) rails[i].style.display=''; 

    isResizing.current = true;

}, [sheet]);

 /*const handleRowResizeStart = (e, idx, cscale) => {

     

     resizeObject.current = {
      sheet:sheet,
      idx:idx,
      tpe:'row',
      obj:e.target.parentElement,
      startY: e.clientY,
      startHeight:e.target.parentElement.clientHeight,
      cscale:cscale

    }

    let rails = e.target.parentElement.querySelectorAll('.row-header-rail');

    for (let i =0; i<rails.length;i++) rails[i].style.display=''; 

    isResizing.current = true;

  };*/


  const handleColumnResizeStart = useCallback((e, idx, cscale) => {
  resizeObject.current = {

      sheet:sheet,
      idx:idx,
      tpe:'col',
      obj:e.target.parentElement,
      startX: e.clientX,
      startWidth:e.target.parentElement.clientWidth,
      cscale:cscale

    }



   


    let rails = e.target.parentElement.querySelectorAll('.col-header-rail');

    for (let i =0; i<rails.length;i++) rails[i].style.display=''; 

    isResizing.current = true;
}, [sheet]);




  
 

  
  const handleMouseMove = useCallback ((e) => {

  
   
    if (!isResizing.current||!resizeObject.current ) return;


    if (resizeObject.current.tpe === 'col') {
      const newWidth = Math.max(20, resizeObject.current.startWidth + (e.clientX - resizeObject.current.startX));

      
      resizeObject.current.obj.style.width = newWidth +'px'; 
    } else {
      const newHeight = Math.max(10, resizeObject.current.startHeight + (e.clientY- resizeObject.current.startY));
      resizeObject.current.obj.style.height = newHeight +'px'; 
    }
  }, [dispatch]);


  const handleMouseUp = useCallback (() => {
  
    isResizing.current = false;

    

    dispatch(stop_selecting())

    if (resizeObject.current) {

     

      let rails = resizeObject.current.obj.querySelectorAll('.col-header-rail');

      for (let i =0; i<rails.length;i++) rails[i].style.display='none'; 

      rails = resizeObject.current.obj.querySelectorAll('.row-header-rail');

      for (let i =0; i<rails.length;i++) rails[i].style.display='none'; 

      


      if (resizeObject.current.tpe==='col') dispatch(update_col_width({sheet:resizeObject.current.sheet, idx:resizeObject.current.idx, new_width:parseFloat(resizeObject.current.obj.style.width)/resizeObject.current.cscale}))

      else dispatch(update_row_height({sheet:resizeObject.current.sheet, idx:resizeObject.current.idx, new_height:parseFloat(resizeObject.current.obj.style.height)/resizeObject.current.cscale}))

      resizeObject.current = null;

    }
    
      
  }, [dispatch]);


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="spreadsheet on-print">
      <Toolbar  />
      <Sheet key={sheet} sheet={sheet} handleColumnResizeStart={handleColumnResizeStart} handleRowResizeStart={handleRowResizeStart}></Sheet>
      <StatusBar />
     
     </div>
  );
};

export default ExcelApp;