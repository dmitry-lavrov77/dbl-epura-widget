import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import {select_object, get_pic_info, move_link, update_pic_size, update_pic_position} from './sheetSlice'
import { useDispatch, useSelector } from 'react-redux';
import {useRef, useEffect} from 'react'


export const Pic = ({sheet, idx}) =>{
  
const pic_info = useSelector(state => get_pic_info(state, sheet, idx));


const layout_mode = useSelector(state => state.layout.layout_mode);

 const selected_object = useSelector(state => state.sheet.selected_object);


 const is_selected = (selected_object&&(selected_object.tpe==='diag'||selected_object.tpe==='pic')&&selected_object.sheet===sheet&&selected_object.idx===idx)?true:false;

  

 const windowRef = useRef(null);

 const picBody = useRef(null);

 const svg = useRef(null);

const dispatch = useDispatch();

 useEffect(()=>{


    if (picBody.current) {

      if (pic_info.lfle===null) picBody.current.innerHTML='';
      else {
      
        picBody.current.innerHTML=pic_info.lfle
    
        svg.current = picBody.current.firstElementChild;

        if (svg.current) {

        svg.current.setAttribute('width','100%');
    
        svg.current.setAttribute('height', '100%');

        svg.current.setAttribute('preserveAspectRatio', 'none');

        }
    
      }




    }


 }, [pic_info])

 
  const drag = useRef({
    active: false,
    type: null,        // 'move', 'tl', 'tr', 'bl', 'br'
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startWidth: 0,
    startHeight: 0,
  });

  // Helpers
  const minWidth = 100;
  const minHeight = 100;
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  // Direct DOM update (no Redux during drag)
  const updateDom = (newLeft, newTop, newWidth, newHeight) => {
    if (windowRef.current) {
      windowRef.current.style.left = `${newLeft*cscale}px`;
      windowRef.current.style.top = `${newTop*cscale}px`;
      windowRef.current.style.width = `${newWidth*cscale}px`;
      windowRef.current.style.height = `${newHeight*cscale}px`;
    }
  };
  
   const startDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (type==='move') dispatch(move_link({sheet:sheet,idx:idx,e:e,type:type}))

    const currentLeft = parseFloat(windowRef.current?.style.left) || cscale*pic_info.left;
    const currentTop  = parseFloat(windowRef.current?.style.top)  || cscale*pic_info.top;
    const currentWidth  = parseFloat(windowRef.current?.style.width)  || cscale*pic_info.width;
    const currentHeight = parseFloat(windowRef.current?.style.height) || cscale*pic_info.height;

    drag.current = {
      active: true,
      type,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: currentLeft,
      startTop: currentTop,
      startWidth: currentWidth,
      startHeight: currentHeight,
    };

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.body.style.userSelect = 'none';
  };

 
  const onDragMove = (e) => {
  if (!drag.current.active) return;

  const dx = e.clientX - drag.current.startX;
  const dy = e.clientY - drag.current.startY;
  const { type, startLeft, startTop, startWidth, startHeight } = drag.current;
  
  // Get parent scrollable dimensions
  const parent = windowRef.current.parentNode;
  const parentScrollWidth = parent.scrollWidth;
  const parentScrollHeight = parent.scrollHeight;

  let newLeft = startLeft;
  let newTop = startTop;
  let newWidth = startWidth;
  let newHeight = startHeight;

  if (type === 'move') {
    newLeft = startLeft + dx;
    newTop = startTop + dy;
    // Constrain to parent scrollable area (allow scroll)
    newLeft = Math.max(0, Math.min(newLeft, parentScrollWidth - newWidth));
    newTop = Math.max(0, Math.min(newTop, parentScrollHeight - newHeight));
    updateDom(newLeft/cscale, newTop/cscale, newWidth/cscale, newHeight/cscale);
  }
  else if (type === 'tl') {
    newLeft = startLeft + dx;
    newTop = startTop + dy;
    newWidth = startWidth - dx;
    newHeight = startHeight - dy;
    // Clamp to minimum size and parent bounds
    if (newWidth < minWidth) {
      newLeft = startLeft + (startWidth - minWidth);
      newWidth = minWidth;
    }
    if (newHeight < minHeight) {
      newTop = startTop + (startHeight - minHeight);
      newHeight = minHeight;
    }
    newLeft = Math.max(0, Math.min(newLeft, parentScrollWidth - minWidth));
    newTop = Math.max(0, Math.min(newTop, parentScrollHeight - minHeight));
    newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - newLeft));
    newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - newTop));
    updateDom(newLeft/cscale, newTop/cscale, newWidth/cscale, newHeight/cscale);
  }
  else if (type === 'tr') {
    newTop = startTop + dy;
    newWidth = startWidth + dx;
    newHeight = startHeight - dy;
    if (newHeight < minHeight) {
      newTop = startTop + (startHeight - minHeight);
      newHeight = minHeight;
    }
    newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - startLeft));
    newTop = Math.max(0, Math.min(newTop, parentScrollHeight - minHeight));
    newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - newTop));
    updateDom(startLeft/cscale, newTop/cscale, newWidth/cscale, newHeight/cscale);
  }
  else if (type === 'bl') {
    newLeft = startLeft + dx;
    newWidth = startWidth - dx;
    newHeight = startHeight + dy;
    if (newWidth < minWidth) {
      newLeft = startLeft + (startWidth - minWidth);
      newWidth = minWidth;
    }
    newLeft = Math.max(0, Math.min(newLeft, parentScrollWidth - minWidth));
    newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - newLeft));
    newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - startTop));
    updateDom(newLeft/cscale, startTop/cscale, newWidth/cscale, newHeight/cscale);
  }
  else if (type === 'br') {
    newWidth = startWidth + dx;
    newHeight = startHeight + dy;
    newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - startLeft));
    newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - startTop));
    updateDom(startLeft/cscale, startTop/cscale, newWidth/cscale, newHeight/cscale);
  }
};



  // Finish dragging – dispatch final values to Redux store
  const onDragEnd = () => {
    if (!drag.current.active) return;
    drag.current.active = false;

    // Read final values from DOM
    const finalLeft = parseFloat(windowRef.current?.style.left);
    const finalTop = parseFloat(windowRef.current?.style.top);
    const finalWidth = parseFloat(windowRef.current?.style.width);
    const finalHeight = parseFloat(windowRef.current?.style.height);

    // Dispatch to store (only after drag ends)


        //dispatch(update_diag_size({ sheet, idx,  width: finalWidth, height: finalHeight,cleft:finalCLeft, cright:finalCRight, ctop:finalCTop, cbottom:finalCBottom}));
        //}
        //dispatch(update_diag_position({ sheet, idx,  left: finalLeft, top: finalTop  }));
    


    if (drag.current.type !== 'move') {
     dispatch(update_pic_size({ sheet, idx, width: finalWidth/cscale, height: finalHeight/cscale  }));
    }
    dispatch(update_pic_position({ sheet, idx,  left: finalLeft/cscale, top: finalTop/cscale }));

    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.body.style.userSelect = '';
  };

  // Cleanup global listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
    };
  }, []);

  // Sync DOM when store values change (initial render + external updates)
  const cscale = useSelector(state=>state.layout.cscale);
  useEffect(() => {
    updateDom(pic_info.left, pic_info.top, pic_info.width, pic_info.height);
  }, [pic_info.left, pic_info.top, pic_info.width, pic_info.height]);




 // Inline styles (dynamic left/top/width/height are set via ref)
  const outerStyle = {
    position: 'absolute',
    zIndex: 1100,
    backgroundColor: 'white',
    minWidth: `${minWidth}px`,
    minHeight: `${minHeight}px`,
    border: (layout_mode==='edit')?'1px solid gray':'none'
  };


  const bottomLeftResizeStyle = {
    position: 'absolute',
    height: '10px',
    width: '10px',
    bottom: 0,
    left: 0,
    //borderLeft: '1px solid gray',
    //borderBottom: '1px solid gray',
    backgroundColor: 'transparent',
    cursor: 'nesw-resize',
    zIndex: 1101,
  };

  const bottomRightResizeStyle = {
    position: 'absolute',
    height: '10px',
    width: '10px',
    bottom: 0,
    right: 0,
    //borderRight: '1px solid gray',
    //borderBottom: '1px solid gray',
    backgroundColor: 'transparent',
    cursor: 'nwse-resize',
    zIndex: 1101,
  };

  const windowHeadStyle = {
  position: 'absolute',
  height: '20px',
  left: '0px',      // leave space for left resize handle
  right: '0px',     // leave space for right resize handle
  top: 0,
  backgroundColor: 'rgba(211, 227, 253, 0.6)',
  //borderLeft: '1px solid gray',
  //borderRight: '1px solid gray',
  cursor: 'move',
  zIndex: 1102,
};

  const topBorderStyle = {
    position: 'absolute',
    height: '3px',
    right: '3px',
    left: '3px',
    top: 0,
   // borderTop: '1px solid gray',
   // backgroundColor: 'transparent',
  };

 const topLeftResizeStyle = {
  position: 'absolute',
  height: '16px',        // larger clickable area
  width: '16px',
  top: 0,
  left: 0,
 // borderTop: '1px solid gray',     // keeps the visual border
 // borderLeft: '1px solid gray',
  backgroundColor: 'transparent',
  cursor: 'nwse-resize',
  zIndex: 1103,                     // higher than header (102)
  pointerEvents: 'auto',
};

