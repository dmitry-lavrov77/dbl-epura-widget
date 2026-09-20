import React, {useRef, useEffect, useState} from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {useScaffoldEpuraTableMutation,  useGetEpuraDataQuery,useGetEpuraTableQuery,useGetPlotSetQuery,useGetDiagramListQuery,useGetPlotLineQuery, useGetEpuraListQuery, useGetEpuraDatesQuery, useGetEpuraTemplateQuery, useGetPlotListQuery} from './apiSlice'

import {CellProperties} from './CellProperties.jsx'

import {ListProperties} from './ListProperties.jsx'

import {DiagProperties} from './DiagProperties.jsx'

import ExcelApp from './SpreadSheet.jsx'

import {update_left_pane_width, update_right_pane_width, set_epura, toggle_date, set_layout_mode} from './layoutSlice'

import {load_template} from './sheetSlice'

import {load_data} from './data_manager'

import { setEpuraData } from './dataSlice.jsx';




const EpuraListItem = ({plot_name, plot_no, select_epura}) =>{

 
  const selected = useSelector(state=>state.layout.selected_epura)


  return (

    <div onClick={()=> select_epura(plot_no)  } className={`${(selected&&selected.plot_no === plot_no)?'elist-item-selected':'elist-item'}`}>{plot_name}</div>


  )


} 

const DateListItem = ({value, caption, max}) =>{

  const [isChecked, setChecked] = useState(false)

  const ref = useRef(null)

  const dispatch = useDispatch();

 

  const change = (e) =>{

    let cc = 0; 

    let rr = ref.current.parentNode.parentNode.parentNode.querySelectorAll('input')

    for (let i=0;i<rr.length;i++) if (rr[i].checked) cc++;

    if (cc===max+1&&e.target.checked)  {

      alert('Выбрано максимальное число дат!')

       setChecked (false)
       
       return;


    }



     
    dispatch(toggle_date({toggle:e.target.checked, value:e.target.value})) 

    setChecked (e.target.checked)  



  }


  return (


   <div className="elist-item">
      <label><input ref={ref}  onChange = {change}  checked={isChecked} type="checkbox" value={value}/>{caption}</label>
   </div>



  )




}

const DateList = () =>{

   const selected = useSelector(state=>state.layout.selected_epura)

   //const dates_selected = useSelector(state=>state.layout.dates_selected)

   const dates = useGetEpuraDatesQuery((selected)?selected.plot_no:null)

  // const limit_on = (selected.plot_qnt_date === dates_selected.length)

   


   

   
   

   



  


   return <div style={{flex:1, backgroundColor:'white', overflowY:'auto', overflowX:'hidden', minHeight:'20%'}}>

          {(dates.data)?dates.data.map(item => <DateListItem 
                         key = {selected.plot_no+'_'+item.caption} value={item.value} caption={item.caption} max={selected.plot_qnt_date}>

          </DateListItem>):null} 


   </div>


}


const DatesSelected = ()=>{

   const dates_selected = useSelector(state=>state.layout.dates_selected) 



   const selected = useSelector(state=>state.layout.selected_epura)


   return (


    <div>Доступные даты (макс. кол-во - {(selected)?selected.plot_qnt_date:0}): {(dates_selected)?dates_selected.length:0}</div>


   )


}

const SilentPane = () =>{

  
  const dispatch = useDispatch();

  const selected = useSelector(state=>state.layout.selected_epura);

  const template = useGetEpuraTemplateQuery({plot_no:(selected)?selected.plot_no:null, ver:1})

  const plot_set = useGetPlotListQuery();

  
   useEffect(()=>{

   if (template.data&&plot_set.data) {

    const the_list = (plot_set.data)?plot_set.data.filter(o=>o.plist_plot_no===selected.plot_no):[]

   
      
    dispatch(load_template({template:template.data, the_list:the_list}));

  }  }, [template, plot_set])
  

 
  

  return <></>

}



