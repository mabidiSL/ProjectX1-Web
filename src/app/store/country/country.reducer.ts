// src/app/Countrylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchCountrylistData, fetchCountrylistFail, fetchCountrylistSuccess } from './country.action';
import { Country } from './country.model';

export interface CountrylistState {
  CountryListdata: Country[];
  currentPage: number;
  totalItems: number;
  selectedCountry: Country,
  loading: boolean;
  error: string;
}

export const initialState: CountrylistState = {
  CountryListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCountry: null,
  loading: false,
  error: null,
};

export const CountryListReducer = createReducer(
  initialState,
  on(fetchCountrylistData,  (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCountrylistSuccess, (state, { CountryListdata }) => ({
    ...state,
    CountryListdata: CountryListdata.data,
    totalItems: CountryListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchCountrylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
);
