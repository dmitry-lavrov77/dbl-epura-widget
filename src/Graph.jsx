import { useDispatch, useSelector } from 'react-redux';
import {useRef, useEffect, useState} from 'react'
import {get_diag_info, set_diag_data, toggle_lock, update_autos} from './sheetSlice'
import {niceScale, points_min_max, measureText} from './graph_math'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faBorderNone, faLock, faLockOpen} from '@fortawesome/free-solid-svg-icons';




const XLock = ({svgMain, ref, params, value, idx}) =>{


    const dispatch = useDispatch();

    const layout_mode = useSelector(state=>state.layout_mode)

    const toggle = () =>{

        dispatch(toggle_lock({sheet:value.sheet, idx:value.idx, axis:'x', number:idx}))

    }

    const [rect, setRect] = useState(null)

    useEffect(() => {
        

     const observer = new ResizeObserver(/*_.throttle(*/() => {

      if (ref.current) {
        
        const boundingRect = ref.current.getBoundingClientRect();
       
        setRect(boundingRect);


      }
    },);

    observer.observe(ref.current);

    return () => observer.disconnect();

    }, [ref, params])



      let locked = true;

      if (idx===1&&value.axis_x_mark1_lock_opened) locked = false;

      if (idx===2&&value.axis_x_mark2_lock_opened) locked = false;
      
                
      let v = (idx===1)?value.axis_x_mark1:value.axis_x_mark2;

      if (v.trim()==='') return <></>

      v = parseFloat(v);

      const point = svgMain.current.createSVGPoint();

      const matrix2 = svgMain.current.getScreenCTM();




      point.y =  (params.y_max>params.y_min)?params.y_min:params.y_max; 
          
      point.x =  (params.x_max-params.x_min>0)?v:params.x_min - v + params.x_max  

      

      const clientPoint = point.matrixTransform(matrix2)

      const left =  clientPoint.x - svgMain.current.getBoundingClientRect().x  +'px';

      const top =  clientPoint.y - svgMain.current.getBoundingClientRect().y +'px';

      return (layout_mode==='edit')?<div onClick = {toggle} style={{cursor:'pointer', transform: 'translate(-50%, -50%)', position:'absolute', color:`${idx===1?'red':'blue'}`, left:`${left}`,top:`${top}`}}>
        {(locked)?<FontAwesomeIcon icon={faLock} />:<FontAwesomeIcon icon={faLockOpen} />}
             </div>:<></>

      


}




const YLock = ({svgMain, ref, params, value, idx}) =>{


    const [rect, setRect] = useState(null)


    const layout_mode = useSelector(state=>state.layout_mode)


       const dispatch = useDispatch();

    const toggle = () =>{

        dispatch(toggle_lock({sheet:value.sheet, idx:value.idx, axis:'y', number:idx}))

    }


    useEffect(() => {



     const observer = new ResizeObserver(/*_.throttle(*/() => {

      if (ref.current) {
        
        const boundingRect = ref.current.getBoundingClientRect();
       
        setRect(boundingRect);


      }
    },/*50)*/);

    observer.observe(ref.current);

    return () => observer.disconnect();

    }, [ref, params])


                
      let v = (idx===1)?value.axis_y_mark1:value.axis_y_mark2;

      if (v.trim()==='') return <></>

      v = parseFloat(v);


      //if (params.y_min<params.y_max) v = params.y_min+params.y_max-v;

        
     let locked = true;

      if (idx===1&&value.axis_y_mark1_lock_opened) locked = false;

      if (idx===2&&value.axis_y_mark2_lock_opened) locked = false;   

      const point = svgMain.current.createSVGPoint();

      const matrix2 = svgMain.current.getScreenCTM();


      point.x =  (params.x_max>params.x_min)?params.x_max:params.x_min; 
          
      point.y =  (params.y_max-params.y_min>0)?params.y_min - v + params.y_max:v  


      const clientPoint = point.matrixTransform(matrix2)

      const left =  clientPoint.x - svgMain.current.getBoundingClientRect().x  +'px';

      const top =  clientPoint.y - svgMain.current.getBoundingClientRect().y +'px';

      return (layout_mode==='edit')?<div onClick={toggle} style={{cursor:'pointer', transform: 'translate(-50%, -50%)', position:'absolute', color:`${idx===1?'red':'blue'}`, left:`${left}`,top:`${top}`}}>
         {(locked)?<FontAwesomeIcon icon={faLock} />:<FontAwesomeIcon icon={faLockOpen} />}
        
        </div>:<></>

      


}




