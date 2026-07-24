
export const points_min_max = (points) =>{

        

         let min_x = (points.length)?parseFloat(points[0][0].x):0
         
         let min_y = (points.length)?parseFloat(points[0][0].y):0 
         
         let max_x = (points.length)?parseFloat(points[0][0].x):0
         
         let max_y = (points.length)?parseFloat(points[0][0].y):0

         for (let i=0;i<points.length;i++) {

             for (let j=0; j<points[i].length;j++) {

               if (parseFloat(points[i][j].x)<min_x) min_x = parseFloat(points[i][j].x)

               if (parseFloat(points[i][j].x)>max_x) max_x = parseFloat(points[i][j].x)

               if (parseFloat(points[i][j].y)<min_y) min_y = parseFloat(points[i][j].y)

               if (parseFloat(points[i][j].y)>max_y) max_y = parseFloat(points[i][j].y)   

             }
         
         }


      let rr = new niceScale(min_y, max_y);

      let rrx = new niceScale(min_x, max_x);   


      return {
        
         auto_x_min:rrx.niceMin,

         auto_x_max:rrx.niceMax,
         
         auto_y_min:rr.niceMin,

         auto_y_max:rr.niceMax,

         auto_y_step:rr.tickSpacing,

         auto_x_step:rrx.tickSpacing,
    
    }   


} 


export class niceScale {

 


  niceNum( localRange,  round) {

    let exponent;
    
    let fraction; 
    
    let niceFraction; 

    exponent = Math.floor(Math.log10(localRange));
    
    fraction = localRange / Math.pow(10, exponent);

    if (round) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
 }



  constructor(min, max){

   this.minPoint = min;
  
   this.maxPoint = max;
  
   this.maxTicks = 6;
  
   

   this.range = this.niceNum(this.maxPoint - this.minPoint, false);
  
   this.tickSpacing = this.niceNum(this.range / (this.maxTicks - 1), true);
  
   this.niceMin = Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
  
   this.niceMax = Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;


  }


}



export const measureText = (frame, font, size, text) => {

 

    let dv = document.createElement('div');

    dv.style.position = 'absolute'

    dv.style.font = size.toString()+'pt '+font;

    dv.style.visibility = 'hidden';

    dv.innerText = text;

    frame.appendChild(dv);

    

 

    let w = dv.getBoundingClientRect();

    dv.remove();

    return w;



  }



