// src/app/SpecialDaylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addSpecialDaylist, addSpecialDaylistFailure, addSpecialDaylistSuccess, deleteSpecialDaylist, deleteSpecialDaylistFailure, deleteSpecialDaylistSuccess, fetchSpecialDaylistData, fetchSpecialDaylistFail, fetchSpecialDaylistSuccess, getSpecialDayById, getSpecialDayByIdFailure, getSpecialDayByIdSuccess, updateSpecialDaylist, updateSpecialDaylistFailure, updateSpecialDaylistSuccess } from './special.action';
import { SpecialDay } from './special.model';

export interface SpecialDaylistState {
  SpecialDayListdata: SpecialDay[];
  currentPage: number;
  totalItems: number;
  selectedSpecialDay: SpecialDay;
  loading: boolean;
  error: string;
}

export const initialState: SpecialDaylistState = {
  SpecialDayListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedSpecialDay: null,
  loading: false,
  error: null,
};

export const SpecialDayListReducer = createReducer(
  initialState,
  on(fetchSpecialDaylistData, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchSpecialDaylistSuccess, (state, { SpecialDayListdata }) => ({
    ...state,
    SpecialDayListdata: SpecialDayListdata.data,
    totalItems: SpecialDayListdata.totalItems,
    loading: false,
    error: null 

  })),
  on(fetchSpecialDaylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding SpecialDay 
   on(addSpecialDaylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding SpecialDay success
  on(addSpecialDaylistSuccess, (state, { newData }) => ({
    ...state,
    SpecialDayListdata: [newData,...state.SpecialDayListdata ],
    loading: false,
    error: null

  })),
  //Handle adding SpecialDay failure
  on(addSpecialDaylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
    //Handle getting SpecialDay by id
    on(getSpecialDayById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting SpecialDay by ID and store the SpecialDay object in the state
   on(getSpecialDayByIdSuccess, (state, { SpecialDay }) => ({
    ...state,
    selectedSpecialDay: SpecialDay,
    loading: false,
    error: null

  })),
// Handle failure of getting SpecialDay by ID and store the SpecialDay object in the state
on(getSpecialDayByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Coupon list
on(updateSpecialDaylist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
 // Handle updating SpecialDay status
  on(updateSpecialDaylistSuccess, (state, { updatedData }) => {
   const SpecialDayListUpdated = state.SpecialDayListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      SpecialDayListdata: SpecialDayListUpdated,
      loading: false,
      error: null 
    };
  }),
   // Handle updating SpecialDay failure
   on(updateSpecialDaylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting SpecialDay 
  on(deleteSpecialDaylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a SpecialDay
  on(deleteSpecialDaylistSuccess, (state, { SpecialDayId }) => {
    const updatedSpecialDayList = state.SpecialDayListdata.filter(SpecialDay => SpecialDay.id !== SpecialDayId);
    return { 
    ...state,
    SpecialDayListdata: updatedSpecialDayList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a SpecialDay
  on(deleteSpecialDaylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
