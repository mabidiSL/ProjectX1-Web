// src/app/Companies.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCompanies, addCompaniesFailure, addCompaniesSuccess, deleteCompanies, deleteCompaniesFailure, deleteCompaniesSuccess, fetchCompaniesData, fetchCompaniesFail, fetchCompaniesSuccess, getCompanyById, getCompanyByIdFailure, getCompanyByIdSuccess, updateCompanies, updateCompaniesFailure, updateCompaniesSuccess } from './companies.action';
import { Company } from './companies.model';

export interface CompaniesState {
  Companiesdata: Company[];
  currentPage: number;
  totalItems: number;
  selectedCompany: Company,
  loading: boolean;
  error: string;
}

export const initialState: CompaniesState = {
  Companiesdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCompany: null,
  loading: false,
  error: null,
};

export const CompaniesReducer = createReducer(
  initialState,
  on(fetchCompaniesData,(state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCompaniesSuccess, (state, { Companiesdata }) => ({
    ...state,
    Companiesdata: Companiesdata.data,
    totalItems: Companiesdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchCompaniesFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding Company 
   on(addCompanies, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Company success
  on(addCompaniesSuccess, (state, { newData }) => ({
    ...state,
    Companiesdata: [newData, ...state.Companiesdata],
    loading: false,
    error: null 

  })),
    //Handle adding Company failure
    on(addCompaniesFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false, 
    })),

    //Handle getting Company by id
  on(getCompanyById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
  // Handle success of getting Employee by ID and store the Employee object in the state
  on(getCompanyByIdSuccess, (state, { Company }) => ({
    ...state,
    selectedCompany: Company,
    loading: false,
    error: null 
  })),
  // Handle success of getting Company by ID and store the Company object in the state
  on(getCompanyByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
   // Handle updating Company list
   on(updateCompanies, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
 
// Handle updating Company status
  on(updateCompaniesSuccess, (state, { updatedData }) => {
   const CompaniesUpdated = state.Companiesdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      Companiesdata: CompaniesUpdated,
      loading: false,
      error: null
    };
  }),
   // Handle updating Company failure
   on(updateCompaniesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Company 
  on(deleteCompanies, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Company
  on(deleteCompaniesSuccess, (state, { userId }) => {
    
    const updatedCompanies = state.Companiesdata.filter(Company => Company.id !== userId);
    return { 
    ...state,
    Companiesdata: updatedCompanies,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Company
  on(deleteCompaniesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
