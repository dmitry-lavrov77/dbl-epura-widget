import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Cell} from './Cell'
import {Row, RowHeaders} from './Row'
import { TOTAL_ROWS} from './consts'
import {update_col_width, update_row_height, get_col_info, stop_selecting} from './sheetSlice'
import {Toolbar} from  './Toolbar'
import {StatusBar} from  './StatusBar'
import {ColumnHeaders} from  './ColumnHeaders'
import {Pic} from './Pic'

import {Diag} from './Diag'




import './Spreadsheet.css';



const Sheet = ({sheet = 0, handleColumnResizeStart, handleRowResizeStart}) =>{

 const gridContainerRef = useRef(null);
 
 const cellsScrollRef = useRef(null);

 const rowHeadersRef = useRef(null);

 const colHeadersRef = useRef(null);

 const pics = useSelector(store => store.sheet.pics);

 const diags = useSelector(store => store.sheet.diags);

 





 const sync_scroll = (e) => {

 
  if (rowHeadersRef.current) {
    rowHeadersRef.current.scrollTop = e.target.scrollTop;
  }
  if (colHeadersRef.current) {
    colHeadersRef.current.scrollLeft = e.target.scrollLeft;
  }
};

 

  return (

    <div className="grid-container" ref={gridContainerRef}>
     <div style={{display:'flex', flexDirection:'row'}}>
       <div className="fixed-cell"></div>
       <ColumnHeaders  ref={colHeadersRef} sheet={sheet} onColumnResizeStart={handleColumnResizeStart} />
     </div>
     <div className="grid-body">
      <div style={{display:'flex', flexDirection:'row', overflow:'hidden'}}>
       <RowHeaders ref={rowHeadersRef} sheet={sheet} onRowResizeStart={handleRowResizeStart}></RowHeaders>
        <div ref={cellsScrollRef} onScroll={sync_scroll} style={{overflow:'auto'}}>
        <div style={{position:'relative'}}>
 {Array.from({ length: TOTAL_ROWS }).map((_, rowIdx) => (
           
            
           <Row
               key={rowIdx}
              sheet={sheet}
             rowIndex={rowIdx}
              onRowResizeStart={handleRowResizeStart}
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


  //  <div className="grid-container" ref={gridContainerRef}>
  //       <ColumnHeaders  sheet={sheet} onColumnResizeStart={handleColumnResizeStart} />
  //       <div className="grid-body">
  //         <div className="row-headers-fixed">
  //          {Array.from({ length: TOTAL_ROWS }).map((_, rowIdx) => (
  //           <div key={rowIdx} className="row-header" style={{ height: 24, width: 45 }}>
  //            {rowIdx + 1}
  //            <div className="row-resize-handle" onMouseDown={()=>{}} />
  //           </div>
  //         ))}
  //        </div>
  //        <div className="cells-scroll">
  //         {Array.from({ length: TOTAL_ROWS }).map((_, rowIdx) => (
            
  //           <Row
  //             key={rowIdx}
  //             sheet={sheet}
  //             rowIndex={rowIdx}
  //             onRowResizeStart={handleRowResizeStart}
  //            />
  //         ))}
  //         </div>
  //       </div>
  //     </div>
  )


}


const ExcelApp = () => {


  const sheet = useSelector(state=>state.sheet.selected_sheet);
  
 

  const isResizing = useRef(false);

  const resizeObject = useRef(null);

  const dispatch = useDispatch();

 

 

 const handleRowResizeStart = (e, idx) => {

     resizeObject.current = {
      sheet:sheet,
      idx:idx,
      tpe:'row',
      obj:e.target.parentElement,
      startY: e.clientY,
      startHeight:e.target.parentElement.clientHeight

    }

    let rails = e.target.parentElement.querySelectorAll('.row-header-rail');

    for (let i =0; i<rails.length;i++) rails[i].style.display=''; 

    isResizing.current = true;

  };


  const handleColumnResizeStart = (e, idx) =>{

   
    resizeObject.current = {

      sheet:sheet,
      idx:idx,
      tpe:'col',
      obj:e.target.parentElement,
      startX: e.clientX,
      startWidth:e.target.parentElement.clientWidth

    }

    let rails = e.target.parentElement.querySelectorAll('.col-header-rail');

    for (let i =0; i<rails.length;i++) rails[i].style.display=''; 

    isResizing.current = true;

  }



  
 

  
  const handleMouseMove = (e) => {
   
    if (!isResizing.current||!resizeObject.current ) return;


    if (resizeObject.current.tpe === 'col') {
      const newWidth = Math.max(20, resizeObject.current.startWidth + (e.clientX - resizeObject.current.startX));

      
      resizeObject.current.obj.style.width = newWidth +'px'; 
    } else {
      const newHeight = Math.max(10, resizeObject.current.startHeight + (e.clientY- resizeObject.current.startY));
      resizeObject.current.obj.style.height = newHeight +'px'; 
    }
  };


  const handleMouseUp = () => {
  
    isResizing.current = false;

    dispatch(stop_selecting())

    if (resizeObject.current) {

      let rails = resizeObject.current.obj.querySelectorAll('.col-header-rail');

      for (let i =0; i<rails.length;i++) rails[i].style.display='none'; 

      rails = resizeObject.current.obj.querySelectorAll('.row-header-rail');

      for (let i =0; i<rails.length;i++) rails[i].style.display='none'; 

      if (resizeObject.current.tpe==='col') dispatch(update_col_width({sheet:resizeObject.current.sheet, idx:resizeObject.current.idx, new_width:parseFloat(resizeObject.current.obj.style.width)}))

      else dispatch(update_row_height({sheet:resizeObject.current.sheet, idx:resizeObject.current.idx, new_height:parseFloat(resizeObject.current.obj.style.height)}))

      resizeObject.current = null;

    }
    
      
  };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="spreadsheet">
      <Toolbar  />
      <Sheet sheet={sheet} handleColumnResizeStart={handleColumnResizeStart} handleRowResizeStart={handleRowResizeStart}></Sheet>
      <StatusBar />
     
     </div>
  );
};

export default ExcelApp;