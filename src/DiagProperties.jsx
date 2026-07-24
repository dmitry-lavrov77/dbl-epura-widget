import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {get_diag_info, update_diag_property} from './sheetSlice'
import { useGetDiagramListQuery } from './apiSlice';
//import {
  //updateChartProperty,
  //updateAxisProperty,
  //updateLegendProperty,
  //updateTableProperty,
//} from '../store/chartPropertiesSlice';

// ----- Styles (reused from previous component) -----
const styles = {
  container: {
    //minWidth: 371,
    //maxWidth: 371,
    flex:1,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: 14,
    overflow: 'hidden',
    position: 'relative', // for absolute positioning of the extra list
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
    padding: '6px 0 12px 0',
    paddingBottom: '220px', // leave space for the absolute list
  },
  group: {
    borderBottom: '1px solid #eef1f5',
  },
  groupTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 22px',
    cursor: 'pointer',
    userSelect: 'none',
    borderRadius: 4,
    margin: '0 4px',
    transition: 'background 0.15s',
  },
  groupTitleIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    marginRight: 14,
    transition: 'transform 0.25s ease',
    color: '#5f6b7a',
    fontSize: 14,
  },
  groupTitleIconOpen: {
    transform: 'rotate(90deg)',
  },
  groupTitleText: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: 14,
  },
  groupBody: {
    padding: '4px 22px 18px 22px',
    animation: 'fadeSlide 0.2s ease',
  },
  row: {
    marginBottom: 12,
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
  labelSelect: {
    justifyContent: 'space-between',
  },
  labelCheckbox: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  labelInput: {
    justifyContent: 'space-between', // for number inputs with "авто" button
    position: 'relative',
  },
  select: {
    flex: 1,
    minWidth: 140,
    padding: '6px 30px 6px 12px',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    background:
      '#ffffff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%235f6b7a\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E") no-repeat right 12px center',
    backgroundSize: 12,
    appearance: 'none',
    WebkitAppearance: 'none',
    fontSize: 13,
    color: '#1e293b',
    cursor: 'pointer',
    lineHeight: 1.4,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: {
    flex: 1,
    minWidth: 80,
    padding: '6px 10px',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#ffffff',
  },
  inputNumber: {
    flex: 1,
    minWidth: 80,
    padding: '6px 10px',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    fontSize: 13,
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#ffffff',
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    accentColor: '#4f7df3',
  },
  autoButton: {
    cursor: 'pointer',
    color: 'blue',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: 500,
    background: 'none',
    border: 'none',
    padding: '0 4px',
  },
  hiddenSpan: {
    display: 'none',
  },
  // Extra list at bottom
  extraList: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    height: 200,
    overflow: 'auto',
    background: '#f9fafb',
    borderTop: '1px solid #e2e8f0',
    padding: '8px 12px',
    margin: 0,
    listStyle: 'none',
    fontSize: 12,
    color: '#475569',
  },
  extraListItem: {
    padding: '2px 0',
    borderBottom: '1px solid #eef1f5',
  },
};

// ----- SVG Icon (same as before) -----
const AngleRightIcon = () => (
  <svg
    className="svg-inline--fa fa-angle-right"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="angle-right"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    style={{ display: 'block', width: 14, height: 14 }}
  >
    <path
      fill="currentColor"
      d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
    />
  </svg>
);

