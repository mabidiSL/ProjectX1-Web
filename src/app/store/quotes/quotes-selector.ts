// src/app/merchantlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  QuotesState } from './quotes.reducer';

export const selectDataState = createFeatureSelector<QuotesState>('QuoteList');

export const selectDataQuote = createSelector(
  selectDataState,
  (state: QuotesState) => state?.Quotesdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: QuotesState) => state?.totalItems || 0
);

export const selectedQuote = createSelector(
    selectDataState,
    (state: QuotesState) =>  state?.selectedQuote || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: QuotesState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: QuotesState) => state?.error || null
);
