export const TOTAL_ROWS = 150;
export const TOTAL_COLS = 100;
export const DEFAULT_ROW_HEIGHT = 34;
export const DEFAULT_COL_WIDTH = 64;

export const get_cells_keys = (sheet)  =>{

  let res = [];

  for (let i=0;i<TOTAL_ROWS; i++)
   for (let j=0;j<TOTAL_COLS; j++)
   res.push(sheet.toString()+'_'+j.toString()+'_'+i.toString())

  return res;

}


export const get_rows_keys = (sheet)  =>{

  let res = [];

  for (let i=0;i<TOTAL_ROWS; i++)
  
   res.push(sheet.toString()+'_'+i.toString())

  return res;

}


export const get_columns_keys = (sheet)  =>{

  let res = [];

  for (let i=0;i<TOTAL_COLS; i++)
  
   res.push(sheet.toString()+'_'+i.toString())

  return res;


}