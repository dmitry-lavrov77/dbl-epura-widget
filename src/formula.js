
export const isNumeric = (str) => {

    if (str.trim()==='') return true; 
    return !isNaN(str) && !isNaN(parseFloat(str));

}   


export const  getColumnIndex = (label) =>{
  let result = 0;
  for (let i = 0; i < label.length; i++) {
    result = result * 26 + (label.charCodeAt(i) - 64);
  }
  return result - 1; // zero‑based
}


export const getColumnLabel = (index) => {
  let label = '';
  let num = index;
  while (num >= 0) {
    label = String.fromCharCode(65 + (num % 26)) + label;
    num = Math.floor(num / 26) - 1;
  }
  return label;
};


export const  parseCellRef = (ref) =>{
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return null;
  const colStr = match[1].toUpperCase();
  const rowNum = parseInt(match[2], 10) - 1; 
  const colIdx = getColumnIndex(colStr);
  if (rowNum >= 0 && colIdx >= 0) {
    return { row: rowNum, col: colIdx };
  }
  return null;
}



function extractCellReferences(expr) {
  const cells = new Set();
  const ranges = new Set();

  // 1. Match function ranges: SUM(A1:B3), AVERAGE(C5:D10), etc.
  const rangePattern = /([A-Z]+[0-9]+:[A-Z]+[0-9]+)/gi;
  let match;
  while ((match = rangePattern.exec(expr)) !== null) {
    ranges.add(match[0].toUpperCase());
  }

  let temp = expr;
  for (const range of ranges) {
    temp = temp.replace(new RegExp(range, 'gi'), '___RANGE___');
  }
  const cellPattern = /\b([A-Z]+)(\d+)\b/gi;
  while ((match = cellPattern.exec(temp)) !== null) {
    cells.add(match[0].toUpperCase());
  }

  return {
    cells: Array.from(cells),
    ranges: Array.from(ranges),
    all: [...Array.from(cells), ...Array.from(ranges)]
  };
}


