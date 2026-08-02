import { useDispatch, useSelector, useStore } from 'react-redux';
import {add_sheet, select_sheet, delete_sheet, rename_sheet, edit_sheet_tab} from './sheetSlice'
import {set_layout_mode} from './layoutSlice'
import {useState, useEffect, useRef} from 'react'
import {show_menu} from './contextSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faBinoculars, faFileExcel} from '@fortawesome/free-solid-svg-icons';
import {get_cells_keys, get_columns_keys, get_rows_keys} from './consts'
import {useSaveEpuraMutation} from './apiSlice'
import { ExcelMaker } from './excel-maker';
import { TOTAL_COLS } from './consts';
import { getColumnIndex,isNumeric } from './formula';
//import {} from 



const SheetTab = ({ sheetId}) => {

  const layout_mode =  useSelector(state=>state.layout.layout_mode)
   
  
 const dispatch = useDispatch();  

  const inputRef = useRef(null);

  const active_sheet = useSelector(state=>state.sheet.selected_sheet);
 
  const isActive = (active_sheet === sheetId);

  
 
  const sheets = useSelector(state=>state.sheet.sheets);

  const the_sheet = sheets.find(o=>o.sheet === sheetId)
 
  const isEditing = the_sheet.edited;

  const [editValue, setEditValue] = useState(the_sheet.title);








  const onActivate = () =>{ dispatch(select_sheet({sheet:sheetId})) }

  

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);


   useEffect(() => {
    if (!isEditing) return;
    const handleClickOutside = (e) => {
    
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        if (editValue.trim()) dispatch(rename_sheet({sheet:sheetId, title:editValue.trim()}))
        //setIsEditing(false);
        dispatch(edit_sheet_tab({sheet:sheetId,editing:false}))
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, editValue, sheetId]);

 
 const handleDoubleClick = () =>{if (layout_mode==='edit') dispatch(edit_sheet_tab({sheet:sheetId,editing:true}))}
 //???????????? const handleDoubleClick = () => setIsEditing(true);

 
 
 
  const handleBlur = () => {
    if (editValue.trim()) dispatch(rename_sheet({sheet:sheetId, title:editValue.trim()}))
    dispatch(edit_sheet_tab({sheet:sheetId,editing:false})) 
   //setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(the_sheet.title);
      dispatch(edit_sheet_tab({sheet:sheetId,editing:false}))
   //??????????????????setIsEditing(false);
    }
  };

  return (
    <div
      className={`sheet-tab ${isActive ? 'active' : ''}`}
      onClick={onActivate}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e)=>{e.preventDefault(); e.stopPropagation(); if (layout_mode==='edit') dispatch(show_menu({x:e.clientX,y:e.clientY-80, tpe:'sheet_tab', arg:{sheet:sheetId}}))}}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="sheet-tab-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <span>{the_sheet.title}</span>
        </>
      )}
    </div>
  );
};



  function loadImage(width, height, url) {
  return new Promise((resolve, reject) => {
     const image = new Image();
    image.onload = () => {
      
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        image.width = width;
        image.height = height;
        

        canvas.width = image.width;
        canvas.height = image.height;

  


        if (canvas.width === 0 || canvas.height === 0) {
            console.error("SVG width or height is 0. Cannot draw to canvas.");
            return;
        }

        context.drawImage(image, 0, 0, width, height);

        const pngDataUrl = canvas.toDataURL('image/png');

        contents = pngDataUrl//'<svg viewBox="0 0 '+width+' '+height+'"><image  href="'+pngDataUrl+'"></image></svg>'

    

       resolve(image)
    };
    image.onerror = (error) => {
        console.error("Error loading SVG onto Image element:", error);
    };

    image.src = url;
});
}