// Same for top-right
const topRightResizeStyle = {
  position: 'absolute',
  height: '16px',
  width: '16px',
  top: 0,
  right: 0,
 // borderTop: '1px solid gray',
 // borderRight: '1px solid gray',
  backgroundColor: 'transparent',
  cursor: 'nesw-resize',
  zIndex: 1103,
  pointerEvents: 'auto',
};


  const toolbarStyle = {
    position: 'absolute',
    right: '3px',
    top: '2px',
    display: 'flex',
    flexDirection: 'row',
  };

  const uploaderStyle = {
    cursor: 'pointer',
    paddingRight: '5px',
  };

    return (

    <div className={is_selected&&layout_mode==='edit'?'active-animation':''} ref={windowRef} style={outerStyle} onClick={()=>{if (!is_selected) dispatch(select_object({tpe:'pic', sheet:sheet, idx:idx}))}}>
      {(layout_mode==='edit')&&<div style={topLeftResizeStyle} onMouseDown={(e) => startDrag(e, 'tl')} />}
      {(layout_mode==='edit')&&<div style={topRightResizeStyle} onMouseDown={(e) => startDrag(e, 'tr')} />}
      {(layout_mode==='edit')&&<div style={bottomLeftResizeStyle} onMouseDown={(e) => startDrag(e, 'bl')} />}
      {(layout_mode==='edit')&&<div style={bottomRightResizeStyle} onMouseDown={(e) => startDrag(e, 'br')} />}

      {(layout_mode==='edit')&&<div  style={windowHeadStyle}  onMouseDown={(e) => startDrag(e, 'move')}>
        <div style={topBorderStyle} />
        <div style={topLeftResizeStyle} />
        <div style={topRightResizeStyle} />

        <div  style={toolbarStyle}>
          <div
            title="Загрузить подложку"
            
            style={uploaderStyle}
          > <FontAwesomeIcon icon={faUpload} /></div>
        </div>
        
      </div>}
      <div ref={picBody} style={{backgroundColor: 'white',  position: 'absolute', top:'21px', left:'4px', right:'4px', bottom:'4px'}}>

      </div>
    </div>


    )



}
