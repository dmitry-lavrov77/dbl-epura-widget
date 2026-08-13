import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faBorderNone} from '@fortawesome/free-solid-svg-icons';
import {select_object, get_diag_info, move_link, set_diag_data, toggle_lock, toggle_resize_mode,update_diag_position,update_diag_size} from './sheetSlice'
import { useDispatch, useSelector } from 'react-redux';
import {useRef, useEffect, useState} from 'react'
import {useGetEpuraDataQuery, useGetEpuraTableQuery, useGetPlotSetQuery, useGetDiagramListQuery, useGetPlotLineQuery} from './apiSlice'
import {load_data} from './data_manager'
import {niceScale, points_min_max, measureText} from './graph_math'
import useResizeObserver from './useResizeObserver'
import {Graph} from './Graph'


const LegendElement = ({color, linestyle, txt}) =>{


  const lstyle ={

        fontSize: '9pt',

        whiteSpace: 'nowrap',

        color: color,

        display: 'flex',

        paddingLeft: '5px',

        flexDirection: 'row',

   }   


   let sd = "";

   if (linestyle==='dash') sd ="5,5"
   if (linestyle==='dashdot') sd ="6,2,2"

   let sw = (linestyle==='marker')?'8':'1.5';

    return (

      <div style={lstyle}>

        <div style={{minWidth:'20px',maxWidth:'20px'}}>

         <svg viewBox='0 0 20 15' style={{width:'20px', height:'15px'}}>

               
             <line strokeDasharray={sd} strokeWidth={sw} stroke={color}
                   vectorEffect='non-scaling-stroke' 
                   strokeLinecap = {`${(linestyle==='marker')?'round':''}`} 
                   x1={`${(linestyle==='marker')?10:0}`} 
                   x2={`${(linestyle==='marker')?10:20}`} 
                   y1={`${(linestyle==='marker')?6:6}`} 
                   y2={`${(linestyle==='marker')?6.0001:6}`}
             ></line>



         </svg>



        </div>


        <div>{txt}</div> 




      </div>


    )




}

const Legend = ({position, legends, linestyles, colors}) =>{


    


   const legendStyle = {

    position:'absolute',
    overflow:'hidden',
    justifyContent:'center',
    top:'5px',
    bottom:'5px',
    right:'5px',
    display:'flex',
    flexFlow:'column wrap',
    // backgroundColor:'red'
   } 

   if (position==='left') {

     legendStyle.top = '5px';

     legendStyle.bottom = '5px';

     legendStyle.left = '5px';

     legendStyle.right = '';


     legendStyle.display='flex';

     legendStyle.flexFlow='column wrap';

   } else if (position==='top') {

        legendStyle.top = '5px';

          legendStyle.left = '5px';

          legendStyle.right = '5px';
          
          legendStyle.bottom = '';
        
        
          legendStyle.display='flex';

          legendStyle.flexFlow='row wrap';

   } else if (position==='bottom') {

       legendStyle.bottom = '5px';

          legendStyle.left = '5px';

          legendStyle.right = '5px';

          legendStyle.top = '';
          

          legendStyle.display='flex';

          legendStyle.flexFlow='row wrap';

   }



   return (


     <div style={legendStyle}>

        {legends.map((item, index)=>{

           if (item==='hidden') return null
           return <LegendElement key={item+'_'+index} color={colors[index]} linestyle={linestyles[index]} txt={item}></LegendElement>  




        })}


     </div>



   )




}

