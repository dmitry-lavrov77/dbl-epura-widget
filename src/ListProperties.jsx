import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { update_grid_visibility, rename_sheet, set_sheet_list, update_table_pos, update_table_pres } from './sheetSlice';
import { useGetPlotListQuery } from './apiSlice';



// ----- Styles (extended with select style) -----
const styles = {
  container: {
    flex: 1,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: 14,
    overflow: 'hidden',
  },
  title: {
    padding: '18px 22px 14px 22px',
    fontSize: 17,
    fontWeight: 600,
    color: '#1e293b',
    borderBottom: '1px solid #e9edf2',
    background: '#fafbfc',
  },
  body: {
    position: 'relative',
    padding: '16px 22px 20px 22px',
  },
  row: {
    marginBottom: 16,
    '&:lastChild': { marginBottom: 0 },
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: '#334155',
    fontWeight: 500,
    gap: 10,
    flexWrap: 'wrap',
  },
  labelInput: {
    justifyContent: 'space-between',
  },
  labelCheckbox: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  labelSelect: {
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    minWidth: 160,
    padding: '6px 10px',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#ffffff',
  },
  select: {
    flex: 1,
    minWidth: 160,
    padding: '6px 30px 6px 10px',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#ffffff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%235f6b7a\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E") no-repeat right 10px center',
    backgroundSize: 12,
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    accentColor: '#4f7df3',
  },
  hiddenSpan: {
    display: 'none',
  },
};

// ----- Main Component -----
export const ListProperties = () => {
  const dispatch = useDispatch();

  const active_sheet = useSelector((state) => state.sheet.selected_sheet);
  const sheets = useSelector((state) => state.sheet.sheets);
  const the_sheet = sheets.find((o) => o.sheet === active_sheet);


  const selected = useSelector(state=>state.layout.selected_epura)

  const plot_set = useGetPlotListQuery();



  const the_list = (plot_set.data)?plot_set.data.filter(o=>o.plist_plot_no===selected.plot_no):[]

  the_list.unshift({plist_name:'не задана', plist_no:-1}) 




  // Get lists from Redux
  //const lists = useSelector((state) => state.sheet.table_list) || [];

  // Local state for selected list (replace with Redux if needed)
 // const [selectedListId, setSelectedListId] = useState(
 //   lists.length > 0 ? lists[0].id : ''
 // );

  const handleChange = (field, value) => {
    if (field === 'grid_visibility')
      dispatch(update_grid_visibility({ grid_visibility: value }));

    if (field === 'sheet_title')
      dispatch(rename_sheet({ sheet: active_sheet, title: value }));


    if (field === 'table_pos')
      dispatch(update_table_pos({ sheet: active_sheet, pos: value }));


   if (field === 'table_pres')
      dispatch(update_table_pres({ sheet: active_sheet, pos: value }));


    // Example: dispatch an action for list selection if you have one
    // if (field === 'selected_list') {
    //   dispatch(selectList({ listId: value }));
    // }
  };

  // Handle select change – updates local state, but you can dispatch here too
  const handleListChange = (e) => {
    
    const value = e.target.value;
    
     dispatch(set_sheet_list({ sheet: the_sheet.sheet,  table_selected:value }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Настройки листа</div>
      <div style={styles.body}>
        {/* Имя листа */}
        <div style={styles.row}>
          <label style={{ ...styles.label, ...styles.labelInput }}>
            Имя листа:
            <input
              type="text"
              style={styles.input}
              value={the_sheet?.title || ''}
              onChange={(e) => handleChange('sheet_title', e.target.value)}
            />
            <span style={styles.hiddenSpan}>undefined</span>
          </label>
        </div>

        {/* Отображать сетку */}
        <div style={styles.row}>
          <label style={{ ...styles.label, ...styles.labelCheckbox }}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={the_sheet?.grid_visibility || false}
              onChange={(e) => handleChange('grid_visibility', e.target.checked)}
            />
            Отображать сетку
          </label>
        </div>

        {/* NEW: Select box for lists */}
        <div style={styles.row}>
          <label style={{ ...styles.label, ...styles.labelSelect }}>
            Таблица листа:
            <select
              style={styles.select}
              value={the_sheet.table_selected}
              onChange={handleListChange}
            >
              {the_list.map((list) => (
                <option key={list.plist_no} value={list.plist_no}>
                  {list.plist_name}
                </option>
              ))}
            </select>
          </label>
          
        </div>

         
<div style={styles.row}>

  
      <label style={{ ...styles.label, ...styles.labelInput }}>
            Положение:
            <input
              type="text"
              style={styles.input}
              value={the_sheet?.table_pos || ''}
              onChange={(e) => handleChange('table_pos', e.target.value)}
            />
            <span style={styles.hiddenSpan}>undefined</span>
          </label>
        

      <label style={{ ...styles.label, ...styles.labelInput }}>
            Точность:
            <input
              type="text"
              style={styles.input}
              value={the_sheet?.table_pres || ''}
              onChange={(e) => handleChange('table_pres', e.target.value)/*handleChange('sheet_title', e.target.value)*/}
            />
            <span style={styles.hiddenSpan}>undefined</span>
          </label>



        </div>
          
      </div>

      {/* Global styles for focus/hover */}
      <style>{`
        input:focus, select:focus {
          border-color: #4f7df3 !important;
          box-shadow: 0 0 0 3px rgba(79,125,243,0.15) !important;
        }
        input:hover, select:hover {
          border-color: #a0aec0 !important;
        }
        input[type="checkbox"]:focus {
          outline: 2px solid #4f7df3;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};