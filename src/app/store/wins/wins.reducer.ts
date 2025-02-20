// src/app/Wins.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addWins, addWinsFailure, addWinsSuccess, deleteWins, deleteWinsFailure, deleteWinsSuccess, fetchWinsData, fetchWinsFail, fetchWinsSuccess, getWinById, getWinByIdFailure, getWinByIdSuccess, updateWins, updateWinsFailure, updateWinsSuccess } from './wins.action';
import { Win } from './wins.model';

export interface WinsState {
  Winsdata: Win[];
  currentPage: number;
  totalItems: number;
  selectedWin: Win,
  loading: boolean;
  error: string;
}

export const initialState: WinsState = {
  Winsdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedWin: null,
  loading: false,
  error: null,
};

export const WinsReducer = createReducer(
  initialState,
  on(fetchWinsData,(state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchWinsSuccess, (state, { Winsdata }) => ({
    ...state,
    Winsdata: Winsdata.data,
    totalItems: Winsdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchWinsFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding Win 
   on(addWins, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Win success
  on(addWinsSuccess, (state, { newData }) => ({
    ...state,
    Winsdata: [newData, ...state.Winsdata],
    loading: false,
    error: null 

  })),
    //Handle adding Win failure
    on(addWinsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false, 
    })),

    //Handle getting Win by id
  on(getWinById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
  // Handle success of getting Employee by ID and store the Employee object in the state
  on(getWinByIdSuccess, (state, { Win }) => ({
    ...state,
    selectedWin: Win,
    loading: false,
    error: null 
  })),
  // Handle success of getting Win by ID and store the Win object in the state
  on(getWinByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
   // Handle updating Win list
   on(updateWins, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
 
// Handle updating Win status
  on(updateWinsSuccess, (state, { updatedData }) => {
   const WinsUpdated = state.Winsdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      Winsdata: WinsUpdated,
      loading: false,
      error: null
    };
  }),
   // Handle updating Win failure
   on(updateWinsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Win 
  on(deleteWins, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Win
  on(deleteWinsSuccess, (state, { userId }) => {
    
    const updatedWins = state.Winsdata.filter(Win => Win.id !== userId);
    return { 
    ...state,
    Winsdata: updatedWins,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Win
  on(deleteWinsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
