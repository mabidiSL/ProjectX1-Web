// src/app/Arealist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchArealistData, fetchArealistFail, fetchArealistSuccess } from './area.action';
import { Area } from './area.model';

export interface ArealistState {
  AreaListdata: Area[];
  currentPage: number;
  totalItems: number;
  selectedArea: Area,
  loading: boolean;
  error: string;
}

export const initialState: ArealistState = {
  AreaListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedArea: null,
  loading: false,
  error: null,
};

export const AreaListReducer = createReducer(
  initialState,
  on(fetchArealistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchArealistSuccess, (state, { AreaListdata }) => ({
    ...state,
    AreaListdata: AreaListdata.data,
    totalItems: AreaListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchArealistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  
);