const YScale = ({ticks, params, yRef, ref}) =>{


    const [rect, setRect] = useState(null)

    useEffect(() => {



     const observer = new ResizeObserver(/*_.throttle(*/() => {

      if (yRef.current) {
        
        const boundingRect = yRef.current.getBoundingClientRect();
       
        setRect(boundingRect);


      }
    },/*50)*/);

    observer.observe(ref.current);

    return () => observer.disconnect();

    }, [yRef, params])

    const matrix = yRef.current.getScreenCTM()

    const { a, b, c, d, e, f } = matrix;

    const point = yRef.current.createSVGPoint();

    point.x = 0; 



     return (

      ticks.map((item, index)=>{

               let v = (params.y_max-params.y_min>0)?params.y_min:params.y_max
                
               v = v+(index+1)*params.y_step;

               let yy = v.toString()//(params.y_max-params.y_min>0)?(params.y_max+params.y_min-v).toString():v.toString()

              
          
               point.y =  (params.y_max-params.y_min>0)?v:(params.y_min+params.y_max-v);

               const clientPoint = {y: point.y * d + f};
               // = point.matrixTransform(matrix);

               // const y = ;


               const top = //(params.y_max-params.y_min>0)?clientPoint.y-yRef.current.getBoundingClientRect().y - measureText(ref.current,'Calibri', '9', (v).toString()).height/2 +'px':
                //clientPoint.y-yRef.current.getBoundingClientRect().y - measureText(ref.current, 'Calibri', '9', (v).toString()).height/2 +'px'
                
                
                (params.y_max-params.y_min>0)?clientPoint.y-yRef.current.getBoundingClientRect().y +'px':
                clientPoint.y-yRef.current.getBoundingClientRect().y +'px'
                


               return(<div key ={yy} style={{transform: 'translate(0%, -50%)', font:'9pt Calibri', position:'absolute', right:'10px', top:`${top}`}}>{yy.toString()}</div>)
            
            
            
              })
            )
          
     


}

const XScale = ({ticks_x, params, xRef, ref}) =>{


    const [rect, setRect] = useState(null)

    useEffect(() => {



     const observer = new ResizeObserver(/*_.throttle(*/() => {

      if (xRef.current) {
        
        const boundingRect = xRef.current.getBoundingClientRect();
       
        setRect(boundingRect);


      }
    },/*50)*/);

    observer.observe(ref.current);

    return () => observer.disconnect();

    }, [xRef, params])

     const matrix2 = xRef.current.getScreenCTM()

     const point = xRef.current.createSVGPoint();

     point.y = 0; 

     const { a, b, c, d, e, f } = matrix2;

    return (


        ticks_x.map((item, index)=>{

               let v = (params.x_max-params.x_min>0)?params.x_min:params.x_max
                
               v = v+(index)*params.x_step;

               let yy = (params.x_max-params.x_min>0)?v:v//(params.x_max+params.x_min-v).toString():(params.x_max+params.x_min-v).toString()//:v.toString()
          
               point.x =  (params.x_max-params.x_min>0)?v:(params.x_min+params.x_max-v)//:(params.x_min+params.x_max-v)//v;

               const clientPoint = {x:point.x * a +  e}

               const left =  clientPoint.x - xRef.current.getBoundingClientRect().x  +'px';
               // - measureText(ref.current, 'Calibri', '9', (yy).toString()).width/2 
              
 
               return(<div key={yy} style={{transform:'translate(-50%, 0%)',font:'9pt Calibri', position:'absolute', left:`${left}`, top:'7px'}}>{yy.toString()}</div>)
            
            
            
              })






    )


}