export const StatusBar = () => {


   
   const store = useStore()  

   const  [save_to_serv, { isLoading: isUpdating } ]  = useSaveEpuraMutation();

   const selected_epura = useSelector(state=>state.layout.selected_epura)

   const layout_mode =  useSelector(state=>state.layout.layout_mode)


   const do_save_excel = async () =>{

    
    let tmpl = structuredClone(store.getState()).sheet;

   


    let emaker = new ExcelMaker();

     let excel_object = {

      sheets:[]

     }

    let diags = [];

    let pics = [];  

    for (let shh=0;shh<tmpl.sheets.length;shh++) {

   // if (shh!==0) continue;

     let sheet_idx = tmpl.sheets[shh].sheet;


  
    

     let sheet = {

      title:tmpl.sheets[shh].title,

      table_pos:tmpl.sheets[shh].table_pos,

      table_pres:tmpl.sheets[shh].table_pres,
      
      selected:true,
      
      groups:[],

      rows:Object.values(tmpl.trows).filter(o=>o.sheet===sheet_idx).sort((a,b)=>a.rowIndex-b.rowIndex),

      cols:Object.values(tmpl.tcolumns).filter(o=>o.sheet===sheet_idx).sort((a,b)=>a.rowIndex-b.rowIndex),

    }


   



   
    let diags_tmp = Object.values(tmpl.diags).filter(o=>o.sheet===sheet_idx).sort((a,b)=>a.idx-b.idx);

    let pics_tmp = Object.values(tmpl.pics).filter(o=>o.sheet===sheet_idx).sort((a,b)=>a.idx-b.idx);

    let mxx = -1;
    
    for (let ii=0;ii<diags_tmp.length;ii++) {

       if (diags_tmp[ii].idx>mxx) mxx = diags_tmp[ii].idx;   

    }

    for (let ii=0;ii<pics_tmp.length;ii++) {

       if (pics_tmp[ii].idx>mxx) mxx = pics_tmp[ii].idx;   

    }

 


   
    
    for (let ii=0;ii<=mxx;ii++) {

       let dd = diags_tmp.find(o=>o.idx===ii)

       let pp = pics_tmp.find(o=>o.idx===ii)
       
       if (dd) diags.push(dd)
       else diags.push(null)
      
       if (pp) pics.push(pp)
       else pics.push(pp) 


    }
    

    for (let uu =0; uu<=mxx;uu++) {



      if (pics[uu]===null&&diags[uu]===null) continue;

      let group = {pic:null, diag:null}

      
      
      let _left = (pics[uu]&&pics[uu].lfle)?parseFloat(pics[uu].left):(diags[uu])?parseFloat(diags[uu].left):0;

      let _top = (pics[uu]&&pics[uu].lfle)?parseFloat(pics[uu].top):(diags[uu])?parseFloat(diags[uu].top):0;

      let _width = (pics[uu]&&pics[uu].lfle)?parseFloat(pics[uu].width):(diags[uu])?parseFloat(diags[uu].width):0;

      let _height = (pics[uu]&&pics[uu].lfle)?parseFloat(pics[uu].height):(diags[uu])?parseFloat(diags[uu].height):0;
     
      let _x_left =0

      let summ_left =0;

      let summ_left_prev = 0;

      for (let ii=0;ii<sheet.cols.length;ii++) {

       summ_left+=parseFloat(sheet.cols[ii].width)

       if (_left+4<summ_left) break;

       summ_left_prev+=parseFloat(sheet.cols[ii].width)

       _x_left++;

      }


      let _x_right =-1;

      let summ_right = 0;

      let summ_right_prev = 0;
   
      for (let ii=0;ii<sheet.cols.length;ii++) {

        summ_right+=parseFloat(sheet.cols[ii].width)

        if (_left+_width-8<summ_right) break;

        _x_right++;

        summ_right_prev+=parseFloat(sheet.cols[ii].width)

      } 

      let mx = 20;
      
      let _y_top = Math.floor((_top - 10)/mx)
  
      let _y_bottom = Math.floor((_top+_height)/mx);

      group.x_left = _x_left;
  
      group.x_left_off = Math.round((_left+4) - summ_left_prev);
  
      group.y_top = _y_top,
  
      group.y_top_off = Math.round((_top - 10) -_y_top*mx);
  
      group.x_right = _x_right;
  
      group.x_right_off = Math.round(((_left+_width-8) - summ_right_prev));
  
      group.y_bottom = _y_bottom-1;
        
      group.y_bottom_off = Math.round(_top+_height - 10 -(_y_bottom)*mx);


      let pic0 = (pics[uu]&&pics[uu].lfle)?{

          left:parseFloat(pics[uu].left)+4,

          top:parseFloat(pics[uu].top)+20,
  
          width:parseFloat(pics[uu].width)-8,

          height:parseFloat(pics[uu].height)-20
  
           
  
        }:(pics[uu])?{

          left:parseFloat(diags[uu].left)+4,

          top:parseFloat(diags[uu].top)+20,
  
          width:10,

          height:10
  
        }:null

        
        
        
        
        //pic.svg = (contents!=='')? contents: this.app.sheets[0].pictures[uu].lfle


      let svgData = (pics[uu]&&pics[uu].lfle)?pics[uu].lfle

        :'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 1000 1000"></svg>'

     
     

     
        //if ()
   

     svgData ='data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)

     const encodedUri = encodeURIComponent(svgData);

     const latin1String = unescape(encodedUri);


     const svgBase64 = svgData;

     

     var contents = ''

       
     let foreign = (pics[uu].lfle.indexOf('foreignSVG')===-1)?false:true;


        
//     let foreign = this.app.sheets[0].pictures[0].wo.body.querySelector('#foreignSVG');

    
    if (foreign){
    
  
      await loadImage(pics[uu].width-8, pics[uu].height-25,svgBase64);


    }



       pic0.svg = (contents!=='')? contents: pics[uu].lfle


        group.pic = pic0;



        let diag0 = { }

        let ttt = diags[uu].data;


        let base_points = [];
     
   
         

         for (let m=0;m<ttt.points.length; m++) {

              for (let l =0; l< ttt.points[m].length;l++) {

                if (base_points.indexOf(ttt.points[m][l].x)===-1) base_points.push(ttt.points[m][l].x) 

              }

              let ser_names = []
              
              for (let i=0;i<ttt.points.length;i++) ser_names.push('S'+i.toString());
              
              let series = [];

              for (let i=0;i<ser_names.length;i++) {

                let ser=[];

                for (let j=0;j<base_points.length;j++) {

                  ser.push(' ');

                  for (let l=0;l<ttt.points[i].length;l++) {

                    if (ttt.points[i][l].x===base_points[j]) {
                             
                      ser[ser.length-1] = ttt.points[i][l].y

                    }  


                  }

                }

                series.push(ser);

              }

              diag0.ppoints = ttt.points;

              diag0.base_points=base_points;

              diag0.ser_names=ttt.legends;

              let kk=false;

              for (let i = 0; i<diag0.ser_names.length;i++ ) {

                if (diag0.ser_names[i]==='hidden'&&!kk) {diag0.ser_names[i]='K1'; kk= true;}

                if (diag0.ser_names[i]==='hidden'&&kk) {diag0.ser_names[i]='K2'; kk= true;}
                

              }

              diag0.series=series;

              diag0.colors=ttt.colors0;

              diag0.linestyles=ttt.linestyles;

              

              let mw = diags[uu].width; //this.app.sheets[0].diags[uu].wo.frame.style.minWidth;

              let mh = diags[uu].height;//this.app.sheets[0].diags[uu].wo.frame.style.minHeight;
              

              //this.app.sheets[0].diags[uu].wo.frame.style.minWidth = this.app.sheets[0].diags[uu].wo.width +'px'
              //this.app.sheets[0].diags[uu].wo.frame.style.maxWidth = this.app.sheets[0].diags[uu].wo.width +'px'

              //this.app.sheets[0].diags[uu].wo.frame.style.minHeight = this.app.sheets[0].diags[uu].wo.height +'px'
              //this.app.sheets[0].diags[uu].wo.frame.style.maxHeight = this.app.sheets[0].diags[uu].wo.height +'px'
              

              //let wb = this.app.sheets[0].diags[uu].wo.frame.querySelector('.window-body');

              let wbwidth = mw-diags[uu].cleft-diags[uu].cright;//wb.clientWidth;

              let wbheight = mh-diags[uu].ctop-diags[uu].cbottom//wb.clientHeight;

                


              //this.app.sheets[0].diags[uu].wo.frame.style.minWidth = mw
              //this.app.sheets[0].diags[uu].wo.frame.style.maxWidth = mw

              //this.app.sheets[0].diags[uu].wo.frame.style.minHeight = mh
              //this.app.sheets[0].diags[uu].wo.frame.style.maxHeight = mh

             

              diag0.left=parseFloat(diags[uu].left)+4;

              diag0.top=parseFloat(diags[uu].top)+25;


            


  
              diag0.width= wbwidth - 8 

              diag0.height= wbheight - 8 

           
              let lll = true;

              if (lll) { 

                diag0.frac_top = (diags[uu].ctop)/wbheight;

                diag0.frac_bottom = (diags[uu].cbottom+20)/wbheight;

                let tmp = 1 - diag0.frac_top - diag0.frac_bottom;

                diag0.frac_height = (1 - diag0.frac_top - diag0.frac_bottom)/1.1

                diag0.frac_top+=tmp - diag0.frac_height



                diag0.frac_left =  (diags[uu].cleft+50)/wbwidth;

                diag0.frac_right = (diags[uu].cright-8)/wbwidth;

                diag0.frac_width = (1 - diag0.frac_left - diag0.frac_right)/1.1;

             

                diag0.lgend = diags[uu].legend

              
            }  else  {


              diag0.frac_top = (diags[uu].ctop)/wbheight;

              diag0.frac_bottom = (diags[uu].cbottom+20)/wbheight;

              let tmp = 1 - diag0.frac_top - diag0.frac_bottom;

              diag0.frac_height = (1 - diag0.frac_top - diag0.frac_bottom)/1.1

              diag0.frac_top+=tmp - diag0.frac_height



              diag0.frac_left =  (diags[uu].cleft + 50)/wbwidth;

              diag0.frac_right = (diags[uu].cright-8)/wbwidth;

              diag0.frac_width = (1 - diag0.frac_left - diag0.frac_right)/1.1;

             

              diag0.lgend = diags[uu].legend



            }
       



             ;

             
              //let delta = diag.width - diag.width/1.1; 

             

              //diag.left-=delta/2

              //diag.width=diag.width/1.1
              
             
             
              
              //parseFloat(this.app.sheets[0].diags[0].wo.height)-46-parseFloat(this.app.sheets[0].diags[0].ctop)-parseFloat(this.app.sheets[0].diags[0].cbottom)

              //diag.height = diag.height/1.1



             
              



              diag0.xaxmin = (diags[uu].axis_x_min.toString().trim()!=='')?parseFloat(diags[uu].axis_x_min):
                           diags[uu].auto_x_min       

              diag0.xaxmax  = (diags[uu].axis_x_max.toString().trim()!=='')?parseFloat(diags[uu].axis_x_max):
                           diags[uu].auto_x_max

              diag0.yaxmin = (diags[uu].axis_y_min.toString().trim()!=='')?parseFloat(diags[uu].axis_y_min):
                           this.app.sheets[0].diags[uu].auto_y_min

              diag0.yaxmax = (diags[uu].axis_y_max.toString().trim()!=='')?parseFloat(diags[uu].axis_y_max):
                           this.app.sheets[0].diags[uu].auto_y_max


              diag0.axis_y_visibility = diags[uu].axis_y_visible            

              
              //diag.xaxmin = diag.xaxmin - 0.05*(diag.xaxmax - diag.xaxmin) 


           

           
              

              group.diag = diag0;


             

            }


            //group.x_right = 0;
            //group.y_bottom_off = 0;

            sheet.groups.push(group);
              

         




       

        ////////////////////////////////////////////////////////////////////////////////////////

          
       // for (let kk=0;kk<sheet.cols.length; kk++) {

       //    for (let vv=0;vv<sheet.rows.length; vv++) {

      

       //    } 


       // }
        
      //return;


        ////////////////////////////////////////////////////////////////////////////////////////

        
 

    }

     excel_object.sheets.push(sheet)


  }

     //excel_object.sheets.push(sheet2)
        
    
    
    
    
    
    
     await emaker.load(excel_object);


    


   for (let shh=0;shh<tmpl.sheets.length;shh++) {

    //if (shh!==0) continue;

    let sheet_idx = tmpl.sheets[shh].sheet;


      let cells = [];

        let txts = [];

        let colors = [];

        let bgcolors = [];

        let styles = [];

        let borders = [];

        let alignments = [];

        let valignments = [];

        let multicells = [];


        let tcells = {};
       
       if (diags.length) {

          
    
            

          for (let i=0;i<diags.length;i++) {

          // if (diags[i].sheet!==tmpl.sheets[shh].sheet) continue;
         
           let dg = diags[i];
           
           if (!dg.table_data) continue;

          

           //if (tmpl.sheets[shh].table_selected!==dg.data.diag_no) continue;

           let td0 = Object.entries(dg.table_data)

           let td = [];

           for (let rr =0; rr<td0.length;rr++){
              
               let yy = td0[rr][0].split('_');

               if (!yy.length||yy[0]!==tmpl.sheets[shh].table_selected.toString()) continue;

               td.push(td0[rr]);


           }

           if (!td.length) continue;

           let min_x =1000; let min_y =1000;

           for  (let vv =0; vv<td.length;vv++) {
              
               let tmp = td[vv][0].split('_');
               
               if (parseFloat(tmp[1])<min_x) min_x = parseFloat(tmp[1]);
               if (parseFloat(tmp[2])<min_y) min_y = parseFloat(tmp[2]);
               


           } 

           for (let j =0; j<td.length;j++) {

             if (!td[j][1]) continue;
              
             
             let tmp = td[j][0].split('_');

             let shift_x=0;

             let shift_y=0;

             let pos = tmpl.sheets[shh].table_pos.split('$')  //sheet.table_pos.split('$')

             let good = true;

             if (pos.length!==2) good = false;

             if (good) {

               if (pos[0].length>2||pos[0].length===0) good = false;

             }

            if (good) {

             if (pos[0][0]<='A'||pos[0][0]>='Z') good = false;

            }

            if (good&&pos[0].length===2) {

             if (pos[0][1]<='A'||pos[0][1]>='Z') good = false;

           } 

           if (good&&parseFloat(pos[1])>=0) {

            shift_x = getColumnIndex(pos[0]); 
                      
            shift_y = parseFloat(pos[1]);


           } else good = false;


             if (good = false) {
                 
              min_x = 0;

              min_y = 0;



             }

             if (shift_x!==0) shift_x = min_x-parseFloat(shift_x);
            if (shift_y!==0) shift_y = min_y-parseFloat(shift_y)+1;

            let rrr =  td[j][1];

            if (tmpl.sheets[shh].table_pres.toString().trim()!=='') {
                        
             if (rrr&&rrr.toString().trim()!==''&&isNumeric(rrr.toString())) rrr=parseFloat(rrr).toFixed(parseFloat(tmpl.sheets[shh].table_pres)).toString();
            }
             

             tcells[sheets[shh].sheet.toString()+'_'+(parseFloat(tmp[1])+shift_x).toString()+'_'+(parseFloat(tmp[2])+shift_y).toString()] = rrr;


           }
           
           



          }
          

       }

       
      
  
       let tcc = Object.values(tmpl.tcells).filter(o=>o.sheet === sheet_idx).sort((a,b) => (a.y-b.y)||(a.x-b.x));

     
      
       for (let kk=0;kk<tcc.length;kk++) {

           let cell = tcc[kk];

           let val = (cell.is_calculated)?cell.calculated_value:cell.value

           if (tcells[sheet_idx.toString()+'_'+cell.x.toString()+'_'+cell.y.toString()]) {
            
          

            cell.value = tcells[sheet_idx.toString()+'_'+cell.x.toString()+'_'+cell.y.toString()]; 

            val = cell.value

           } 
           if (cell.value.toString().trim()===''/*&&cell.table_value.toString().trim()===''*/) {
                
            if (!cell.extra_border||cell.extra_border==='none'||cell.extra_border==='false') continue;

            }  
            if (cell.font_color===undefined) cell.font_color='#000000'

            let vv = val//(cell.table_value.trim()!=='')?cell.table_value:cell.value
              
            if (cells.find(o=>o.x===cell.x+1&&o.y===cell.y+1)) continue;

            cells.push({x:cell.x+1, y:cell.y+1, txt:vv, color:cell.font_color, font:cell.font.font_size + ' ' +cell.font.font_name, bgcolor:cell.bcolor, style:cell.font.font_style,
            border:(cell.extra_border&&cell.extra_border!=='none')?'full':'', alignment:cell.cell_horz, valignment:cell.cell_vert,  true_text:true})

       }

       cells.sort(function(x1,x2) {
    if (x1.y < x2.y) return -1;
    if (x1.y > x2.y) return 1;
    if (x1.x < x2.x) return -1;
    if (x1.x > x2.x) return 1;
    return 0;})


    let fonts = [];



    for (let i=0;i<cells.length;i++) {
    
      txts.push(cells[i].txt)

      colors.push(cells[i].color)

      fonts.push(cells[i].font)

      bgcolors.push(cells[i].bgcolor)

      styles.push(cells[i].style)

      borders.push(cells[i].border)

      alignments.push(cells[i].alignment)

      valignments.push(cells[i].valignment)
      
    

    }

    
  

    if (cells.length) emaker.add_strings(shh+1, cells, txts, colors, fonts, bgcolors, styles, borders, alignments, valignments);
   
    
   }
  
     emaker.fix_rows()

     emaker.flush();


   





   }



  


   const do_save = async () =>{


    let tmpl = structuredClone(store.getState().sheet);


    if (tmpl.diags) {
    
      let kk = Object.keys(tmpl.diags);

      for (let i=0; i<kk.length;i++) {

        tmpl.diags[kk[i]].data = null; 

        tmpl.diags[kk[i]].table_data = null;

        tmpl.diags[kk[i]].resize_whole = true;
        

      }


    }
   
     let keys = get_cells_keys(tmpl.selected_sheet);
  
      for (let i =0; i<keys.length; i++) {
        
          tmpl.tcells[keys[i]] = tmpl.cells[keys[i]]; 
  
      }
  
      keys = get_columns_keys(tmpl.selected_sheet) 
  
         
  
      for (let i =0; i<keys.length; i++) {
        
          tmpl.tcolumns[keys[i]] = tmpl.columns[keys[i]]; 
  
      }
  
      keys =get_rows_keys(tmpl.selected_sheet)
        
       
  
      for (let i =0; i<keys.length; i++) {
   
         
          tmpl.trows[keys[i]] = tmpl.rows[keys[i]]; 
  
      }
  
  
      tmpl.tselected_cells[tmpl.selected_sheet.toString()] = tmpl.selected_cells[tmpl.selected_sheet.toString()]
      tmpl.tcells_in_range[tmpl.selected_sheet.toString()] = tmpl.cells_in_range[tmpl.selected_sheet.toString()]
      tmpl.tselected_ranges[tmpl.selected_sheet.toString()] = tmpl.selected_ranges[tmpl.selected_sheet.toString()]
  
  

   

     let save_string = JSON.stringify(tmpl)

     await save_to_serv({plotNo:selected_epura.plot_no, templ:encodeURI(save_string) })

     alert('Эпюра сохранена!')

     





   } 


   const sheets = useSelector(state=>state.sheet.sheets) 

   const active_sheet = useSelector(state=>state.sheet.selected_sheet) 

   const generated = useSelector(state=>state.config.generated)

   const dispatch = useDispatch();

   return ( 

  <div className="excel-bottom-bar">
    <div className="sheet-tabs">
      
     <div style={{minWidth:'30px', maxWidth:'30px'}}></div>
       {(layout_mode==='edit')&&<div className="sheet-tab-add" title="Добавить лист" onClick={()=>dispatch(add_sheet())}>+</div>}
      {(layout_mode==='edit')&&<div className="sheet-tab-delete" title="Удалить лист" onClick={()=>dispatch(delete_sheet({sheet:active_sheet}))}>🗑️</div>}
     <div style={{minWidth:'30px', maxWidth:'30px'}}></div>
     
     {sheets.map(item => <SheetTab key = {item.sheet} sheetId = {item.sheet} title={item.title} isActive = {item.sheet===active_sheet}></SheetTab>

     
     )}

     
     
    

      {/* <div className="sheet-nav-arrows"><span>◀</span><span>▶</span></div> */}
    </div>
    <div className="status-right">

      {(layout_mode==='edit')&&<div onClick={()=>do_save()} title='Сохранить изменения' className="view-modes" style={{fontSize:'22px', cursor:'pointer'}}><FontAwesomeIcon icon={faFloppyDisk}/></div>}
      
      
      {!generated&&<div onClick={()=>{if (layout_mode==='edit') dispatch(set_layout_mode('view')); else dispatch(set_layout_mode('edit'));  }} title='Просмотр' className="view-modes" style={{fontSize:'22px', cursor:'pointer', color:`${layout_mode==='view'?'red':'black'}`}}><FontAwesomeIcon icon={faBinoculars}/></div>}
      
        <div onClick={()=>{do_save_excel()}} title='Выгрузить в Excel' className="view-modes" style={{fontSize:'22px', cursor:'pointer', color:'green'}}><FontAwesomeIcon icon={faFileExcel}/></div>

      {/* <div className="zoom-controls"><span>−</span><span>100%</span><span>+</span><span>🔘──────</span></div> */}
      {/* <div className="status-message">Ready</div> */}
    </div>
  </div>)
};
