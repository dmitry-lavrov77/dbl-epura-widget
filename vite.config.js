import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: true,
   
  },
  plugins: [react()],
  build:{

    

    
    rollupOptions: {
  
          
      output: {
          //format: 'cjs',
          assetFileNames: (assetInfo) => {
              if (assetInfo.name == 'index.css')
                  
              return 'epura_widget.css'
  
              return assetInfo.name
          },
          entryFileNames: `epura_widget.js`,
      }
  }}

})