export const Graph = ({sheet, idx, data, mainSVG, ref}) =>{


  const diag_info = useSelector(state => get_diag_info(state, sheet, idx));

  const layout_mode = useSelector(state=>state.layout.layout_mode)



  const [params, setParams] = useState(null)

  //const ref = useRef(null)

  const yRef = useRef(null)

  const xRef = useRef(null)

  const [ticks_rendered, setTR] = useState(false)

  const dispatch = useDispatch();

  useEffect(()=>{

   
      let cc = {}

      let auto_vals = points_min_max(data.points)

      cc.x_min = auto_vals.auto_x_min

      cc.x_max = auto_vals.auto_x_max

      cc.y_min = auto_vals.auto_y_min

      cc.y_max = auto_vals.auto_y_max

      cc.x_step = auto_vals.auto_x_step

      cc.y_step = auto_vals.auto_y_step

      

      
      if  (diag_info.axis_x_min.toString().trim()!=='') cc.x_min = parseFloat(diag_info.axis_x_min);

      if  (diag_info.axis_x_max.toString().trim()!=='') cc.x_max = parseFloat(diag_info.axis_x_max);

      if  (diag_info.axis_y_min.toString().trim()!=='') cc.y_min = parseFloat(diag_info.axis_y_min);

      if  (diag_info.axis_y_max.toString().trim()!=='') cc.y_max = parseFloat(diag_info.axis_y_max);

      if  (diag_info.axis_x_step.toString().trim()!=='') cc.x_step = parseFloat(diag_info.axis_x_step);

      if  (diag_info.axis_y_step.toString().trim()!=='') cc.y_step = parseFloat(diag_info.axis_y_step);


       

      cc.prc = 1.1*(cc.y_max-cc.y_min);

      if (cc.y_min>cc.y_max) cc.prc = 1.1*(cc.y_min-cc.y_max)

      cc.prcx = 1.1*(cc.x_max-cc.x_min);

      if (cc.x_min>cc.x_max) cc.prcx = 1.1*(cc.x_min-cc.x_max);


      cc.vby0 = (cc.y_min - 0.1*(cc.y_max-cc.y_min)).toString(); 
      
      if (cc.y_min>cc.y_max) cc.vby0 = (cc.y_max - 0.1*(cc.y_min-cc.y_max)).toString()
        

      cc.vbx0 = (cc.x_min<cc.x_max)?cc.x_min.toString():cc.x_max.toString()
        
    

      dispatch(update_autos({sheet:diag_info.sheet, idx:diag_info.idx, auto_vals:auto_vals}))

      setParams(cc);



  },[data, diag_info.sheet, diag_info.idx, diag_info.axis_x_min, diag_info.axis_x_max, diag_info.axis_y_min, diag_info.axis_y_max,diag_info.axis_x_step,diag_info.axis_y_step ])

  

  useEffect(()=>{


    if (params) setTR(true)




  },

  [params])







  


  //let vby0 = (min_y - 0.1*(max_y-min_y)).toString(); //(!this.axis_x_visible)?(min_y - 0.05*(max_y-min_y)).toString():(min_y - 0.1*(max_y-min_y)).toString();

  // if (min_y>max_y) vby0 = (max_y - 0.1*(min_y-max_y)).toString()//(!this.axis_x_visible)?(max_y - 0.05*(min_y-max_y)).toString():(max_y - 0.1*(min_y-max_y)).toString();


  // let vbx0 = (min_x<max_x)?min_x.toString():max_x.toString()
   



  const vbb = (params)?params.vbx0 +' ' +params.vby0+ ' '+ params.prcx.toString() +' '+params.prc.toString():''



  let ticks = [];
  let ticks_x=[];
  let text_length = 0;
  let text_height = 0;

  if (params&&ref.current) {

   let tt = (params.y_min<=params.y_max)?params.y_min+params.y_step:params.y_max+params.y_step


   let i=1;






   
   if (tt<=params.y_max)
   while (tt<=params.y_max){

   

    let tx = measureText(ref.current, 'Calibri', '9', (params.y_min + i*params.y_step).toString()); 

    if (tx.width>text_length) text_length = tx.width; 

    if (tx.height>text_height) text_height = tx.height; 


     ticks.push(tt)

     tt+= params.y_step;

     i++
 
  }
  else 
    while (tt<=params.y_min){



    let tx = measureText(ref.current,'Calibri', '9', (params.y_max + i*params.y_step).toString()); 

    if (tx.width>text_length) text_length = tx.width; 

    if (tx.height>text_height) text_height = tx.height; 


     ticks.push(tt)

     tt+= params.y_step;

     i++
 
  }
   tt = (params.x_min<=params.x_max)?params.x_min+params.x_step:params.x_max+params.x_step

   if (tt<=params.x_max){
   while (tt<=params.x_max){

   

    let tx = measureText(ref.current, 'Calibri', '9', (params.x_min + i*params.x_step).toString()); 

    //if (tx.width>text_length) text_length = tx.width; 

    if (tx.height>text_height) text_height = tx.height; 


     ticks_x.push(tt)

     tt+= params.x_step;

     i++
 
  }ticks_x.push(tt)

  }
  else 
    {while (tt<=params.x_min){



    let tx = measureText(ref.current,'Calibri', '9', (params.x_max + i*params.x_step).toString()); 

    //if (tx.width>text_length) text_length = tx.width; 

    if (tx.height>text_height) text_height = tx.height; 


     ticks_x.push(tt)

     tt+= params.x_step;

     i++
 
  }  ticks_x.push(tt)}

  

 }




  
// }


      
        


 let __miny = (params)?(params.y_min<params.y_max)?params.y_min:params.y_max:0
 
 let __maxy = (params)?(params.y_min<params.y_max)?params.y_max:params.y_min:0
        
 let vbb1 = (params)?'0 '+(__miny - 0.1*(__maxy-__miny)).toString() + ' '+(text_length+20).toString()+' '+(params.prc).toString(): '';
       
 
 
 
 
 
 
 let vbb2 = (!params)?'':(params.x_min<params.x_max)?(params.x_min).toString() +' '+ '0' + ' '+(params.prcx).toString()+' '+(text_height + 10).toString():

 (params.x_max).toString() +' '+ '0' + ' '+(params.prcx).toString()+' '+(text_height + 10).toString()
  
  
  return (

    <>
 
             

       {(!params)?null:<>

         <div style={{flex:'1', minWidth: '50px', maxWidth: '50px', maxHeight: `calc(100% - ${(text_height+10).toString()}px)`, position: 'relative'}}>

          
           <svg ref = {yRef} preserveAspectRatio="none" width="100%" height="100%"  viewBox={vbb1}>

              <line strokeWidth="0.4" stroke="black" vectorEffect="non-scaling-stroke" x1={text_length+20} x2={text_length+20}
                
                y1={(params.y_max)} y2={(params.y_min)}>

              </line>

             
                
              
              



              {diag_info.axis_y_visible&&ticks.map((item, index)=>{

                  let v = (params.y_max-params.y_min>0)?params.y_min:params.y_max
                
                  v = v+(index)*params.y_step;

                  let yy = (params.y_max-params.y_min)?(params.y_max+params.y_min-v).toString():v.toString()

                  
                  
                  
                  //pos.push(20*index)

                  return (

                      <>
                  
                      
                  
                      <line key={yy} strokeWidth="0.4" stroke="black" vectorEffect="non-scaling-stroke" x1={text_length+13} 
                         x2={text_length+20} y1={yy} y2={yy}></line>
                         
                         
                         </>
                         
                         )

                      

              })}


          </svg>

            {ticks_rendered&&diag_info.axis_y_visible&&<YScale  ticks ={ticks} params={params} yRef={yRef} ref={ref}></YScale>}

         
        
        
         </div>

         <div style={{flex:'1', display: 'flex', flexDirection: 'column', position:'relative'}}>

              
            
            
             {ticks_rendered&&<XLock svgMain={mainSVG} ref={ref} params={params} value={diag_info} idx={1}></XLock>} 
             {ticks_rendered&&<XLock svgMain={mainSVG} ref={ref} params={params} value={diag_info} idx={2}></XLock>}    


              {ticks_rendered&&<YLock svgMain={mainSVG} ref={ref} params={params} value={diag_info} idx={1}></YLock>} 
              {ticks_rendered&&<YLock svgMain={mainSVG} ref={ref} params={params} value={diag_info} idx={2}></YLock>}    
             


            <svg  ref={mainSVG} preserveAspectRatio='none' width='100%' height='100%' viewBox={vbb}>


              {data.points.map(((item, index)=>{

                  let darray ="";
  
                  if (data.linestyles[index]==='dash') darray = '5,5'
  
                  if (data.linestyles[index]==='dashdot') darray = '6,2,2'


                  let ppp = ''

                  if (data.linestyles[index]!=='marker') {

                     for (let l =0; l<item.length; l++) {
            
             
                       let pplx = (params.x_min<params.x_max)?item[l].x:(params.x_min+params.x_max - item[l].x)


                       if (params.y_min<params.y_max) ppp+=pplx.toString()+','+ (params.y_min+params.y_max-item[l].y).toString() + ' ';

            
                       else ppp+=pplx.toString()+','+ ((item[l].y)).toString() + ' ';
             
                     }   

                  }
                  


                  return (<g key ={index} stroke={data.colors[index]} strokeWidth={'1.5'} strokeDasharray={darray} >

                      {(data.linestyles[index]!=='marker')?
                      
                        <polyline fill={'none'} vectorEffect={'non-scaling-stroke'} points={ppp}>




                        </polyline>
                      
                      
                      :item.map((point, index)=>{


                        let ppllx = (params.x_min<params.x_max)?point.x:(params.x_min+params.x_max - point.x) 
                         

                        return (<line key={index} strokeWidth={'8'} 
                           vectorEffect={'non-scaling-stroke'}

                           x1={pplx.toString()}
                           x2={pplx.toString()}
                           y1={(params.y_min+params.y_max-point.y).toString()}
                           y2={(params.y_min+params.y_max-point.y + 0.0001).toString()}
                           stroke-linecap = {'round'}
                           
                           >

                        </line>)




                      })
                      
                      
                      
                      }
                      

                  </g>)



              }))}




             {(layout_mode==='edit'&&params&&diag_info.axis_x_mark1.trim()!=='')?<line strokeWidth = '1' stroke='red' vectorEffect='non-scaling-stroke' 
               x1={(params.x_min>params.x_max)?params.x_min+params.x_max - parseFloat(diag_info.axis_x_mark1):parseFloat(diag_info.axis_x_mark1)}
               x2={(params.x_min>params.x_max)?params.x_min+params.x_max - parseFloat(diag_info.axis_x_mark1):parseFloat(diag_info.axis_x_mark1)} 

               y1={params.y_min} y2 = {params.y_max} > 
                 
             </line>:null}


            {(layout_mode==='edit'&&params&&diag_info.axis_x_mark2.trim()!=='')?<line strokeWidth = '1' stroke='blue' vectorEffect='non-scaling-stroke' 
               x1={(params.x_min>params.x_max)?params.x_min+params.x_max - parseFloat(diag_info.axis_x_mark2):parseFloat(diag_info.axis_x_mark2)}
               x2={(params.x_min>params.x_max)?params.x_min+params.x_max - parseFloat(diag_info.axis_x_mark2):parseFloat(diag_info.axis_x_mark2)} 

               y1={params.y_min} y2 = {params.y_max} > 
                 
             </line>:null}



             {(layout_mode==='edit'&&params&&diag_info.axis_y_mark1.trim()!=='')?<line strokeWidth = '1' stroke='red' vectorEffect='non-scaling-stroke' 
               y1={(params.y_min<params.y_max)?params.y_min+params.y_max - parseFloat(diag_info.axis_y_mark1):parseFloat(diag_info.axis_y_mark1)}
               y2={(params.y_min<params.y_max)?params.y_min+params.y_max - parseFloat(diag_info.axis_y_mark1):parseFloat(diag_info.axis_y_mark1)} 

               x1={params.x_min} x2 = {params.x_max} > 
                 
             </line>:null}


            {(layout_mode==='edit'&&params&&diag_info.axis_y_mark2.trim()!=='')?<line strokeWidth = '1' stroke='blue' vectorEffect='non-scaling-stroke' 
               y1={(params.y_min<params.y_max)?params.y_min+params.y_max - parseFloat(diag_info.axis_y_mark2):parseFloat(diag_info.axis_y_mark2)}
               y2={(params.y_min<params.y_max)?params.y_min+params.y_max - parseFloat(diag_info.axis_y_mark2):parseFloat(diag_info.axis_y_mark2)} 

               x1={params.x_min} x2 = {params.x_max} > 
                 
             </line>:null}








            </svg>
            


         <div  style={{flex:'1', maxHeight:`${(text_height+10).toString()+'px'}`, minHeight:`${(text_height+10).toString()+'px'}`, position:'relative'}}>
            
           <svg ref={xRef} preserveAspectRatio="none" width="100%" height="100%" viewBox={vbb2}>

             <line key={'0_0_0'} strokeWidth="0.4" stroke="black" vectorEffect="non-scaling-stroke" x1={params.x_min} x2={params.x_max}
                
                y1={0} y2={0}>

             </line>

             {diag_info.axis_x_visible&&ticks_x.map((item, index)=>{

                  let v = (params.x_max-params.x_min>0)?params.x_min:params.x_max
                
                  v = v+(index)*params.x_step;

                  //let yy = (params.y_max-params.y_min)?(params.y_max+params.y_min-v).toString():v.toString()


                   let yy = (params.x_max-params.x_min>0)?v:params.x_max+params.x_min-v

                          
            
                  
                  
                  
                  //pos.push(20*index)

                  return (

                      <>
                  
                      
                  
                      <line key={yy} strokeWidth="0.4" stroke="black" vectorEffect="non-scaling-stroke" x1={yy} 
                         x2={yy} y1={0} y2={5}></line>
                         
                         
                         </>
                         
                         )

                      

              })}


          </svg>

           {ticks_rendered&&diag_info.axis_x_visible&&<XScale  ticks_x ={ticks_x} params={params} xRef={xRef} ref={ref}></XScale>}

        
        </div>

          
          


         </div></>


       }
    
      
    
    </>



  )


}
