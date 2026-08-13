import {DEFAULT_ROW_HEIGHT, TOTAL_COLS} from './consts'
import { useSelector } from 'react-redux';
import {get_col_info} from './sheetSlice'

const ColumnHeader = ({ sheet, idx, onColumnResizeStart }) => {

  const col =useSelector(state=>get_col_info(state, sheet, idx));
  
  return (


    <div key={idx} className="col-header" style={{ width: col.width, height: DEFAULT_ROW_HEIGHT }}>
        {col.label}
        
          <div className={'col-header-rail'} style={{ display:'none', width:'1px', backgroundColor:'black',position:'absolute', top:'0', right:'0px', height:'100vh'}}></div> 
          <div className={'col-header-rail'} style={{ display:'none', width:'1px', backgroundColor:'black',position:'absolute', top:'0', left:'0px', height:'100vh'}}></div> 

        <div className="col-resize-handle" onMouseDown={(e) => onColumnResizeStart(e, idx)}>
         
        </div>
    </div>




  )

}


export const ColumnHeaders = ({sheet, onColumnResizeStart, ref }) => {
  
  
  const headers = [];
  for (let i = 0; i <TOTAL_COLS; i++) {
    headers.push(

      <ColumnHeader key={i} sheet = {sheet} idx = {i} onColumnResizeStart={onColumnResizeStart}></ColumnHeader>
       
    );
  }
  return (
    <div ref={ref} className="column-headers no-print">
      {/* <div className="corner-header" style={{ width: 45, height: DEFAULT_ROW_HEIGHT }} /> */}
      {headers}
    </div>
  );
};