const RightPane = () =>{


  const size = useSelector(store=>store.layout.left)

  const selected = useSelector(state=>state.layout.selected_epura)

  

  
  const dispatch = useDispatch();


  const template = useGetEpuraTemplateQuery({plot_no:(selected)?selected.plot_no:null, ver:1})

  const plot_set = useGetPlotListQuery();

  const plot_set2 = useGetPlotSetQuery();

  const dates = useSelector(state => state.layout.dates_selected)

  const plot_data = useGetEpuraDataQuery({plot_no:selected.plot_no, dates:dates.toString()});

  const plot_table = useGetEpuraTableQuery({plot_no:selected.plot_no, dates:dates.toString()});

  const diagram_list = useGetDiagramListQuery();
   
  const plot_line = useGetPlotLineQuery();
  
 


 
  


  useEffect(()=>{


     const load = async() =>{
  

         //const the_list = (plot_set.data)?plot_set.data.filter(o=>o.plist_plot_no===selected.plot_no):[]
              
         let res = await load_data(selected.plot_no,plot_data.data,plot_table.data,plot_line.data,diagram_list.data, plot_set2.data);
  
         dispatch(setEpuraData(res))
                
         

        
  
          
      //    if (diag_info.diagram_id==-1) dispatch(set_diag_data({sheet:sheet, idx:idx, data:null, table_data:null}))
         
  
      //    else {
           
      //      let iii = res.data.findIndex(o=>o.diag_no===parseFloat(diag_info.diagram_id));
  
            
  
      //      if (iii!==-1&&iii<res.data.length) {
           
              
              
       //       dispatch(set_diag_data({sheet:sheet, idx:idx, data:res.data[iii], table_data:(res.table_data[0])?res.table_data:null}))
          
       //     }
          
       //   }
      
          
    }



    if (dates&&dates.length&&plot_data.data&&plot_table.data&&plot_set2.data&&diagram_list.data&&plot_line.data) load()  
    else  dispatch(setEpuraData(null))       


  }, [dates, plot_data, selected, plot_table,plot_line,diagram_list, plot_set2] )



  useEffect(()=>{
    

    if (template.data&&plot_set.data) {

      const the_list = (plot_set.data)?plot_set.data.filter(o=>o.plist_plot_no===selected.plot_no):[]

   
      
      dispatch(load_template({template:template.data, the_list:the_list}));


    }


  }, [template, plot_set])

  




  return (<div style={{display:'flex', flex:'1', flexDirection:'column', maxWidth:`${size+'%'}`, minWidth:`${size+'%'}`}} >

    <div className='toolbar' style={{fontSize:'18px', fontWeight:'600', justifyContent:'center',color:'darkgreen'}}>Список эпюр:</div>

      <EpuraList></EpuraList>


    <div className='toolbar' style={{fontSize:'18px', fontWeight:'600', justifyContent:'center',color:'darkgreen'}}><DatesSelected></DatesSelected></div>

    <DateList></DateList>
      


  </div>)

} 

let savedScrollTop =0;

const EpuraList = () => {


   const epura_list = useGetEpuraListQuery();

   const plot_set = useGetPlotSetQuery();

   const plot_line = useGetPlotLineQuery();

   const diagram_list = useGetDiagramListQuery();

   //const plot_list = useGetPlotListQuery();

   const selected = useSelector(state=>state.layout.selected_epura)







   const dispatch = useDispatch();

   const scrollRef = useRef(null);

     useEffect(()=>{
     if (scrollRef.current && savedScrollTop > 0) {
       scrollRef.current.scrollTop = savedScrollTop;
     }
   }, [epura_list.data]);

   useEffect(()=>{

    if (epura_list.data) {

      //dispatch(set_epura({plot_info:epura_list.data[0]})) 

        if (epura_list.data && (!selected || selected.plot_no === -1)) {
        dispatch(set_epura({plot_info:epura_list.data[0]}))
       }

    }



   },[epura_list, selected])


   const select_epura = (plot_no)=>{


    let ee = epura_list.data.find(o=>o.plot_no===plot_no)

    if (ee)dispatch(set_epura({plot_info:ee})) 



   }


  const handleScroll = (e) => {
     savedScrollTop = e.target.scrollTop;
   };

   return (

<div onScroll={handleScroll} ref={scrollRef} style={{flex:1, backgroundColor:'white', overflowY:'auto', overflowX:'hidden'}}>
        {

           (epura_list.data&&plot_line.data&&plot_set.data&&diagram_list.data)?epura_list.data.map(item=><EpuraListItem key={item.plot_no} plot_name={item.plot_name} 
                                                                      plot_no={item.plot_no} 
                                                                      select_epura={select_epura}
                                                                     ></EpuraListItem>):null


        }
      </div>  



   )

 

    // </div>


   //)


}


const ObjectSettings = () => {

   const size = useSelector(store=>store.layout.right)

   const selected_object = useSelector((state) => state.sheet.selected_object);

   const selected_epura =  useSelector((state) => state.layout.selected_epura);

   return (

    <div style={{display:'flex', flex:'1', flexDirection:'column', maxWidth:`${size+'%'}`, minWidth:`${size+'%'}`}} >


     {(!selected_object)?<CellProperties></CellProperties>:(selected_object.tpe==='diag')?<DiagProperties></DiagProperties>:null}

      {(!selected_object)?<ListProperties></ListProperties>:null}


    </div>


   )


}