function expandRange(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return [];
  const start = parseCellRef(parts[0]);
  const end = parseCellRef(parts[1]);
  if (!start || !end) return [];
  const cells = [];
  for (let r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++) {
    for (let c = Math.min(start.col, end.col); c <= Math.max(start.col, end.col); c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

export function getAllIndividualCells(expr) {
  const { cells, ranges } = extractCellReferences(expr);
  const individual = new Set(cells);
  for (const range of ranges) {
    const expanded = expandRange(range);
    expanded.forEach(({ row, col }) => {
      const colLabel = getColumnLabel(col);
      individual.add(`${colLabel}${row + 1}`);
    });
  }
  return Array.from(individual);
}


const getCellValue = (cells, sheet, y, x) =>{

   let _key  = sheet.toString()+'_'+x.toString()+'_'+y.toString();

   return cells[_key].calculated_value;


} 

// Range: "A1:B3" → array of {row, col}
const parseRange = (rangeStr) => {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return [];
  const start = parseCellRef(parts[0]);
  const end = parseCellRef(parts[1]);
  if (!start || !end) return [];
  const cells = [];
  for (let r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++)
    for (let c = Math.min(start.col, end.col); c <= Math.max(start.col, end.col); c++)
      cells.push({ row: r, col: c });
  return cells;
};

const sumRange = (grid, rangeStr) => {
  const cells = parseRange(rangeStr);
  return cells.reduce((sum, { row, col }) => sum + getCellNumeric(grid, row, col), 0);
};
const avgRange = (grid, rangeStr) => {
  const cells = parseRange(rangeStr);
  if (cells.length === 0) return 0;
  const total = cells.reduce((sum, { row, col }) => sum + getCellNumeric(grid, row, col), 0);
  return total / cells.length;
};
const minRange = (grid, rangeStr) => {
  const cells = parseRange(rangeStr);
  if (cells.length === 0) return 0;
  return Math.min(...cells.map(({ row, col }) => getCellNumeric(grid, row, col)));
};
const maxRange = (grid, rangeStr) => {
  const cells = parseRange(rangeStr);
  if (cells.length === 0) return 0;
  return Math.max(...cells.map(({ row, col }) => getCellNumeric(grid, row, col)));
};



export const evaluateExcelExpression = (expr,  cells0, sheet, getCellRaw = null) => {


  let working = expr.trim();
  if (working === '') return { value: 0, display: '' };

  try {
    // 1. Replace functions (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA) with their computed values
    const funcPattern = /(SUM|AVERAGE|MIN|MAX|COUNT|COUNTA)\(([A-Z]+[0-9]+:[A-Z]+[0-9]+)\)/gi;
    let match;
    while ((match = funcPattern.exec(working)) !== null) {
      const fullMatch = match[0];
      const funcName = match[1].toUpperCase();
      const rangeStr = match[2];
      let result = 0;

      // Parse range into list of {row, col}
      const cells = parseRange(rangeStr);
      
      if (funcName === 'SUM') {
        result = cells.reduce((sum, { row, col }) => sum + getCellValue(cells0, sheet, row, col), 0);
      } else if (funcName === 'AVERAGE') {
        if (cells.length === 0) result = 0;
        else result = cells.reduce((sum, { row, col }) => sum + getCellValue(cells0, sheet, row, col), 0) / cells.length;
      } else if (funcName === 'MIN') {
        if (cells.length === 0) result = 0;
        else result = Math.min(...cells.map(({ row, col }) => getCellValue(cells0, sheet, row, col)));
      } else if (funcName === 'MAX') {
        if (cells.length === 0) result = 0;
        else result = Math.max(...cells.map(({ row, col }) => getCellValue(cells0, sheet, row, col)));
      } else if (funcName === 'COUNT') {
        result = cells.filter(({ row, col }) => {
          const val = getCellValue(cells0, sheet, row, col);
          return typeof val === 'number' && !isNaN(val) && val !== '';
        }).length;
      } else if (funcName === 'COUNTA') {
        if (!getCellRaw) result = 0;
        else {
          result = cells.filter(({ row, col }) => {
            const raw = getCellRaw(row, col);
            return raw !== undefined && raw !== null && raw !== '';
          }).length;
        }
      }
      working = working.replace(fullMatch, result.toString());
      funcPattern.lastIndex = 0; // reset because we replaced text
    }

    // 2. Replace cell references (e.g., A1, B2, AA5) with their numeric values
    const cellRefPattern = /\b([A-Z]+)(\d+)\b/g;
    let replacedExpr = working;
    const refs = [];
    let refMatch;
    while ((refMatch = cellRefPattern.exec(working)) !== null) {
      const refStr = refMatch[0];
      const { row, col } = parseCellRef(refStr);
      const numericValue = (row !== undefined && col !== undefined) ? getCellValue(cells0, sheet, row, col) : 0;
      refs.push({ ref: refStr, val: numericValue });
    }
    // Replace from longest to shortest to avoid partial overlaps (though not needed with word boundaries)
    for (const { ref, val } of refs) {
      const regex = new RegExp('\\b' + ref + '\\b', 'g');
      replacedExpr = replacedExpr.replace(regex, val.toString());
    }

    // 3. Validate that only safe arithmetic characters remain
    if (!/^[\d+\-*/().\s]+$/.test(replacedExpr)) {
      return { value: NaN, display: '#ERROR? (invalid characters)' };
    }

    // 4. Evaluate arithmetic expression safely
    // Use Function constructor to avoid eval() in strict mode (still similar but scoped)
    const evalFn = new Function('return (' + replacedExpr + ')');
    const computed = evalFn();
    if (isNaN(computed) || !isFinite(computed)) {
      return { value: NaN, display: '#VALUE!' };
    }
    const rounded = parseFloat(computed.toFixed(10));
    return { value: rounded, display: rounded.toString() };
  } catch (err) {
    console.warn('Formula evaluation error:', err);
    return { value: NaN, display: '#ERROR!' };
  }
}