export const Diag = ({sheet, idx}) =>{

 const dispatch = useDispatch()   
  
 const diag_info = useSelector(state => get_diag_info(state, sheet, idx));

 //const shift = useSelector(state => state.sheet.selected_object);

 const selected_object = useSelector(state => state.sheet.selected_object);

 const layout_mode = useSelector(state=>state.layout.layout_mode);

 const is_selected = (selected_object&&(selected_object.tpe==='diag'||selected_object.tpe==='pic')&&selected_object.sheet===sheet&&selected_object.idx===idx)?true:false;

 const windowRef = useRef(null);

 const diagBody = useRef(null);

 const mainSVG = useRef(null)

 const plot_no= useSelector(state => state.layout.selected_epura).plot_no

 const dates = useSelector(state => state.layout.dates_selected)

 const plot_data = useGetEpuraDataQuery({plot_no:plot_no, dates:dates.toString()});

 const plot_table = useGetEpuraTableQuery({plot_no:plot_no, dates:dates.toString()});

 const plot_set = useGetPlotSetQuery();

 const diagram_list = useGetDiagramListQuery();
 
 const plot_line = useGetPlotLineQuery();




 useEffect(()=>{


    const load = async() =>{

       // let rr = plot_data.data.filter(item=>item.pdiag_no===diag_info.diagram_id) 
            
        let res = await load_data(plot_no,plot_data.data,plot_table.data,plot_line.data,diagram_list.data, plot_set.data, diag_info.diagram_id);

        console.log(diag_info.diagram_id,  res);

        
        if (diag_info.diagram_id==-1) dispatch(set_diag_data({sheet:sheet, idx:idx, data:null, table_data:null}))
       

        else {
         
          let iii = res.data.findIndex(o=>o.diag_no===parseFloat(diag_info.diagram_id));

          console.log('!!!!!!!!!!!!!!', iii)

          if (iii!==-1&&iii<res.data.length) {
         
            
            
            dispatch(set_diag_data({sheet:sheet, idx:idx, data:res.data[iii], table_data:(res.table_data[0])?res.table_data:null}))
        
          }
        
        }
    
        
       }

        
       
        
        
        //if (diag_info.table.show&&res.lists.length) 

        //dispatch(set_diag_lists({sheet:sheet, idx:idx, data:null, table_data:null}))



    //}


    if (dates&&dates.length&&plot_data.data&&plot_table.data&&plot_set.data&&diagram_list.data&&plot_line.data) {

         load()           
 
        
    } 
    else dispatch(set_diag_data({sheet:sheet, idx:idx, data:null, table_data:null, auto_values:null}))



 },[plot_no, sheet, idx, dates,plot_data,plot_table,plot_set,diagram_list,plot_line, diag_info.diagram_id, diag_info.table, load_data])
 
  const ref = useRef(null)

 
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
      windowRef.current.style.left = `${newLeft}px`;
      windowRef.current.style.top = `${newTop}px`;
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
    }
  };
  
   const startDrag = (e, type, ddx=0,ddy=0) => {
    e.preventDefault();
    e.stopPropagation();

    // Get current values from DOM (or fallback to store)
    const currentLeft = parseFloat(windowRef.current?.style.left) || diag_info.left;
    const currentTop  = parseFloat(windowRef.current?.style.top)  || diag_info.top;
    const currentWidth  = parseFloat(windowRef.current?.style.width)  || diag_info.width;
    const currentHeight = parseFloat(windowRef.current?.style.height) || diag_info.height;

    drag.current = {
      active: true,
      type,
      start_c_left:ref.current?parseFloat(ref.current.style.left):null,
      start_c_right:ref.current?parseFloat(ref.current.style.right):null,
      start_c_top:ref.current?parseFloat(ref.current.style.top):null,
      start_c_bottom:ref.current?parseFloat(ref.current.style.bottom):null,

      startX: e.clientX,
      startY: e.clientY,
      startLeft: currentLeft,
      startTop: currentTop,
      startWidth: currentWidth,
      startHeight: currentHeight,
      ddx:ddx,
      ddy:ddy
    };

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.body.style.userSelect = 'none';
  };

  // Move / resize logic (called on every mousemove)
  const onDragMove = (e) => {
  if (!drag.current.active) return;

  const dx = e.clientX - drag.current.startX;
  const dy = e.clientY - drag.current.startY;

  const { type, startLeft, startTop, startWidth, startHeight, start_c_left, start_c_right, start_c_top, start_c_bottom, ddx, ddy } = drag.current;
  
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

   
    newLeft = Math.max(-ddx, Math.min(newLeft, parentScrollWidth - newWidth));
    newTop = Math.max(-ddy, Math.min(newTop, parentScrollHeight - newHeight));
    updateDom(newLeft, newTop, newWidth, newHeight);
 
  }
  /*else if (type === 'tl') {
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
    updateDom(newLeft, newTop, newWidth, newHeight);
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
    updateDom(startLeft, newTop, newWidth, newHeight);
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
    updateDom(newLeft, startTop, newWidth, newHeight);
  }
  else if (type === 'br') {
    newWidth = startWidth + dx;
    newHeight = startHeight + dy;
    newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - startLeft));
    newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - startTop));
    updateDom(startLeft, startTop, newWidth, newHeight);
  }*/

  else if (type === 'left') {

    if (diag_info.resize_whole) {   
 

     if (diag_info.axis_x_mark1.trim()!==''&&!diag_info.axis_x_mark1_lock_opened)
     if (diag_info.axis_x_mark2.trim()!==''&&!diag_info.axis_x_mark2_lock_opened) return;  
 
    }

  newLeft = startLeft + dx;
  newWidth = startWidth - dx;
  if (newWidth < minWidth) {
    newLeft = startLeft + (startWidth - minWidth);
    newWidth = minWidth;
  }
  newLeft = Math.max(0, Math.min(newLeft, parentScrollWidth - minWidth));
  newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - newLeft));


  if (!diag_info.resize_whole) {

    if (start_c_left-dx<0) {
        
        ref.current.style.left =0; 


         updateDom(newLeft-dx+start_c_left, startTop, newWidth+dx-start_c_left, startHeight);
        
        return;

    }    
    updateDom(newLeft, startTop, newWidth, startHeight);

    ref.current.style.left = start_c_left-dx + 'px';
 

    return;


  }


  if (diag_info.axis_x_mark1.trim()!==''&&!diag_info.axis_x_mark1_lock_opened) {

     
     const svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint.x = parseFloat(diag_info.axis_x_mark1); 

     svgPoint.y = parseFloat(0); 

     const ctm = mainSVG.current.getScreenCTM();

     const clientPoint1 = svgPoint.matrixTransform(ctm);




     updateDom(newLeft, startTop, newWidth, startHeight);


     const svgPoint1 = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint1.x = parseFloat(diag_info.axis_x_mark1); 

     svgPoint1.y = parseFloat(0); 


     const ctm2 = mainSVG.current.getScreenCTM();

     const clientPoint2 = svgPoint.matrixTransform(ctm2);

     let delta = (clientPoint2.x-clientPoint1.x)


     //if (newLeft - delta<0) updateDom(0, startTop, newWidth-newLeft + delta, startHeight);
     //else 
        
        updateDom(newLeft - delta, startTop, newWidth, startHeight);



  } else if (diag_info.axis_x_mark2.trim()!==''&&!diag_info.axis_x_mark2_lock_opened) {

     const svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint.x = parseFloat(diag_info.axis_x_mark2); 

     svgPoint.y = parseFloat(0); 

     const ctm = mainSVG.current.getScreenCTM();

     const clientPoint1 = svgPoint.matrixTransform(ctm);


     

     updateDom(newLeft, startTop, newWidth, startHeight);


     const svgPoint1 = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint1.x = parseFloat(diag_info.axis_x_mark2); 

     svgPoint1.y = parseFloat(0); 


     const ctm2 = mainSVG.current.getScreenCTM();

     const clientPoint2 = svgPoint.matrixTransform(ctm2);

     let delta = (clientPoint2.x-clientPoint1.x)


     updateDom(newLeft - delta, startTop, newWidth, startHeight);


  } else 

  updateDom(newLeft, startTop, newWidth, startHeight);


}
else if (type === 'right') {
 

  if (diag_info.resize_whole) {   
   

    if (diag_info.axis_x_mark1.trim()!==''&&diag_info.axis_x_mark1.trim()!=='')
    if (!diag_info.axis_x_mark1_lock_opened&&!diag_info.axis_x_mark2_lock_opened) return;  
 }  
 
  newWidth = startWidth + dx;
 
  newWidth = Math.max(minWidth, Math.min(newWidth, parentScrollWidth - startLeft));



  if (!diag_info.resize_whole) {

    if (start_c_right+dx<0) {
        
        ref.current.style.right = 0; 


        updateDom(startLeft, startTop, newWidth-start_c_right-dx, startHeight);
        
        return;

    }    


    updateDom(startLeft, startTop, newWidth, startHeight);

    ref.current.style.right = start_c_right+dx + 'px';
 

    return;


  }
  
  
  
  if (diag_info.axis_x_mark1.trim()!==''&&!diag_info.axis_x_mark1_lock_opened) {

     
     const svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint.x = parseFloat(diag_info.axis_x_mark1); 

     svgPoint.y = parseFloat(0); 

     const ctm = mainSVG.current.getScreenCTM();

     const clientPoint1 = svgPoint.matrixTransform(ctm);




     updateDom(startLeft, startTop, newWidth, startHeight);


     const svgPoint1 = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint1.x = parseFloat(diag_info.axis_x_mark1); 

     svgPoint1.y = parseFloat(0); 


     const ctm2 = mainSVG.current.getScreenCTM();

     const clientPoint2 = svgPoint.matrixTransform(ctm2);

     let delta = (clientPoint2.x-clientPoint1.x)


     updateDom(startLeft - delta, startTop, newWidth, startHeight);



  } else if (diag_info.axis_x_mark2.trim()!==''&&!diag_info.axis_x_mark2_lock_opened) {

const svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint.x = parseFloat(diag_info.axis_x_mark2); 

     svgPoint.y = parseFloat(0); 

     const ctm = mainSVG.current.getScreenCTM();

     const clientPoint1 = svgPoint.matrixTransform(ctm);




     updateDom(startLeft, startTop, newWidth, startHeight);


     const svgPoint1 = mainSVG.current.createSVGPoint(); // For SVGPoint
              
     svgPoint1.x = parseFloat(diag_info.axis_x_mark2); 

     svgPoint1.y = parseFloat(0); 


     const ctm2 = mainSVG.current.getScreenCTM();

     const clientPoint2 = svgPoint.matrixTransform(ctm2);

     let delta = (clientPoint2.x-clientPoint1.x)


     updateDom(startLeft - delta, startTop, newWidth, startHeight);


  }
 
  else updateDom(startLeft, startTop, newWidth, startHeight);
}
else if (type === 'top') {

 if (diag_info.resize_whole) {   
    

   if (diag_info.axis_y_mark1.trim()!==''&&!diag_info.axis_y_mark1_lock_opened)
   if (diag_info.axis_y_mark2.trim()!==''&&!diag_info.axis_y_mark2_lock_opened) return;  
   
 } 
  newTop = startTop + dy;
  newHeight = startHeight - dy;
  if (newHeight < minHeight) {
    newTop = startTop + (startHeight - minHeight);
    newHeight = minHeight;
  }
  newTop = Math.max(0, Math.min(newTop, parentScrollHeight - minHeight));
  newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - newTop));



   if (!diag_info.resize_whole) {

    if (start_c_top-dy<0) {
        
        ref.current.style.top = 0; 

        updateDom(startLeft, newTop+start_c_top-dy, startWidth, newHeight-start_c_top+dy);
        
        return;

    }    


    updateDom(startLeft, newTop, startWidth, newHeight);

    ref.current.style.top = start_c_top-dy + 'px';
 

    return;


  }




  if (diag_info.axis_y_mark1.trim()!==''&&!diag_info.axis_y_mark1_lock_opened) {


    let svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark1); 

    svgPoint.x = parseFloat(0); 

    let ctm = mainSVG.current.getScreenCTM();

    let clientPoint1 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, newTop, startWidth, newHeight);

    svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark1); 

    svgPoint.x = parseFloat(0); 

    ctm = mainSVG.current.getScreenCTM();

    let clientPoint2 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, newTop+clientPoint1.y-clientPoint2.y, startWidth, newHeight);




 
  } else if (diag_info.axis_y_mark2.trim()!==''&&!diag_info.axis_y_mark2_lock_opened) {


    let svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark2); 

    svgPoint.x = parseFloat(0); 

    let ctm = mainSVG.current.getScreenCTM();

    let clientPoint1 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, newTop, startWidth, newHeight);

    svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark2); 

    svgPoint.x = parseFloat(0); 

    ctm = mainSVG.current.getScreenCTM();

    let clientPoint2 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, newTop+clientPoint1.y-clientPoint2.y, startWidth, newHeight);




 
  }  
  




  else updateDom(startLeft, newTop, startWidth, newHeight);
}
else if (type === 'bottom') {

 if (diag_info.resize_whole) {   
 
  if (diag_info.axis_y_mark1.trim()!==''&&!diag_info.axis_y_mark1_lock_opened)
  if (diag_info.axis_y_mark2.trim()!==''&&!diag_info.axis_y_mark2_lock_opened) return;  

 }
 
  newHeight = startHeight + dy;
  newHeight = Math.max(minHeight, Math.min(newHeight, parentScrollHeight - startTop));


   if (!diag_info.resize_whole) {

    if (start_c_bottom+dy<0) {
        
        ref.current.style.bottom = 0; 

        updateDom(startLeft, startTop, startWidth, newHeight-start_c_bottom-dy);
        
        return;

    }    

    updateDom(startLeft, startTop, startWidth, newHeight);

    ref.current.style.bottom = start_c_bottom+dy + 'px';
 
    return;

  }


   if (diag_info.axis_y_mark1.trim()!==''&&!diag_info.axis_y_mark1_lock_opened) {


    let svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark1); 

    svgPoint.x = parseFloat(0); 

    let ctm = mainSVG.current.getScreenCTM();

    let clientPoint1 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, startTop, startWidth, newHeight);

    svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark1); 

    svgPoint.x = parseFloat(0); 

    ctm = mainSVG.current.getScreenCTM();

    let clientPoint2 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, startTop+clientPoint1.y-clientPoint2.y, startWidth, newHeight);

 
  } else if (diag_info.axis_y_mark2.trim()!==''&&!diag_info.axis_y_mark2_lock_opened) {


    let svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark2); 

    svgPoint.x = parseFloat(0); 

    let ctm = mainSVG.current.getScreenCTM();

    let clientPoint1 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, startTop, startWidth, newHeight);

    svgPoint = mainSVG.current.createSVGPoint(); // For SVGPoint
              
    svgPoint.y = parseFloat(diag_info.axis_y_mark2); 

    svgPoint.x = parseFloat(0); 

    ctm = mainSVG.current.getScreenCTM();

    let clientPoint2 = svgPoint.matrixTransform(ctm);

    updateDom(startLeft, startTop+clientPoint1.y-clientPoint2.y, startWidth, newHeight);

   // updateDom(startLeft, newTop+clientPoint1.y-clientPoint2.y, startWidth, newHeight);




 
  }  
  




  else
  updateDom(startLeft, startTop, startWidth, newHeight);
}

};
 
  const onDragEnd = () => {
    if (!drag.current.active) return;
    drag.current.active = false;

   
    const finalLeft = parseFloat(windowRef.current?.style.left);
    const finalTop = parseFloat(windowRef.current?.style.top);
    const finalWidth = parseFloat(windowRef.current?.style.width);
    const finalHeight = parseFloat(windowRef.current?.style.height);
    
    
    const finalCLeft = ref.current?parseFloat(ref.current.style.left):'none';
    const finalCRight = ref.current?parseFloat(ref.current.style.right):'none';
    const finalCTop = ref.current?parseFloat(ref.current.style.top):'none';
    const finalCBottom = ref.current?parseFloat(ref.current.style.bottom):'none';
   
    if (drag.current.type !== 'move') {
     dispatch(update_diag_size({ sheet, idx,  width: finalWidth, height: finalHeight,cleft:finalCLeft, cright:finalCRight, ctop:finalCTop, cbottom:finalCBottom}));
    }
    dispatch(update_diag_position({ sheet, idx,  left: finalLeft, top: finalTop  }));

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
  useEffect(() => {
    updateDom(diag_info.left, diag_info.top, diag_info.width, diag_info.height);
  }, [diag_info.left, diag_info.top, diag_info.width, diag_info.height]);


  useEffect(()=>{


    if (!dates.length) dispatch(toggle_resize_mode({sheet:diag_info.sheet,idx:diag_info.idx, resize_whole:true }))


  }, [dates,diag_info.sheet,diag_info.idx])

 // Inline styles (dynamic left/top/width/height are set via ref)
  const outerStyle = {
    position: 'absolute',
    zIndex: 1100,
    backgroundColor: 'transparent',
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
    //cursor: 'nesw-resize',
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
    //cursor: 'nwse-resize',
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
 // cursor: 'nwse-resize',
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
  //cursor: 'nesw-resize',
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

  const leftEdgeResizeStyle = {
  position: 'absolute',
  width: '10px',
  height: 'calc(100% - 32px)', // avoid overlapping corners
  left: 0,
  top: '16px',
  backgroundColor: 'transparent',
  cursor: 'ew-resize',
  zIndex: 1102,
  pointerEvents: 'auto',
};

const rightEdgeResizeStyle = {
  position: 'absolute',
  width: '10px',
  height: 'calc(100% - 32px)',
  right: 0,
  top: '16px',
  backgroundColor: 'transparent',
  cursor: 'ew-resize',
  zIndex: 1102,
  pointerEvents: 'auto',
};

const topEdgeResizeStyle = {
  position: 'absolute',
  height: '10px',
  width: 'calc(100% - 32px)',
  top: 0,
  left: '16px',
  backgroundColor: 'transparent',
  cursor: 'ns-resize',
  zIndex: 1202,
  pointerEvents: 'auto',
};

const bottomEdgeResizeStyle = {
  position: 'absolute',
  height: '10px',
  width: 'calc(100% - 32px)',
  bottom: 0,
  left: '16px',
  backgroundColor: 'transparent',
  cursor: 'ns-resize',
  zIndex: 1102,
  pointerEvents: 'auto',
};

    const rr = useSelector(state=>state.sheet)


    const mlink = useSelector(state=>state.sheet.mlink);

    useEffect(()=>{

      if (mlink.sheet===sheet&&mlink.idx===idx) {


       startDrag(mlink.e, mlink.type, mlink.ddx,mlink.ddy);

       dispatch(move_link({sheet:-1, idx:-1, e:null, type:null}))



      }




    },[mlink,sheet,idx])


   

    return (

    <div className={is_selected&&layout_mode==='edit'?'active-animation':''} ref={windowRef} style={outerStyle} onClick={()=>{if (!is_selected) dispatch(select_object({tpe:'diag', sheet:sheet, idx:idx}))}}>
      {(layout_mode==='edit')&&<div style={topLeftResizeStyle} onMouseDown={(e) => startDrag(e, 'tl')} />}
      {(layout_mode==='edit')&&<div style={topRightResizeStyle} onMouseDown={(e) => startDrag(e, 'tr')} />}
      {(layout_mode==='edit')&&<div style={bottomLeftResizeStyle} onMouseDown={(e) => startDrag(e, 'bl')} />}
      {(layout_mode==='edit')&&<div style={bottomRightResizeStyle} onMouseDown={(e) => startDrag(e, 'br')} />}
      {(layout_mode==='edit')&&<div style={leftEdgeResizeStyle} onMouseDown={(e) => startDrag(e, 'left')} />}
      {(layout_mode==='edit')&&<div style={rightEdgeResizeStyle} onMouseDown={(e) => startDrag(e, 'right')} />} 
      {(layout_mode==='edit')&&<div style={topEdgeResizeStyle} onMouseDown={(e) => startDrag(e, 'top')} />}
      {(layout_mode==='edit')&&<div style={bottomEdgeResizeStyle} onMouseDown={(e) => startDrag(e, 'bottom')} />}   

      {(layout_mode==='edit')&&<div  style={windowHeadStyle}  onMouseDown={(e) => startDrag(e, 'move')}>
       
        <div style={topBorderStyle} />
        <div style={topLeftResizeStyle} />
        <div style={topRightResizeStyle} />

        {dates.length?<div  style={toolbarStyle}>
          
          
          <div
           
            onClick={()=>dispatch(toggle_resize_mode({sheet:diag_info.sheet,idx:diag_info.idx, resize_whole:false }))}

           
            title="Изменять размер полей диаграммы"
            
            style={{...uploaderStyle, cursor:'pointer', color:`${diag_info.resize_whole?'black':'red'}`}}
          > <FontAwesomeIcon icon={faBorderAll} /></div>

          <div
            
            onClick={()=>dispatch(toggle_resize_mode({sheet:diag_info.sheet,idx:diag_info.idx, resize_whole:true }))}
            
            title="Изменять размер диаграммы в целом"
            
            style={{...uploaderStyle, cursor:'pointer', color:`${diag_info.resize_whole?'red':'black'}`}}
          > <FontAwesomeIcon icon={faBorderNone} /></div>

        </div>:<></>}
        



      </div>}
      <div ref={diagBody} style={{backgroundColor: 'transparent',  position: 'absolute', top:'21px', left:'4px', right:'4px', bottom:'4px'}}>

         {diag_info.legend.show&&diag_info.data&&<Legend position={diag_info.legend.pos} legends={diag_info.data.legends} colors={diag_info.data.colors} linestyles={diag_info.data.linestyles}></Legend>}  
         {(diag_info.data)?

            <div  ref={ref} style={{position: 'absolute', left:`${diag_info.cleft+'px'}`, right:`${diag_info.cright+'px'}`, top:`${diag_info.ctop+'px'}`, bottom:`${diag_info.cbottom+'px'}`, border: `${(layout_mode==='edit')?'1px solid gray':'none'}`,
            display: 'flex', flexDirection: 'row'}}>

           
           <Graph sheet={sheet} idx={idx} data={diag_info.data} mainSVG={mainSVG} ref={ref}></Graph>
           
           </div>
           :null}

       

      </div>
    </div>


    )



}