const Divider = ({pos}) =>{

 const dividerRef = useRef(null); 

 const moveing_start = useRef({point:0, width:0, central_width:0, opposite_width:0});

 const is_moveing =useRef(false);

 const side_panel = useRef(null)

 const dispatch = useDispatch();
 
 
 
 useEffect(()=>{

  side_panel.current = (dividerRef.current!==null)?(pos==='left')?dividerRef.current.previousSibling:dividerRef.current.nextSibling:null
 
  //opposite_panel.current = (dividerRef.current!==null)?(pos==='left')?dividerRef.current.nextSibling.nextSibling.nextSibling:
                                                            //      dividerRef.current.previousSibling.previousSibling.previousSibling:null
  //central_panel.current = (dividerRef.current!==null)?(pos==='left')?dividerRef.current.nextSibling:dividerRef.current.previousSibling:null

 }, [])
 
 


  const divider_capture = (e) =>{


     if (!dividerRef.current||!side_panel.current) return;
                                   
     
     dividerRef.current.setPointerCapture(e.pointerId);
                                   
     is_moveing.current = true;
       
     moveing_start.current.point = e.clientX;

     moveing_start.current.width = parseFloat(side_panel.current.style.minWidth);

     moveing_start.current.width_px = parseFloat(side_panel.current.clientWidth);

     moveing_start.current.coeff = parseFloat(side_panel.current.clientWidth)/parseFloat(side_panel.current.style.minWidth);


  

     //moveing_start.current.point = e.clientX;
                                   
     //moveing_start.current.width = parseFloat(side_panel.current.style.minWidth);
                                   
     //moveing_start.current.central_width = parseFloat(central_panel.clientWidth);

     //moveing_start.current.opposite_width = parseFloat(opposite_panel.style.minWidth);                                    
                                   
   }





   const divider_move = (e) =>{

   

    if (!dividerRef.current||!side_panel.current) return;

    if (!is_moveing.current) return;

   

    
    let new_width  = (pos==='left')?moveing_start.current.width_px + e.clientX - moveing_start.current.point:

    moveing_start.current.width_px - e.clientX + moveing_start.current.point


    if (new_width/moveing_start.current.coeff > 40) new_width = 40*moveing_start.current.coeff;

    if (new_width<10) new_width = 10;
    

    side_panel.current.style.minWidth = new_width/moveing_start.current.coeff + '%' 

    side_panel.current.style.maxWidth = new_width/moveing_start.current.coeff + '%'


 }

 

 const divider_release = (e) =>{

  if (!dividerRef.current) return;

 
  is_moveing.current = false;
 
 
  if (!dividerRef.current.hasPointerCapture(e.pointerId)) return;
  
  dividerRef.current.releasePointerCapture(e.pointerId);


  if (pos === 'left') dispatch(update_left_pane_width({size:parseFloat(side_panel.current.style.minWidth)}));

  else dispatch(update_right_pane_width({size:parseFloat(side_panel.current.style.minWidth)}));

 }                               










 

 return (

    <div ref = {dividerRef} onPointerDown={divider_capture} onPointerMove={divider_move} 
           onPointerUp={divider_release} style={{flex:'1', maxWidth:'5px', minWidth:'5px', backgroundColor:'gray', cursor:'col-resize'}} ></div>


   )


}


const CustomSpinner = () => {

  return (
  
  <div  className="custom-spinner" />
  
)

};


const EpuraWidget = ({ title, mode = 'edit' }) => {
  
  const [scaffolded, SetScaffolded] = useState(false)  

  const [mode_set, SetMode] = useState(true) 

  const layout_mode = useSelector(state=>state.layout.layout_mode)
  
  const dispatch = useDispatch();

  const  [scaffold, { isLoading: isUpdating } ]  = useScaffoldEpuraTableMutation();

  const generated = useSelector(state=>state.config.generated)

  const spinner_on = useSelector(state=>state.layout.spinner_count)
  


  useEffect(()=>{

   // window.addEventListener('beforeprint', () => {

   //   dispatch(set_print_mode(true))
   
   // });

   // window.addEventListener('afterprint', () => {
   //   dispatch(set_print_mode(false))
    
   // });






  }, [])


  useEffect(()=>{


   

    const do_scaffold = async () =>{  
      
       console.log('SCAFFOLDING')

       await scaffold();

       SetScaffolded(true)

    }

   

    if (!scaffolded&&(layout_mode==='edit'||generated)) do_scaffold();

    //dispatch(set_layout_mode(mode));

    //SetMode(true);


  },[generated, layout_mode, scaffolded])

  

  //const generated = useSelector(state=>state.config.generated)

  return (
     (mode_set&&layout_mode!=='')? 
      <div style={{position:'relative', width:'100%', height:'100%', display:'flex', flexDirection:'row'}}>
          
   {spinner_on>0&&<div style={{
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  }}>
    <CustomSpinner/>
  </div>}

        {(layout_mode==='edit')?<RightPane></RightPane>:(generated)?<SilentPane></SilentPane>:null}
        
      {(layout_mode==='edit')&&<Divider pos={'left'}></Divider>}
    
      <div className='on-print' style={{flex:'1', overflow:'hidden'}} > 
      
        {scaffolded&&<ExcelApp></ExcelApp>}
      
      </div>

      {(layout_mode==='edit')&&<Divider pos={'right'}></Divider>}

      {(layout_mode==='edit')&&<ObjectSettings></ObjectSettings>} 
    
    </div>:<></>

  );
};

export default EpuraWidget;