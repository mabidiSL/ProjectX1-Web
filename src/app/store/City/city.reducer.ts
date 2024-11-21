// src/app/Citylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchCitylistData, fetchCitylistFail, fetchCitylistSuccess } from './city.action';
import { City } from './city.model';

export interface CitylistState {
  CityListdata: City[];
  currentPage: number;
  totalItems: number;
  selectedCity: City,
  loading: boolean;
  error: string;
}

export const initialState: CitylistState = {
  CityListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCity: null,
  loading: false,
  error: null,
};

export const CityListReducer = createReducer(
  initialState,
  on(fetchCitylistData, (state,{ page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCitylistSuccess, (state, { CityListdata }) => ({
    ...state,
    CityListdata: CityListdata.data,
    totalItems: CityListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchCitylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
);
