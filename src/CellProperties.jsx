import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { updateCellProperty } from '../store/cellPropertiesSlice';
import { get_selected_cell, update_cell_property } from './sheetSlice';

// ----- Styles (all inline, as object) -----
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
  labelInput: {
    justifyContent: 'flex-start',
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
  colorInput: {
    width: 40,
    height: 40,
    padding: 2,
    border: '2px solid #d0d7de',
    borderRadius: 8,
    background: '#ffffff',
    cursor: 'pointer',
    flexShrink: 0,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  hiddenSpan: {
    display: 'none',
  },
};

// ----- SVG Icon -----
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
export const CellProperties = () => {


  const active_sheet = useSelector(state=>state.sheet.selected_sheet) 
  
  const form0 = useSelector(state=>get_selected_cell(state, active_sheet)) 

  const form = {

    fontFamily: form0.font.font_name,
    fontSize: form0.font.font_size,
    fontWeight: form0.font.font_style,
    fontColor: form0.font_color,
    verticalAlign: form0.cell_vert,
    horizontalAlign: form0.cell_horz,
    bgColor: form0.bcolor,
    border: form0.extra_border,





  };




  const dispatch = useDispatch();

  // 2. Local state for accordion open/close
  const [openGroups, setOpenGroups] = useState({
    font: true,
    align: false,
    cell: false,
  });

  // 3. Handlers
  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field, value) => {
    dispatch(update_cell_property({sheet:form0.sheet, x:form0.x, y:form0.y, field:field, value:value }));
  };

  // 4. Helpers
  const renderSelect = (label, field, options) => (
    <div style={styles.row}>
      <label style={{ ...styles.label, ...styles.labelSelect }}>
        {label}:
        <select
          style={styles.select}
          value={form[field] || ''}
          onChange={(e) => handleChange(field, e.target.value)}
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

  const renderColorInput = (label, field) => (
    <div style={styles.row}>
      <label style={{ ...styles.label, ...styles.labelInput }}>
        {label}:
        <input
          type="color"
          style={styles.colorInput}
          value={form[field] || '#000000'}
          onChange={(e) => handleChange(field, e.target.value)}
        />
        <span style={styles.hiddenSpan}>undefined</span>
      </label>
    </div>
  );

  // 5. Render
  return (
    <div style={styles.container}>
      <div style={styles.title}>Свойства ячейки</div>
      <div style={styles.body}>
        {/* Group: Шрифт */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.font ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('font')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.font ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Шрифт</strong>
            </span>
          </div>
          {openGroups.font && (
            <div style={styles.groupBody}>
              {renderSelect('Название', 'fontFamily', [
                { value: 'Arial', label: 'Arial' },
                { value: 'Calibri', label: 'Calibri' },
                { value: 'Verdana', label: 'Verdana' },
                { value: 'Tahoma', label: 'Tahoma' },
                { value: 'Trebuchet MS', label: 'Trebuchet MS' },
                { value: 'Times New Roman', label: 'Times New Roman' },
                { value: 'Georgia', label: 'Georgia' },
                { value: 'Garamond', label: 'Garamond' },
                { value: 'Courier New', label: 'Courier New' },
              ])}
              {renderSelect('Размер', 'fontSize', [
                { value: '11', label: '11' },
                { value: '12', label: '12' },
                { value: '14', label: '14' },
                { value: '16', label: '16' },
                { value: '18', label: '18' },
                { value: '20', label: '20' },
                { value: '22', label: '22' },
                { value: '24', label: '24' },
                { value: '28', label: '28' },
                { value: '36', label: '36' },
                { value: '48', label: '48' },
              ])}
              {renderSelect('Начертание', 'fontWeight', [
                { value: 'plain', label: 'обычный' },
                { value: 'italic', label: 'курсив' },
                { value: 'bold', label: 'полужирный' },
                { value: 'bolditalic', label: 'полужирный курсив' },
              ])}
              {renderColorInput('Цвет', 'fontColor')}
            </div>
          )}
        </div>

        {/* Group: Выравнивание */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.align ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('align')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.align ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Выравнивание</strong>
            </span>
          </div>
          {openGroups.align && (
            <div style={styles.groupBody}>
              {renderSelect('Вертикальное', 'verticalAlign', [
                { value: 'top', label: 'по верхнему краю' },
                { value: 'center', label: 'по центру' },
                { value: 'bottom', label: 'по нижнему краю' },
              ])}
              {renderSelect('Горизонтальное', 'horizontalAlign', [
                { value: 'left', label: 'по левому краю' },
                { value: 'center', label: 'по центру' },
                { value: 'right', label: 'по правому краю' },
              ])}
            </div>
          )}
        </div>

        {/* Group: Ячейка */}
        <div style={styles.group}>
          <div
            style={{
              ...styles.groupTitle,
              ...(openGroups.cell ? { background: '#f6f8fa' } : {}),
            }}
            onClick={() => toggleGroup('cell')}
          >
            <span
              style={{
                ...styles.groupTitleIcon,
                ...(openGroups.cell ? styles.groupTitleIconOpen : {}),
              }}
            >
              <AngleRightIcon />
            </span>
            <span style={styles.groupTitleText}>
              <strong>Ячейка</strong>
            </span>
          </div>
          {openGroups.cell && (
            <div style={styles.groupBody}>
              {renderColorInput('Фон', 'bgColor')}
              {renderSelect('Граница', 'border', [
                { value: false, label: 'нет' },
                { value: true, label: 'есть' },
              ])}
            </div>
          )}
        </div>
      </div>

      {/* Global styles for pseudo‑classes & animations */}
      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .object-properties-select select:focus {
          border-color: #4f7df3 !important;
          box-shadow: 0 0 0 3px rgba(79,125,243,0.15) !important;
        }
        .object-properties-select select:hover {
          border-color: #a0aec0 !important;
        }
        input[type="color"]:focus {
          border-color: #4f7df3 !important;
          box-shadow: 0 0 0 3px rgba(79,125,243,0.15) !important;
        }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
        input[type="color"]::-webkit-color-swatch { border-radius: 5px; border: none; }
        input[type="color"]::-moz-color-swatch { border-radius: 5px; border: none; }
      `}</style>
    </div>
  );
};
