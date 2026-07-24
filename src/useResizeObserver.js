import { useEffect, useRef, useState } from 'react';

export default function useResizeObserver() {
  
 const ref = useRef(null);
  
 const [rect, setRect] = useState(null);

  
  
  useEffect(() => {



    const observer = new ResizeObserver(/*_.throttle(*/() => {

      if (ref.current) {
        
        const boundingRect = ref.current.getBoundingClientRect();
       
        setRect(boundingRect);


      }
    },/*50)*/);

    observer.observe(ref.current);

    return () => observer.disconnect();

  }, [ref]);

  return [ref, rect];
}