// ----- Main Component -----
export const DiagProperties = () => {
  const dispatch = useDispatch();
  
   const so = useSelector((state) => state.sheet.selected_object);

   //let key = so.sheet.toString()+'_'+so.idx.toString();

    const diag_info = useSelector(state => get_diag_info(state, so.sheet, so.idx));

    


    const se = useSelector(state=>state.layout.selected_epura);

 
    



  // Accordion state (all groups closed initially, except first?)
  const [openGroups, setOpenGroups] = useState({
    diagram: false,
    axisX: false,
    axisY: false,
    grid: false,
    legend: false,
    // table: false,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ----- Handlers -----
  const handleTopLevelChange = (field, value) => {
    dispatch(update_diag_property({ field, value }));
  };

  const handleAxisChange = (axis, field, value) => {
    //dispatch(updateAxisProperty({ axis, field, value }));
  };

  const handleLegendChange = (field, value) => {
    
    if (field==='show') dispatch(update_diag_property({ field:'legend_show', value }));
    if (field==='position') dispatch(update_diag_property({ field:'legend_pos', value }));
    
  };

  const handleTableChange = (field, value) => {
   // dispatch(updateTableProperty({ field, value }));
  };

  // ----- Helpers for rendering -----
  const renderSelect = (label, field, options, value, onChange) => (
    


    
    //return (
    
    <div style={styles.row}>
      <label style={{ ...styles.label, ...styles.labelSelect }}>
        {label}:
        <select
          style={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  const renderCheckbox = (label, checked, onChange) => (
    <div style={styles.row}>
      <label style={{ ...styles.label, ...styles.labelCheckbox }}>
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    </div>
  );

  const renderNumberInput = (label, value, onChange, autoLabel = 'авто', onAuto = null) => (
  <div style={styles.row}>
    <label style={{ ...styles.label, ...styles.labelInput }}>
      <span>{label}:</span>
      <input
        type="number"
        style={styles.inputNumber}
        value={value} // now a string, can be empty
        onChange={(e) => onChange(e.target.value)} // store raw string
      />
      {onAuto && (
        <button type="button" style={styles.autoButton} onClick={onAuto}>
          {autoLabel}
        </button>
      )}
    </label>
  </div>
);


  const renderTextInput = (label, value, onChange) => (
    <div style={styles.row}>
      <label style={{ ...styles.label, ...styles.labelInput }}>
        {label}:
        <input
          type="text"
          style={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );

  let diagram_list = useGetDiagramListQuery();

 
 let di = (!diagram_list.data)?[{ value: -1, label: 'не задана' }]:
                 diagram_list.data.filter(o=>o.pdiag_plot_no===se.plot_no).map(item=>{
                    

                  let tt = (item.pdiag_title)?item.pdiag_title:'_'
                   
                   tt+= (item.pdiag_objectname)?item.pdiag_objectname:'_'
                   
                   if (tt!=='__') tt=tt.replace(/_/g, '');
                    
                   return {value:item.pdiag_no, label:tt}      
                
                })
                
                di.unshift({ value: -1, label: 'не задана' })
                 
                 
  // ----- Render -----
  return (
    <div style={styles.container}>
      <div style={styles.title}>Свойства диаграммы</div>
      <div style={styles.body}>
        {/* Group: Диаграммы эпюры */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.diagram ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('diagram')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.diagram ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Диаграммы эпюры</strong>
            </span>
          </div>
          {openGroups.diagram && (
            <div style={styles.groupBody}>
              {renderSelect(
                'Диаграмма',
                'diagram_id',
                 di,
                 diag_info.diagram_id,
                 (val) => handleTopLevelChange('diagram_id', parseInt(val))
              )}
            </div>
          )}
        </div>

        {/* Group: Ось Х */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.axisX ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('axisX')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.axisX ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Ось Х</strong>
            </span>
          </div>
          {openGroups.axisX && (
            <div style={styles.groupBody}>
              {renderCheckbox(
                'Отображать ось',
                diag_info.axis_x_visible,
                (checked) => handleTopLevelChange('axis_x_visible', checked)
              )}
              {renderNumberInput(
                'Минимум',
                diag_info.axis_x_min,
                (val) =>  handleTopLevelChange('axis_x_min', val),
                'авто',
                () => handleTopLevelChange('axis_x_min', diag_info.auto_x_min), // example auto value
              )}
              {renderNumberInput(
                'Максимум',
                diag_info.axis_x_max,
                (val) => handleTopLevelChange('axis_x_max', val),
                'авто',
                () => handleTopLevelChange('axis_x_max', diag_info.auto_x_max)
              )}
              {renderNumberInput(
                'Цена деления',
                diag_info.axis_x_step,
                (val) => handleTopLevelChange('axis_x_step', val),
                'авто',
                () => handleTopLevelChange('axis_x_step', diag_info.auto_x_step)
              )}
              {renderNumberInput(
                'Отметка 1',
                diag_info.axis_x_mark1,
                (val) => handleTopLevelChange('axis_x_mark1', val),
              )}
              {renderNumberInput(
                'Отметка 2',
                diag_info.axis_x_mark2,
                (val) => handleTopLevelChange('axis_x_mark2', val),
              )}
            </div>
          )}
        </div>

        {/* Group: Ось Y */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.axisY ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('axisY')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.axisY ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Ось Y</strong>
            </span>
          </div>
          {openGroups.axisY && (
            <div style={styles.groupBody}>
              {renderCheckbox(
                'Отображать ось',
                diag_info.axis_y_visible,
                (checked) => handleTopLevelChange('axis_y_visible', checked)
              )}
              {renderNumberInput(
                'Минимум',
                diag_info.axis_y_min,
                (val) => handleTopLevelChange('axis_y_min', val),
                'авто',
                () => handleTopLevelChange('axis_y_min', diag_info.auto_y_min) // example auto value
              )}
              {renderNumberInput(
                'Максимум',
                diag_info.axis_y_max,
                (val) => handleTopLevelChange('axis_y_max', val),
                'авто',
                () => handleTopLevelChange('axis_y_max', diag_info.auto_y_max)
              )}
              {renderNumberInput(
                'Цена деления',
                diag_info.axis_y_step,
                (val) => handleTopLevelChange('axis_y_step', val),
                'авто',
                () => handleTopLevelChange('axis_y_step', diag_info.auto_y_step)
              )}
              {renderNumberInput(
                'Отметка 1',
                diag_info.axis_y_mark1,
                (val) => handleTopLevelChange('axis_y_mark1', val),
              )}
              {renderNumberInput(
                'Отметка 2',
                diag_info.axis_y_mark2,
                (val) => handleTopLevelChange('axis_y_mark2', val),
              )}
            </div>
          )}
        </div>

        {/* Group: Координатная сетка */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.grid ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('grid')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.grid ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Координатная сетка</strong>
            </span>
          </div>
          {openGroups.grid && (
            <div style={styles.groupBody}>
              {renderCheckbox(
                'Отображать Х',
                diag_info.grid_x_visible,
                (checked) => handleTopLevelChange('gridX', checked)
              )}
              {renderCheckbox(
                'Отображать Y',
                diag_info.grid_y_visible,
                (checked) => handleTopLevelChange('gridY', checked)
              )}
            </div>
          )}
        </div>

        {/* Group: Легенда */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.legend ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('legend')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.legend ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Легенда</strong>
            </span>
          </div>
          {openGroups.legend && (
            <div style={styles.groupBody}>
              {renderCheckbox(
                'Показывать',
                diag_info.legend.show,
                (checked) => handleLegendChange('show', checked)
              )}
              {renderSelect(
                'Позиция',
                'position',
                [
                  { value: 'right', label: 'справа' },
                  { value: 'left', label: 'слева' },
                  { value: 'top', label: 'сверху' },
                  { value: 'bottom', label: 'снизу' },
                ],
                diag_info.legend.pos,
                (val) => handleLegendChange('position', val)
              )}
            </div>
          )}
        </div>

        {/* Group: Таблица */}
        {/*<div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.table ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('table')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.table ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Таблица</strong>
            </span>
          </div>
          {openGroups.table && (
            <div style={styles.groupBody}>
              {renderCheckbox(
                'Показывать',
                state.table.show,
                (checked) => handleTableChange('show', checked)
              )}
              {renderTextInput(
                'Положение',
                state.table.position,
                (val) => handleTableChange('position', val)
              )}
              {renderTextInput(
                'Точность',
                state.table.precision,
                (val) => handleTableChange('precision', val)
              )}
            </div>
          )}
        </div>*/}

        
      </div>

      {/* Global styles for pseudo-classes and animations */}
      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .object-properties-select select:focus,
        input:focus {
          border-color: #4f7df3 !important;
          box-shadow: 0 0 0 3px rgba(79,125,243,0.15) !important;
        }
        .object-properties-select select:hover,
        input:hover {
          border-color: #a0aec0 !important;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

