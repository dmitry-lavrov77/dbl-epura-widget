import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {edit_sheet_tab, delete_sheet} from './sheetSlice'

import {close_menu} from './contextSlice'

export const ContextMenu = ({x, y, tpe, arg = null}) => {

  const dispatch = useDispatch()  

  const menuRef = useRef(null);

  const onClose = () =>{dispatch(close_menu())}


  let  items = [
   { label: 'Copy', action: ()=>{}, disabled: false },
   { label: 'Cut', action: ()=>{}, disabled: false },
   { label: 'Paste', action: ()=>{}, disabled: false },
   { label: 'Clear', action: ()=>{}, disabled: false },
   { label: 'Insert Row', action: ()=>{}, disabled: false },
   { label: 'Delete Row', action: ()=>{}, disabled: false },
   { label: 'Insert Column', action: ()=>{}, disabled: false },
   { label: 'Delete Column', action: ()=>{}, disabled: false },
  ];


  if (tpe==='multisel'){

   
   items = [
    { label: 'Объединить ячейки', action: ()=>{}, disabled: false },
  ];
  

  }

  if (tpe === 'sheet_tab') {

  items = [
   { label: 'Переименовать лист', action: ()=>{dispatch(edit_sheet_tab({sheet:arg.sheet, editing:true}))}, disabled: false },
   { label: 'Удалить лист', action: ()=>{dispatch(delete_sheet({sheet:arg.sheet}))}, disabled: false },
   ]


  } 

  useEffect(() => {
    const handleClickOutside = (e) => {
     
      if (menuRef.current && !menuRef.current.contains(e.target)) {
       
        onClose();
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ position: 'fixed', top: y, left: x, zIndex: 100000 }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
          onClick={() => {
            if (!item.disabled) item.action();
            onClose();
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};
