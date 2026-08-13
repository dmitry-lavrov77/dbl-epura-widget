import { useDispatch, useSelector } from 'react-redux';
import {get_selected_cell} from './sheetSlice'
import {getColumnLabel} from './formula'


export const Toolbar = ({ activeCell }) => {

 const active_sheet = useSelector(state=>state.sheet.selected_sheet) 

 const selected = useSelector(state=>get_selected_cell(state, active_sheet)) 

 const formulabar = useSelector(state=>state.layout.formulabar)

 

  


 const addr = (selected)?getColumnLabel(selected.x)+(selected.y+1).toString():''
  return (
   (formulabar!=='off')&&<div className="toolbar no-print">
      <div className="cell-address">{addr}</div>
      <div className="formula-label">ƒx</div>
      <div className="formula-bar-mock">{selected?((selected.is_calculated)?selected.formula:selected.value):''}</div>
    </div>
  );
};
