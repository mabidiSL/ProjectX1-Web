// src/app/Quotes.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addQuotes, addQuotesFailure, addQuotesSuccess, deleteQuotes, deleteQuotesFailure, deleteQuotesSuccess, fetchQuotesData, fetchQuotesFail, fetchQuotesSuccess, getQuoteById, getQuoteByIdFailure, getQuoteByIdSuccess, updateQuotes, updateQuotesFailure, updateQuotesSuccess } from './quotes.action';
import { Quote } from './quotes.model';

export interface QuotesState {
  Quotesdata: Quote[];
  currentPage: number;
  totalItems: number;
  selectedQuote: Quote,
  loading: boolean;
  error: string;
}

export const initialState: QuotesState = {
  Quotesdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedQuote: null,
  loading: false,
  error: null,
};

export const QuotesReducer = createReducer(
  initialState,
  on(fetchQuotesData,(state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchQuotesSuccess, (state, { Quotesdata }) => ({
    ...state,
    Quotesdata: Quotesdata.data,
    totalItems: Quotesdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchQuotesFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding Quote 
   on(addQuotes, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Quote success
  on(addQuotesSuccess, (state, { newData }) => ({
    ...state,
    Quotesdata: [newData, ...state.Quotesdata],
    loading: false,
    error: null 

  })),
    //Handle adding Quote failure
    on(addQuotesFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false, 
    })),

    //Handle getting Quote by id
  on(getQuoteById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
  // Handle success of getting Employee by ID and store the Employee object in the state
  on(getQuoteByIdSuccess, (state, { Quote }) => ({
    ...state,
    selectedQuote: Quote,
    loading: false,
    error: null 
  })),
  // Handle success of getting Quote by ID and store the Quote object in the state
  on(getQuoteByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
   // Handle updating Quote list
   on(updateQuotes, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
 
// Handle updating Quote status
  on(updateQuotesSuccess, (state, { updatedData }) => {
   const QuotesUpdated = state.Quotesdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      Quotesdata: QuotesUpdated,
      loading: false,
      error: null
    };
  }),
   // Handle updating Quote failure
   on(updateQuotesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Quote 
  on(deleteQuotes, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Quote
  on(deleteQuotesSuccess, (state, { userId }) => {
    
    const updatedQuotes = state.Quotesdata.filter(Quote => Quote.id !== userId);
    return { 
    ...state,
    Quotesdata: updatedQuotes,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Quote
  on(deleteQuotesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
