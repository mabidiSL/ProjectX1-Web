// src/app/Loglist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchLoglistData, fetchLoglistFail, fetchLoglistSuccess, getLogById, getLogByIdFailure, getLogByIdSuccess } from './log.actions';
import { Log } from './log.models';

export interface LoglistState {
  LogListdata: Log[];
  currentPage: number;
  totalItems: number;
  selectedLog: Log;
  loading: boolean;
  error: string;
}

export const initialState: LoglistState = {
  LogListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedLog: null,
  loading: false,
  error: null,
};

export const LogListReducer = createReducer(
  initialState,
  on(fetchLoglistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchLoglistSuccess, (state, { LogListdata }) => ({
    ...state,
    LogListdata: LogListdata.data,
    totalItems:LogListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchLoglistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
 
    //Handle getting Log by id
    on(getLogById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting Log by ID and store the Log object in the state
   on(getLogByIdSuccess, (state, { Log }) => ({
    ...state,
    selectedLog: Log,
    loading: false,
    error: null 

  })),
 // Handle success of getting Log by ID and store the Log object in the state
 on(getLogByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),

);
