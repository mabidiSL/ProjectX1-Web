// src/app/Countrylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCountrylist, addCountrylistFailure, addCountrylistSuccess, deleteCountrylist, deleteCountrylistFailure, deleteCountrylistSuccess, fetchCountrylistData, fetchCountrylistFail, fetchCountrylistSuccess, getCountryById, getCountryByIdFailure, getCountryByIdSuccess, updateCountrylist, updateCountrylistFailure, updateCountrylistSuccess } from './country.action';

export interface CountrylistState {
  CountryListdata: any[];
  currentPage: number;
  totalItems: number;
  selectedCountry: any,
  loading: boolean;
  error: any;
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
  on(fetchCountrylistData,  (state, { page, itemsPerPage, status }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCountrylistSuccess, (state, { CountryListdata }) => ({
    ...state,
    CountryListdata: CountryListdata.data,
    totalItems: CountryListdata.totalItems,
    loading: false
  })),
  on(fetchCountrylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Country 
  on(addCountrylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Country success
  on(addCountrylistSuccess, (state, { newData }) => ({
    ...state,
    CountryListdata: [newData,...state.CountryListdata],
    loading: false
  })),
    //Handle adding Country failure
    on(addCountrylistFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false 
    })),
    //Handle getting Country by id
  on(getCountryById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting Employee by ID and Country the Employee object in the state
  on(getCountryByIdSuccess, (state, { Country }) => ({
    ...state,
    selectedCountry: Country
  })),
  // Handle success of getting Country by ID and store the Country object in the state
  on(getCountryByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  // Handle updating Country list
  on(updateCountrylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
// Handle updating Country 
  on(updateCountrylistSuccess, (state, { updatedData }) => {
   const CountryListUpdated = state.CountryListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      CountryListdata: CountryListUpdated,
      loading: false,
      error: null
    };
  }),
  // Handle updating Country failure
  on(updateCountrylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Country 
  on(deleteCountrylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Country
  on(deleteCountrylistSuccess, (state, { CountryId }) => {
    const updatedCountryList = state.CountryListdata.filter(Country => Country.id !== CountryId);
    return { 
    ...state,
    CountryListdata: updatedCountryList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Country
  on(deleteCountrylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
