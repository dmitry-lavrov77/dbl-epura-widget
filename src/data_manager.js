  export const load_data =  
  
  
  async  (epura_no, epura_data_all, epura_data_table, slist, dlist, settings, dg_no = 'dummy') =>

  
    
    
    {

      
        
      
   
       let res_data = [];
    
       let diags = dlist.filter(o=>o.pdiag_plot_no===epura_no);
  
       let start = 0;
  
       let end = diags.length-1;
  
       
       /*
       if (dg_no!=='dummy') {
  
       let idx = diags.findIndex(o=>o.pdiag_no===dg_no)
  
        if (idx!==-1){
  
           start = idx;
  
           end = idx;
  
         }
  
  
         }*/
          
       for (let v= start; v<=end;v++) {
    
         let res = {} 
    
          let fields = [];

    
          let edata = epura_data_all.filter(o=>o.pdiag_no===diags[v].pdiag_no)


    
         res_data.push({diag_no:diags[v].pdiag_no, points:[]})
    
         for (let i =0; i<edata.length;i++) {
       
          let item = edata[i];
        
          if (item.x===null||item.x===undefined||item.x.toString==='') continue;
       
          if (fields.indexOf(item.x)===-1) fields.push(item.x)
    
        }

     
    
        fields.sort((a,b)=>{return parseFloat(a) - parseFloat(b)}) 

    
    
        let points = [];
    
    
        let colors = [];
    
      
        let colors0 = [];
    
        let linestyles = [];
    
      
        let legends = [];
     
    
        let used = [];  
    
     
         
        for (let i =0; i<edata.length;i++) {
    
          let item = edata[i];

          //if (item.x===null||item.x==='null') item.x = 0;
    
          if (item.x===null||item.x===undefined||item.x.toString()==='') continue; 
            
    
          let tt = Object.keys(res).indexOf(item.calc_date.toString()+'_'+item.pline_no.toString()); 
    
          let jjj =slist.findIndex(o=>o.pline_no===item.pline_no)
          
          if (slist[jjj].pline_datescount===2||slist[jjj].pline_datescount==='2') {
    
              if (used.find(o=>o.no===item.pline_no.toString()&&o.legend!==item.calc_date.toString())) continue;
           
              used.push({legend:item.calc_date.toString(), no:item.pline_no.toString()})  

            
    
          }   
    
    
    
    
          
    
         
    
        
    
          if (tt===-1) {
    
              if (jjj!==-1&&(slist[jjj].pline_flags===1))  legends.push("hidden")  
    
              else {
              
                 let tt =   item.calc_date.toString().split('T');

                 let pp = tt[0].split('-')

              

                 let vv = tt[1].split('.')

                 let ww = vv[0].split(':')

               

                 let dd = new Date(parseFloat(pp[0]), parseFloat(pp[1])-1, parseFloat(pp[2]), parseFloat(ww[0]) + 3, parseFloat(ww[1]), parseFloat(ww[2]))

                 if (dd.getHours()!==0||dd.getMinutes()!==0||dd.getSeconds()!==0) legends.push(dd.getDate()+'.'+(parseFloat(dd.getMonth())+1).toString().padStart(2, "0") +'.'+dd.getFullYear()+' '+dd.getHours().toString().padStart(2,"0")+':'+dd.getMinutes().toString().padStart(2,"0")+':'+dd.getSeconds().toString().padStart(2,"0")) 

                 else legends.push(dd.getDate()+'.'+(parseFloat(dd.getMonth())+1).toString().padStart(2, "0") +'.'+dd.getFullYear())
                 
                  //if (legends[legends.length-1].indexOf('00:00:00'))
                 
                
    
                 //let pp =tt[0].split('-')
    
                  //legends.push(pp[2]+'-'+pp[1]+'-'+pp[0]+' '+tt[1])  

                
              
              }    
    
            
              points.push([]);
    
          
              let iii = settings.findIndex(o=>o.pset_no===item.pset_no);
            
              let clr = settings[iii].pset_color.toString(16);
    
           
    
            if (settings[iii].pset_linetype===2||settings[iii].pset_linetype==='2') linestyles.push('dash')
  
            else if (settings[iii].pset_linetype===3 || settings[iii].pset_linetype==='3') linestyles.push('dashdot')

            else if (settings[iii].pset_linetype===0 || settings[iii].pset_linetype==='0') linestyles.push('marker')  
  
            else linestyles.push('')
    
    
            let clrr = ''
            
    
    
            let tt = clr.length
    
    
            for  (let i=0;i<6-tt;i++) clr = '0'+clr; 
    
            clrr = clr[4]+clr[5]+clr[2]+clr[3]+clr[0]+clr[1]
             
          
            colors.push('#'+clrr)
    
            colors0.push(clrr.toUpperCase())
            
          
          
            res[item.calc_date.toString()+'_'+item.pline_no.toString()] = {};
    
            let tt1 = Object.keys(res).indexOf(item.calc_date.toString()+'_'+item.pline_no.toString()); 
         
            for (let j=0;j<fields.length; j++) {

           

              let f = (fields[j]!==null&&fields[j]!==undefined&&fields[j].toString()!=='')?fields[j].toString():''

      

              
              res[item.calc_date.toString()+'_'+item.pline_no.toString()][f] = '';
            
            }
            
            
            res[item.calc_date.toString()+'_'+item.pline_no.toString()][item.x.toString()] = (item.y!==null&&item.y!==undefined&&item.y.toString()!=='')?item.y.toString():''
    
            if (item.y!==null&&item.y!==undefined&&item.y.toString()!=='') {

    
              let mm = parseFloat(item.x);

              if (mm === null) mm = 0;


              points[tt1].push({x:(mm).toString(), y:(parseFloat(item.y)).toString()}) 
    
    
            }
    
    
    
          } else {
  
            res[item.calc_date.toString()+'_'+item.pline_no.toString()][item.x.toString()] = (item.y!==null&&item.y!==undefined&&item.y.toString()!=='')?item.y.toString():''
    
            if (item.y!==null&&item.y!==undefined&&item.y.toString()!=='') {

               let mm = parseFloat(item.x);

              if (mm === null) mm = 0;

    
              points[tt].push({x:(mm).toString(), y:parseFloat(item.y).toString()}) 
    
    
    
            }
    
          }  
    
        } 
    
    

        res_data[res_data.length-1].points = points
    
        res_data[res_data.length-1].colors = colors
    
        res_data[res_data.length-1].colors0 = colors0
    
        res_data[res_data.length-1].linestyles = linestyles

        res_data[res_data.length-1].legends = legends;
        
        
        
      }
    

      let lists = [];

      let l = 1; 

     

      for (let i =0; i< epura_data_table.length;i++) {

        
        if (lists.length===0) {
        
           lists.push({title:'$'+epura_data_table[i].plist_no.toString(), idx:epura_data_table[i].plist_no})
           l++;
           continue;
        }  

        if (!lists.find(o=>o.idx===epura_data_table[i].plist_no)) {


            lists.push({title:'$'+epura_data_table[i].plist_no.toString(), idx:epura_data_table[i].plist_no})
            l++;
        }

      } 
     
      

      return {table_data:epura_data_table, data:res_data, lists:lists}
      
         

    }

