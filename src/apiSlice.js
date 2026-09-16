import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { update_spinner_status } from './layoutSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';



const dynamicBaseQuery = async (args, api, extraOptions) => {
  const state = api.getState();
  const baseUrl = (state.config.baseUrl)?state.config.baseUrl:'./';



  //if (!baseUrl) {
  //  throw new Error('Base URL not configured. Did you set it in init()?');
  //}

  if (args.url) {

   
   //return {data:null};
return fetchBaseQuery({ baseUrl })(args, api, extraOptions);

  } 

  if (args===skipToken) return {data:null}

  if (args.indexOf('bngplotsets.sql')===0) {

    if (state.config.plotsets) return {data:state.config.plotsets};

  }

  if (args.indexOf('bngplotlists.sql')===0) {

    if (state.config.plotlists) return {data:state.config.plotlists};
    
  }


  if (args.indexOf('bngplotlines.sql')===0) {

    if (state.config.plotlines) return {data:state.config.plotlines};
    
  }

  if (args.indexOf('bngplotdiagrams.sql')===0) {

    if (state.config.plotdiagrams) return {data:state.config.plotdiagrams};
    
  }

  if (args.indexOf('PlotData.sql')===0) {

    if (state.config.plotdata) return {data:state.config.plotdata};
    
  }

 if (args.indexOf('CalcPlotTable.sql')===0) {

    if (state.config.plottable) return {data:state.config.plottable};
    
  }


  if (args.indexOf('createtemplateex.sql')===0) {

    return {data:[]};
    
  }

  if (args.indexOf('diagtemplate_new.sql')===0) {


    if (state.config.template) return {data:state.config.template}




  }



  // Use the baseUrl from state for every request
  return fetchBaseQuery({ baseUrl })(args, api, extraOptions);
};

