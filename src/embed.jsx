import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EpuraWidget from './EpuraWidget';
import sheetReducer from './sheetSlice';
import contextReducer from './contextSlice';
import layoutReducer from './layoutSlice';
import {apiSlice} from './apiSlice'
import configReducer from './configSlice';



// ----- INIT function (exported) -----




export function init(container, props = {}) {
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;
  if (!containerEl) {
    console.error('Container not found:', container);
    return;
  }


  const baseUrl = props.baseUrl ?? '';
  
  const store = configureStore({
    reducer: { sheet: sheetReducer, cmenu:contextReducer, layout:layoutReducer,  config:configReducer, [apiSlice.reducerPath]: apiSlice.reducer,},
    preloadedState: {

      config:{baseUrl}
      
    //   sheet: { value: props.initialCount ?? 0 },
    },
     middleware: (getDefaultMiddleware) =>

        getDefaultMiddleware({
     serializableCheck: false,   // Disables the check entirely
   }).concat(apiSlice.middleware)


     //getDefaultMiddleware().concat(apiSlice.middleware),
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //immutableCheck: false,
    //serializableCheck: false,
  //})
  });



  const widget = (
    <Provider store={store}>
      <EpuraWidget title={props.title} />
    </Provider>
  );

  const root = ReactDOM.createRoot(containerEl);
  root.render(widget);

  // Store references for potential cleanup
  containerEl.__reactRoot__ = root;
  containerEl.__reduxStore__ = store;
}

// ----- DESTROY function (exported) -----
export function destroy(container) {
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;
  if (containerEl?.__reactRoot__) {
    containerEl.__reactRoot__.unmount();
    delete containerEl.__reactRoot__;
    delete containerEl.__reduxStore__;
  }
}

// ----- Attach to global object for both dev (module) and prod (UMD) -----
if (typeof window !== 'undefined') {
  window.EpuraWidget = window.EpuraWidget || {};
  window.EpuraWidget.init = init;
  window.EpuraWidget.destroy = destroy;
}
