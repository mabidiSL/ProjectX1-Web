// src/app/Storelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addStorelist, addStorelistFailure, addStorelistSuccess, deleteStorelist, deleteStorelistFailure, deleteStorelistSuccess, fetchStorelistData, fetchStorelistFail, fetchStorelistSuccess, getStoreById, getStoreByIdFailure, getStoreByIdSuccess, updateStorelist, updateStorelistFailure, updateStorelistSuccess } from './store.action';

export interface StorelistState {
  StoreListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedStore: any,
  loading: boolean;
  error: any;
}

export const initialState: StorelistState = {
  StoreListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedStore: null,
  loading: false,
  error: null,
};

export const StoreListReducer = createReducer(
  initialState,
  on(fetchStorelistData,(state, { page, itemsPerPage }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchStorelistSuccess, (state, { StoreListdata }) => ({
    ...state,
    StoreListdata: StoreListdata.data,
    totalItems: StoreListdata.totalItems,
    loading: false
  })),
  on(fetchStorelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),


  //Handle adding Store 
  on(addStorelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Store success
  on(addStorelistSuccess, (state, { newData }) => ({
    ...state,
    StoreListdata: [newData,...state.StoreListdata ],
    loading: false
  })),
   //Handle adding Store failure
   on(addStorelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
//Handle getting Store by id
on(getStoreById, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
  on(getStoreByIdSuccess, (state, { Store }) => ({
    ...state,
    selectedStore: Store,
    loading: false,
    error: null 
  })),
   // Handle success of getting Store by ID and store the Store object in the state
   on(getStoreByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
 // Handle updating Store list
 on(updateStorelist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
// Handle updating Store Success
  on(updateStorelistSuccess, (state, { updatedData }) => {
   const StoreListUpdated = state.StoreListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('StoreListdata after update:', StoreListUpdated);
   return {
      ...state,
      StoreListdata: StoreListUpdated,
      loading: false,
      error: null 
    };
  }),
  // Handle updating Store failure
  on(updateStorelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Store 
  on(deleteStorelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Store
  on(deleteStorelistSuccess, (state, { storeId }) => {
    
    const updatedStoreList = state.StoreListdata.filter(Store => Store.id !== storeId);
    return { 
    ...state,
    StoreListdata: updatedStoreList,
    loading: false,
    error: null };
  }),
  // Handle failure of deleting a Store
  on(deleteStorelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
