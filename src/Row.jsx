import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {get_row_info, get_row_heights} from './sheetSlice'
import {TOTAL_COLS, TOTAL_ROWS} from './consts'
import {Cell} from './Cell'
import { ContextMenu } from './ContextMenu';

export const Row = ({ sheet,  rowIndex, onRowResizeStart, onCellMouseDown}) => {
  
  const cells = [];

  const rowHeight = useSelector(state=>get_row_info(state, sheet, rowIndex)).height;

  for (let col = 0; col < TOTAL_COLS; col++) {
        cells.push(
      <Cell
        key={`${rowIndex}-${col}`}
        sheet={sheet}
        x={col}
        y={rowIndex}
       
      />
    );
  }
  return (
    <div className="data-row" style={{ height: rowHeight }}>
      {/* <div className="row-header" style={{ height: rowHeight }}>
        {rowIndex + 1}
        <div className="row-resize-handle" onMouseDown={(e) => onRowResizeStart(e, rowIndex)} />
        <div className={'row-header-rail'} style={{ display:'none', height:'1px', backgroundColor:'black',position:'absolute', left:'0', top:'0px', width:'100vw'}}></div> 
        <div className={'row-header-rail'} style={{ display:'none', height:'1px', backgroundColor:'black',position:'absolute', left:'0', bottom:'0px', width:'100vw'}}></div> 
      </div> */}
      <div className="row-cells">{cells}</div>
    </div>
  );
};

export const RowHeaders = ({sheet, onRowResizeStart, ref}) =>{

   const row_heights = useSelector(state=>get_row_heights(state, sheet), shallowEqual);

   const context_menu = useSelector(state=>state.cmenu.context_menu);


   
    return (



     <div className="row-headers-fixed" ref={ref}>


            {Array.from({ length: TOTAL_ROWS }).map((_, rowIdx) => (
             <div key={rowIdx}  className="row-header" style={{ height: `${row_heights[rowIdx]+'px'}`, width: 45 }}>
              {rowIdx + 1}
                <div className="row-resize-handle" onMouseDown={(e) => onRowResizeStart(e, rowIdx)} />
                <div className={'row-header-rail'} style={{ display:'none', height:'1px', backgroundColor:'black',position:'absolute', left:'0', top:'0px', width:'100vw'}}></div> 
                <div className={'row-header-rail'} style={{ display:'none', height:'1px', backgroundColor:'black',position:'absolute', left:'0', bottom:'0px', width:'100vw'}}></div>
             </div>
             ))}


          {context_menu.visible && (
        <ContextMenu x={context_menu.x} y={context_menu.y} tpe={context_menu.tpe} arg={context_menu.arg}
      />
     )}

        </div>



  )



}