export const apiSlice = createApi({
  // A unique name for the slice in the Redux store
  reducerPath: 'api',
  
  baseQuery: dynamicBaseQuery,//fetchBaseQuery({ baseUrl: 'https://31.44.94.234:63123/BratskGES' }),

  tagTypes: ['EpuraTemplate'],
 
  endpoints: (builder) => ({

    scaffoldEpuraTable: builder.mutation({

      query: () => ({url:`createtemplateex.sql`,
         method:'POST',
        body:''

      }),  


    }),

    

    
    
    
    saveEpura: builder.mutation({

      query: ({plotNo, templ}) => ( {url:`diagtemplateinsex.sql`,

        method:'POST',
        body:'PlotNo='+plotNo.toString()+'&'+'Templ='+templ+'&version=1'

      }),
      invalidatesTags: (result, error) => {
       if (error) return [];
       return [{ type: 'EpuraTemplate' }];
      },

   async onQueryStarted(args, { dispatch, queryFulfilled }) {
    // Перед запросом — включаем спиннер
    dispatch(update_spinner_status(true));

    try {
      await queryFulfilled;
      // После успешного завершения — выключаем спиннер
      dispatch(update_spinner_status(false));
    } catch (error) {
      // В случае ошибки — тоже выключаем
      dispatch(update_spinner_status(false));
      // При необходимости можно обработать ошибку дополнительно
      console.error('Ошибка сохранения:', error);
    }
  },

    }),
 
    
    getEpuraList: builder.query({
      query: () => `bngplots.sql`,
    }),

    getEpuraDates: builder.query({
      query: (plot_no) => `plot_dates_my.sql?PlotNo=${plot_no}`,

      transformResponse: (response) =>{

  
    
        let res = response.map ((item) =>{


            let repl = item.replace.split('T');

            let val = repl[0].split('-');

            

            return {value:item.replace, caption:val[2]+'.'+val[1]+'.'+val[0]+' '+repl[1]}



        })
        
        return res
    
    
    }
    }),

    getEpuraTemplate: builder.query({
      query: ({plot_no, ver}) => `diagtemplate_new.sql?PlotNo=${plot_no}&Ver=${ver}`,
      transformResponse: (response) =>{
         

        //return  (response&&response.length)?((response[0].etemplate_actual&&response[0].etemplate_actual.length)?JSON.parse(response[0].etemplate_actual):JSON.parse(response[0].etemplate)):null;

        
        return  (response&&response.length)?JSON.parse(response[0].template):null;

      }, providesTags: ['EpuraTemplate'],

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
    // Перед запросом — включаем спиннер
    dispatch(update_spinner_status(true));

    try {
      await queryFulfilled;
      // После успешного завершения — выключаем спиннер
      dispatch(update_spinner_status(false));
    } catch (error) {
      // В случае ошибки — тоже выключаем
      dispatch(update_spinner_status(false));
      // При необходимости можно обработать ошибку дополнительно
      console.error('Ошибка сохранения:', error);
    }
  },

   
 
    }),


     getDiagramList: builder.query({
      query: () => `bngplotdiagrams.sql`,
    }),
 

     

  getPlotSet: builder.query({
      query: () => `bngplotsets.sql`,
    }),

  getPlotList: builder.query({
      query: () => `bngplotlists.sql`,
    }),
  

  getPlotLine: builder.query({
      query: () => `bngplotlines.sql`,
    }),


    

 /*getEpuraData: builder.query({
  query: ({plot_no, dates}) => `PlotData.sql?PlotNo=${plot_no}&PlotDates='${dates}'`,

  async onQueryStarted(args, { dispatch, queryFulfilled }) {

    

    // Перед запросом — включаем спиннер
    dispatch(update_spinner_status(true));

    try {
      await queryFulfilled;
      // После успешного завершения — выключаем спиннер
      dispatch(update_spinner_status(false));
    } catch (error) {
      // В случае ошибки — тоже выключаем
      dispatch(update_spinner_status(false));
      // При необходимости можно обработать ошибку дополнительно
      console.error('Ошибка сохранения:', error);
    }
  },

 


}),*/

getEpuraData: builder.query({
  query: (arg) => {
    // Если аргументы пустые — не выполняем запрос
    if (!arg || !arg.plot_no || !arg.dates || arg.dates.length === 0) {
      return skipToken;
    }
    return `PlotData.sql?PlotNo=${arg.plot_no}&PlotDates='${arg.dates}'`;
  },

  async onQueryStarted(args, { dispatch, queryFulfilled }) {
    // Если запрос пропущен — onQueryStarted не вызовется,
    // значит спиннер не включится. Проверять не нужно.
    dispatch(update_spinner_status(true));
    try {
      await queryFulfilled;
      dispatch(update_spinner_status(false));
    } catch (error) {
      dispatch(update_spinner_status(false));
      console.error('Ошибка получения данных:', error);
    }
  },
}),

/*
 getEpuraTable: builder.query({
 

    query: ({plot_no, dates}) => `CalcPlotTable.sql?PlotNo=${plot_no}&PlotDates='${dates}'`,

    async onQueryStarted(args, { dispatch, queryFulfilled }) {
    // Перед запросом — включаем спиннер
    dispatch(update_spinner_status(true));

    try {
      await queryFulfilled;
      // После успешного завершения — выключаем спиннер
      dispatch(update_spinner_status(false));
    } catch (error) {
      // В случае ошибки — тоже выключаем
      dispatch(update_spinner_status(false));
      // При необходимости можно обработать ошибку дополнительно
      console.error('Ошибка сохранения:', error);
    }
  },

 

     

  }),*/

  getEpuraTable: builder.query({
  query: ({ plot_no, dates } = {}) =>
    plot_no != null && dates?.length
      ? { url: `CalcPlotTable.sql?PlotNo=${plot_no}&PlotDates='${dates}'` }
      : skipToken,

  async onQueryStarted(args, { dispatch, queryFulfilled }) {
    dispatch(update_spinner_status(true));
    try {
      await queryFulfilled;
    } catch (error) {
      console.error('Ошибка получения данных:', error);
    } finally {
      dispatch(update_spinner_status(false));
    }
  },
}),

   



 





 







    


   // https://31.44.94.234:63123/BratskGES/plot_dates_my.sql?PlotNo=246
  
    /*
    addNewPost: builder.mutation({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
    }),
   */

  }),
});

// Auto-generated React hooks for each endpoint
export const {useSaveEpuraMutation, useScaffoldEpuraTableMutation, useGetEpuraDataQuery, useGetEpuraTableQuery, useGetPlotSetQuery, useGetPlotListQuery, useGetDiagramListQuery,useGetPlotLineQuery, useGetEpuraListQuery, useGetEpuraDatesQuery, useGetEpuraTemplateQuery } = apiSlice;